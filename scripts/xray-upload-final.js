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
      console.error('❌ junit.xml not found');
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

    // Étape 1: Créer Test Execution
    console.log('🆕 Creating Test Execution...');
    
    const issueData = {
      fields: {
        project: { key: projectKey },
        summary: `Automated Test Run - ${new Date().toLocaleString('fr-FR')}`,
        issuetype: { name: "Exécution de test" },
        description: `Exécution automatique Playwright

*Détails:*
- Date: ${new Date().toLocaleString('fr-FR')}
- Run: #${process.env.GITHUB_RUN_NUMBER || 'Local'}
- Branch: ${process.env.GITHUB_REF_NAME || 'local'}
- Commit: ${process.env.GITHUB_SHA?.substring(0, 7) || 'N/A'}
${testPlanKey ? `• Test Plan: ${testPlanKey}` : ''}

Les résultats sont importés depuis JUnit XML.`
      }
    };

    let testExecKey;
    
    try {
      const createResponse = await axios.post(
        `${jiraBaseUrl}/rest/api/2/issue`,
        issueData,
        { headers }
      );
      testExecKey = createResponse.data.key;
      console.log(`✅ Test Execution: ${testExecKey}`);
      console.log(`   ${jiraBaseUrl}/browse/${testExecKey}\n`);
    } catch (error) {
      // Essayer avec nom anglais
      issueData.fields.issuetype.name = "Test Execution";
      const createResponse = await axios.post(
        `${jiraBaseUrl}/rest/api/2/issue`,
        issueData,
        { headers }
      );
      testExecKey = createResponse.data.key;
      console.log(`✅ Test Execution: ${testExecKey}\n`);
    }

    // Étape 2: Attacher le fichier JUnit XML
    console.log('📎 Attaching JUnit XML file...');
    
    const form = new FormData();
    form.append('file', fs.createReadStream(junitFile), 'junit.xml');

    const attachHeaders = {
      ...form.getHeaders(),
      'Authorization': authHeader,
      'X-Atlassian-Token': 'no-check'
    };

    try {
      await axios.post(
        `${jiraBaseUrl}/rest/api/2/issue/${testExecKey}/attachments`,
        form,
        { headers: attachHeaders }
      );
      console.log('✅ JUnit XML attached\n');
    } catch (error) {
      console.warn('⚠️  Could not attach file:', error.message);
    }

    // Étape 3: Lier au Test Plan si fourni
    if (testPlanKey) {
      console.log(`🔗 Linking to Test Plan ${testPlanKey}...`);
      try {
        await axios.post(
          `${jiraBaseUrl}/rest/api/2/issueLink`,
          {
            type: { name: "Relates" },
            inwardIssue: { key: testExecKey },
            outwardIssue: { key: testPlanKey }
          },
          { headers }
        );
        console.log('✅ Linked to Test Plan\n');
      } catch (error) {
        console.warn('⚠️  Could not link to Test Plan\n');
      }
    }

    // Étape 4: Analyser les résultats
    await generateSummary(junitFile, testExecKey, jiraBaseUrl);

    // Étape 5: Ajouter un commentaire avec les résultats
    const summaryData = JSON.parse(fs.readFileSync('test-results/summary.json', 'utf8'));
    
    const comment = `*Résultats des tests automatisés*

| Métrique | Valeur |
|----------|--------|
| Total | ${summaryData.total} |
| ✅ Réussis | ${summaryData.passed} |
| ❌ Échoués | ${summaryData.failed} |
| ⏭️ Ignorés | ${summaryData.skipped} |
| 📊 Taux de réussite | ${summaryData.successRate}% |

${process.env.GITHUB_RUN_ID ? `[Voir l'exécution GitHub|https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}]` : ''}

_Le fichier JUnit XML est attaché à cette issue._`;

    try {
      await axios.post(
        `${jiraBaseUrl}/rest/api/2/issue/${testExecKey}/comment`,
        { body: comment },
        { headers }
      );
      console.log('💬 Comment added with results\n');
    } catch (error) {
      console.warn('⚠️  Could not add comment\n');
    }

    // Sauvegarder le résumé
    const xraySummary = {
      testExecutionKey: testExecKey,
      testExecutionUrl: `${jiraBaseUrl}/browse/${testExecKey}`,
      uploadedAt: new Date().toISOString(),
      results: summaryData
    };

    fs.writeFileSync('test-results/xray-summary.json', JSON.stringify(xraySummary, null, 2));

    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `test_execution_key=${testExecKey}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `test_execution_url=${jiraBaseUrl}/browse/${testExecKey}\n`);
    }

    console.log('🎉 Upload completed!\n');
    console.log('📝 Next steps:');
    console.log(`   1. Open: ${jiraBaseUrl}/browse/${testExecKey}`);
    console.log(`   2. In Xray menu, click "Import Execution Results"`);
    console.log(`   3. Select the attached junit.xml file`);
    console.log(`   4. Or manually import from test-results/junit.xml\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

async function generateSummary(junitFile, testExecKey, jiraBaseUrl) {
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser();
  const xmlContent = fs.readFileSync(junitFile, 'utf8');
  
  parser.parseString(xmlContent, (err, result) => {
    if (err) return;

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
    console.log(`   ⏭️ Skipped: ${skipped}`);
    console.log(`   📈 Success: ${successRate}%\n`);

    const summary = { total, passed, failed, skipped, successRate, timestamp: new Date().toISOString() };
    fs.writeFileSync('test-results/summary.json', JSON.stringify(summary, null, 2));
  });
}

try { require('xml2js'); } catch (e) {
  require('child_process').execSync('npm install xml2js', { stdio: 'inherit' });
}

uploadToXray();