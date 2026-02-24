const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function uploadToXray() {
  try {
    console.log('📤 Uploading test results to Xray...\n');

    const authHeader = fs.readFileSync('.xray-token', 'utf8').trim();
    const junitFile = path.join('test-results', 'junit.xml');
    
    if (!fs.existsSync(junitFile)) {
      console.error('❌ junit.xml not found in test-results/');
      process.exit(1);
    }

    const projectKey = process.env.JIRA_PROJECT_KEY || 'OR';
    const jiraBaseUrl = process.env.JIRA_BASE_URL;
    const testPlanKey = process.env.XRAY_TEST_PLAN_KEY;

    console.log('📋 Configuration:');
    console.log(`   Project: ${projectKey}`);
    console.log(`   Jira: ${jiraBaseUrl}`);
    console.log(`   Test Plan: ${testPlanKey || 'None'}\n`);

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    // Étape 1: Créer une Test Execution via API Jira
    console.log('🆕 Creating Test Execution issue...');
    
    const issueData = {
      fields: {
        project: { key: projectKey },
        summary: `Test Execution - ${new Date().toLocaleString('fr-FR')}`,
        issuetype: { name: "Exécution de test" },  // Le nom en français !
        description: `Exécution automatique des tests Playwright

*Informations:*
- Date: ${new Date().toLocaleString('fr-FR')}
- Source: GitHub Actions
- Run: #${process.env.GITHUB_RUN_NUMBER || 'Local'}
- Branch: ${process.env.GITHUB_REF_NAME || 'local'}

_Résultats importés depuis JUnit XML_`
      }
    };

    // Lier au Test Plan si fourni
    if (testPlanKey) {
      // Le champ pour lier au Test Plan (dépend de la config Xray)
      issueData.fields.labels = [`test-plan-${testPlanKey}`];
    }

    let testExecKey;
    
    try {
      const createResponse = await axios.post(
        `${jiraBaseUrl}/rest/api/2/issue`,
        issueData,
        { headers }
      );

      testExecKey = createResponse.data.key;
      console.log(`✅ Test Execution created: ${testExecKey}`);
      console.log(`   URL: ${jiraBaseUrl}/browse/${testExecKey}\n`);

    } catch (error) {
      console.error('❌ Failed to create Test Execution:', error.response?.data || error.message);
      
      // Essayer avec le nom anglais
      console.log('Trying with English name...');
      issueData.fields.issuetype.name = "Test Execution";
      
      const createResponse = await axios.post(
        `${jiraBaseUrl}/rest/api/2/issue`,
        issueData,
        { headers }
      );

      testExecKey = createResponse.data.key;
      console.log(`✅ Test Execution created: ${testExecKey}\n`);
    }

    // Étape 2: Importer les résultats JUnit dans cette Test Execution
    console.log('📤 Importing JUnit results...');

    const junitContent = fs.readFileSync(junitFile, 'utf8');
    const form = new FormData();
    form.append('file', junitContent, {
      filename: 'junit.xml',
      contentType: 'application/xml'
    });

    const uploadHeaders = {
      ...form.getHeaders(),
      'Authorization': authHeader
    };

    // Essayer différents endpoints Xray
    const endpoints = [
      `${jiraBaseUrl}/rest/raven/2.0/import/execution/junit?testExecKey=${testExecKey}`,
      `${jiraBaseUrl}/rest/raven/1.0/import/execution/junit?testExecKey=${testExecKey}`,
    ];

    let importSuccess = false;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying: ${endpoint.split('?')[0]}`);
        
        const uploadResponse = await axios.post(endpoint, form, { 
          headers: uploadHeaders,
          maxBodyLength: Infinity
        });

        console.log('✅ JUnit results imported successfully!\n');
        importSuccess = true;
        break;

      } catch (error) {
        console.log(`❌ Failed (${error.response?.status || error.message})`);
      }
    }

    if (!importSuccess) {
      console.warn('\n⚠️  Could not import JUnit via API');
      console.log('✅ But Test Execution was created!');
      console.log('💡 You can manually import junit.xml:');
      console.log(`   1. Go to ${jiraBaseUrl}/browse/${testExecKey}`);
      console.log(`   2. Click "..." → Import JUnit XML`);
      console.log(`   3. Upload: test-results/junit.xml\n`);
    }

    // Étape 3: Analyser et afficher le résumé
    await generateSummary(junitFile, testExecKey, jiraBaseUrl);

    // Sauvegarder pour GitHub Actions
    const summary = {
      testExecutionKey: testExecKey,
      testExecutionUrl: `${jiraBaseUrl}/browse/${testExecKey}`,
      uploadedAt: new Date().toISOString(),
      importSuccess: importSuccess
    };

    fs.writeFileSync('test-results/xray-summary.json', JSON.stringify(summary, null, 2));

    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `test_execution_key=${testExecKey}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `test_execution_url=${jiraBaseUrl}/browse/${testExecKey}\n`);
    }

    console.log('🎉 Process completed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

async function generateSummary(junitFile, testExecKey, jiraBaseUrl) {
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser();
  
  const xmlContent = fs.readFileSync(junitFile, 'utf8');
  
  parser.parseString(xmlContent, (err, result) => {
    if (err) {
      console.warn('⚠️  Could not parse JUnit');
      return;
    }

    const testsuites = result.testsuites || result.testsuite;
    const suites = Array.isArray(testsuites?.testsuite) ? testsuites.testsuite : [testsuites];
    
    let total = 0, passed = 0, failed = 0, skipped = 0;

    suites.forEach(suite => {
      if (suite?.$) {
        total += parseInt(suite.$.tests || 0);
        failed += parseInt(suite.$.failures || 0) + parseInt(suite.$.errors || 0);
        skipped += parseInt(suite.$.skipped || 0);
      }
    });

    passed = total - failed - skipped;
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

    console.log('📊 Test Summary:');
    console.log(`   Total:     ${total}`);
    console.log(`   ✅ Passed:  ${passed}`);
    console.log(`   ❌ Failed:  ${failed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📈 Success: ${successRate}%\n`);

    const summary = { total, passed, failed, skipped, successRate, timestamp: new Date().toISOString() };
    fs.writeFileSync('test-results/summary.json', JSON.stringify(summary, null, 2));

    console.log(`🔗 View in Jira: ${jiraBaseUrl}/browse/${testExecKey}\n`);
  });
}

try {
  require('xml2js');
} catch (e) {
  require('child_process').execSync('npm install xml2js', { stdio: 'inherit' });
}

uploadToXray();