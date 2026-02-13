const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function uploadToXray() {
  try {
    console.log('📤 Uploading test results to Xray...');

    const authHeader = fs.readFileSync('.xray-token', 'utf8').trim();
    const junitFile = path.join('test-results', 'junit.xml');
    
    if (!fs.existsSync(junitFile)) {
      console.error('❌ JUnit file not found:', junitFile);
      console.error('💡 Make sure your tests have run and generated junit.xml');
      process.exit(1);
    }

    const testExecutionKey = process.env.XRAY_TEST_EXECUTION_KEY;
    const testPlanKey = process.env.XRAY_TEST_PLAN_KEY;
    const projectKey = process.env.JIRA_PROJECT_KEY;
    const jiraBaseUrl = process.env.JIRA_BASE_URL;

    if (!projectKey) {
      throw new Error('❌ JIRA_PROJECT_KEY must be set');
    }

    // Métadonnées GitHub
    const githubRunId = process.env.GITHUB_RUN_ID || 'local';
    const githubRunNumber = process.env.GITHUB_RUN_NUMBER || '0';
    const githubSha = process.env.GITHUB_SHA || 'local';
    const githubRef = process.env.GITHUB_REF_NAME || 'local';
    const githubActor = process.env.GITHUB_ACTOR || 'local-user';
    const githubRepo = process.env.GITHUB_REPOSITORY || 'local/repo';

    console.log('\n📋 Configuration:');
    console.log(`   Project: ${projectKey}`);
    console.log(`   Test Plan: ${testPlanKey || 'None'}`);
    console.log(`   Test Execution: ${testExecutionKey || 'Will be created'}`);
    console.log(`   GitHub Run: #${githubRunNumber}`);

    // Lire le contenu du fichier JUnit
    const junitContent = fs.readFileSync(junitFile, 'utf8');
    
    // Créer le formulaire multipart
    const form = new FormData();
    form.append('file', junitContent, {
      filename: 'junit.xml',
      contentType: 'application/xml'
    });

    let response;
    let uploadUrl;

    const headers = {
      ...form.getHeaders(),
      'Authorization': authHeader
    };

    if (!testExecutionKey) {
      console.log('\n🆕 Creating new Test Execution...');
      
      // URL pour créer une nouvelle Test Execution
      // Pour Xray Cloud, utiliser l'API Raven (compatible avec Jira API Token)
      uploadUrl = `${jiraBaseUrl}/rest/raven/2.0/import/execution/junit`;
      
      const params = new URLSearchParams({
        projectKey: projectKey
      });
      
      if (testPlanKey) {
        params.append('testPlanKey', testPlanKey);
      }

      const fullUrl = `${uploadUrl}?${params.toString()}`;
      console.log(`📡 Upload URL: ${fullUrl}`);

      response = await axios.post(fullUrl, form, { headers });

    } else {
      console.log(`\n🔄 Updating existing Test Execution: ${testExecutionKey}`);
      
      uploadUrl = `${jiraBaseUrl}/rest/raven/2.0/import/execution/junit`;
      
      const params = new URLSearchParams({
        testExecKey: testExecutionKey
      });

      const fullUrl = `${uploadUrl}?${params.toString()}`;
      console.log(`📡 Upload URL: ${fullUrl}`);

      response = await axios.post(fullUrl, form, { headers });
    }

    // Extraire la clé de Test Execution
    const testExecKey = response.data.testExecIssue?.key || 
                        response.data.key || 
                        testExecutionKey;

    if (!testExecKey) {
      console.error('❌ Could not determine Test Execution key from response');
      console.error('Response:', JSON.stringify(response.data, null, 2));
      process.exit(1);
    }

    console.log('\n✅ Test results uploaded successfully!');
    console.log(`📋 Test Execution Key: ${testExecKey}`);
    console.log(`🔗 Test Execution URL: ${jiraBaseUrl}/browse/${testExecKey}`);

    // Mettre à jour la description de la Test Execution
    const executionDescription = generateExecutionDescription(
      githubRepo, githubRef, githubSha, githubActor, 
      githubRunNumber, githubRunId, testPlanKey
    );

    await updateTestExecutionDescription(
      authHeader, testExecKey, executionDescription, jiraBaseUrl
    );

    // Sauvegarder le résumé
    const summary = {
      testExecutionKey: testExecKey,
      testExecutionUrl: `${jiraBaseUrl}/browse/${testExecKey}`,
      uploadedAt: new Date().toISOString(),
      githubRunId: githubRunId,
      githubRunNumber: githubRunNumber,
      githubSha: githubSha,
      githubRef: githubRef
    };

    fs.writeFileSync('test-results/xray-summary.json', JSON.stringify(summary, null, 2));
    console.log('💾 Summary saved to test-results/xray-summary.json');
    
    // Outputs pour GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `test_execution_key=${testExecKey}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `test_execution_url=${jiraBaseUrl}/browse/${testExecKey}\n`);
    }

    // Générer le résumé des tests
    await generateTestSummary(junitFile);

    console.log('\n🎉 Upload completed successfully!');

  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n💡 Authentication error - Check your JIRA_EMAIL and JIRA_API_TOKEN');
      } else if (error.response.status === 404) {
        console.error('\n💡 Not found error - Possible causes:');
        console.error('   - Xray is not installed on your Jira instance');
        console.error('   - The API endpoint URL is incorrect');
        console.error('   - Check if you are using Xray Cloud or Server/DC');
      } else if (error.response.status === 400) {
        console.error('\n💡 Bad request - Possible causes:');
        console.error('   - Invalid project key');
        console.error('   - Invalid test plan key');
        console.error('   - JUnit XML format issue');
      }
    }
    
    process.exit(1);
  }
}

function generateExecutionDescription(repo, ref, sha, actor, runNumber, runId, testPlan) {
  return `Automated test execution from GitHub Actions

*GitHub Information:*
- Repository: ${repo}
- Branch: ${ref}
- Commit: ${sha?.substring(0, 7)}
- Triggered by: ${actor}
- Run Number: ${runNumber}
- [View Run|https://github.com/${repo}/actions/runs/${runId}]

*Test Plan:* ${testPlan || 'N/A'}

_Uploaded automatically via Jira API_`;
}

async function updateTestExecutionDescription(authHeader, issueKey, description, jiraBaseUrl) {
  try {
    console.log(`\n📝 Updating Test Execution description...`);
    
    await axios.put(
      `${jiraBaseUrl}/rest/api/2/issue/${issueKey}`,
      {
        fields: {
          description: description
        }
      },
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Description updated');
  } catch (error) {
    console.warn('⚠️  Could not update description:', error.message);
    // Ne pas faire échouer le script si la description ne peut pas être mise à jour
  }
}

async function generateTestSummary(junitFile) {
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser();
  
  const xmlContent = fs.readFileSync(junitFile, 'utf8');
  
  parser.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error('⚠️  Error parsing JUnit XML:', err);
      return;
    }

    const testsuites = result.testsuites || result.testsuite;
    const suites = Array.isArray(testsuites?.testsuite) 
      ? testsuites.testsuite 
      : [testsuites];
    
    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    suites.forEach(suite => {
      if (!suite || !suite.$) return;
      const tests = suite.$;
      total += parseInt(tests.tests || 0);
      failed += parseInt(tests.failures || 0) + parseInt(tests.errors || 0);
      skipped += parseInt(tests.skipped || 0);
    });

    passed = total - failed - skipped;

    const summary = {
      total,
      passed,
      failed,
      skipped,
      successRate: total > 0 ? ((passed / total) * 100).toFixed(1) : 0,
      timestamp: new Date().toISOString()
    };

    console.log('\n📊 Test Summary:');
    console.log(`   Total:        ${total}`);
    console.log(`   ✅ Passed:    ${passed}`);
    console.log(`   ❌ Failed:    ${failed}`);
    console.log(`   ⏭️  Skipped:   ${skipped}`);
    console.log(`   📈 Success:   ${summary.successRate}%`);

    fs.writeFileSync('test-results/summary.json', JSON.stringify(summary, null, 2));
  });
}

// Install xml2js if needed
try {
  require('xml2js');
} catch (e) {
  console.log('📦 Installing xml2js...');
  require('child_process').execSync('npm install xml2js', { stdio: 'inherit' });
}

uploadToXray();
