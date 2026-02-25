const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function uploadToXray() {
  try {
    console.log('🚀 Starting Xray upload process...\n');

    // ========================================
    // 1. CONFIGURATION
    // ========================================
    const authHeader = fs.readFileSync('.xray-token', 'utf8').trim();
    const junitFile = path.join('test-results', 'junit.xml');
    
    if (!fs.existsSync(junitFile)) {
      console.error('❌ junit.xml not found in test-results/');
      console.error('💡 Run "npm test" first to generate test results');
      process.exit(1);
    }

    const projectKey = process.env.JIRA_PROJECT_KEY || 'OR';
    const jiraBaseUrl = process.env.JIRA_BASE_URL;
    const testPlanKey = process.env.XRAY_TEST_PLAN_KEY;

    // Métadonnées GitHub Actions
    const eventType = process.env.GITHUB_EVENT_NAME || 'manual';
    const branch = process.env.GITHUB_REF_NAME || 'local';
    const runNumber = process.env.GITHUB_RUN_NUMBER || Date.now().toString().slice(-4);
    const actor = process.env.GITHUB_ACTOR || 'local-user';
    const sha = process.env.GITHUB_SHA?.substring(0, 7) || 'N/A';
    const runId = process.env.GITHUB_RUN_ID;
    const repository = process.env.GITHUB_REPOSITORY;

    console.log('📋 Configuration:');
    console.log(`   Project: ${projectKey}`);
    console.log(`   Jira: ${jiraBaseUrl}`);
    console.log(`   Test Plan: ${testPlanKey || 'None'}`);
    console.log(`   Event: ${eventType}`);
    console.log(`   Branch: ${branch}`);
    console.log(`   Run: #${runNumber}\n`);

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    // ========================================
    // 2. GÉNÉRER NOMENCLATURE INTELLIGENTE
    // ========================================
    let executionName;
    let labels = ['automated', 'ci', 'playwright'];

    if (eventType === 'push') {
      executionName = `CI Push - ${branch} - #${runNumber}`;
      labels.push('push', branch.replace('/', '-'));
    } else if (eventType === 'pull_request') {
      const prNumber = process.env.GITHUB_PR_NUMBER || 'unknown';
      executionName = `CI PR #${prNumber} - ${branch} - #${runNumber}`;
      labels.push('pull-request', `pr-${prNumber}`);
    } else if (eventType === 'schedule') {
      executionName = `CI Scheduled - Regression - ${new Date().toLocaleDateString('fr-FR')}`;
      labels.push('scheduled', 'regression');
    } else if (eventType === 'workflow_dispatch') {
      executionName = `CI Manual - ${branch} - ${new Date().toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
      labels.push('manual');
    } else {
      executionName = `CI ${eventType} - ${branch} - #${runNumber}`;
    }

    // ========================================
    // 3. ANALYSER LES RÉSULTATS
    // ========================================
    console.log('📊 Analyzing test results...');
    const testResults = await analyzeJUnit(junitFile);
    
    console.log(`   Total: ${testResults.total}`);
    console.log(`   ✅ Passed: ${testResults.passed}`);
    console.log(`   ❌ Failed: ${testResults.failed}`);
    console.log(`   ⏭️ Skipped: ${testResults.skipped}`);
    console.log(`   📈 Success: ${testResults.successRate}%\n`);

    // Ajouter label selon résultats
    if (testResults.successRate === 100) {
      labels.push('all-passed');
    } else if (testResults.failed > 0) {
      labels.push('has-failures');
    }

    // ========================================
    // 4. CRÉER TEST EXECUTION
    // ========================================
    console.log('🆕 Creating Test Execution in Jira...');

    const issueData = {
      fields: {
        project: { key: projectKey },
        summary: executionName,
        issuetype: { name: "Exécution de test" },
        labels: labels,
        description: generateDescription(
          eventType, branch, runNumber, actor, sha, 
          testPlanKey, testResults, repository, runId
        )
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
      console.log(`✅ Test Execution created: ${testExecKey}`);
      console.log(`   ${jiraBaseUrl}/browse/${testExecKey}\n`);
    } catch (error) {
      // Essayer avec nom anglais
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

    // ========================================
    // 5. ATTACHER JUNIT XML
    // ========================================
    console.log('📎 Attaching JUnit XML file...');
    
    const form = new FormData();
    form.append('file', fs.createReadStream(junitFile), {
      filename: 'junit-results.xml',
      contentType: 'application/xml'
    });

    const attachHeaders = {
      ...form.getHeaders(),
      'Authorization': authHeader,
      'X-Atlassian-Token': 'no-check'
    };

    try {
      await axios.post(
        `${jiraBaseUrl}/rest/api/2/issue/${testExecKey}/attachments`,
        form,
        { headers: attachHeaders, maxBodyLength: Infinity }
      );
      console.log('✅ JUnit XML attached successfully\n');
    } catch (error) {
      console.warn('⚠️  Could not attach file:', error.message);
      console.log('   File can be uploaded manually\n');
    }

    // ========================================
    // 6. LIER AU TEST PLAN
    // ========================================
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
        console.log('✅ Linked to Test Plan successfully\n');
      } catch (error) {
        console.warn('⚠️  Could not link to Test Plan:', error.message);
        console.log('   You can link manually in Jira\n');
      }
    }

    // ========================================
    // 7. AJOUTER COMMENTAIRE AVEC RÉSULTATS
    // ========================================
    console.log('💬 Adding results comment...');
    
    const comment = generateResultsComment(testResults, repository, runId, testResults.failedTests);

    try {
      await axios.post(
        `${jiraBaseUrl}/rest/api/2/issue/${testExecKey}/comment`,
        { body: comment },
        { headers }
      );
      console.log('✅ Comment added with detailed results\n');
    } catch (error) {
      console.warn('⚠️  Could not add comment\n');
    }

    // ========================================
    // 8. SAUVEGARDER RÉSUMÉ
    // ========================================
    const xraySummary = {
      testExecutionKey: testExecKey,
      testExecutionUrl: `${jiraBaseUrl}/browse/${testExecKey}`,
      testPlanKey: testPlanKey,
      uploadedAt: new Date().toISOString(),
      context: {
        eventType,
        branch,
        runNumber,
        actor,
        sha
      },
      results: testResults
    };

    fs.writeFileSync('test-results/xray-summary.json', JSON.stringify(xraySummary, null, 2));
    fs.writeFileSync('test-results/summary.json', JSON.stringify({
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      successRate: testResults.successRate
    }, null, 2));

    // Outputs pour GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      const output = [
        `test_execution_key=${testExecKey}`,
        `test_execution_url=${jiraBaseUrl}/browse/${testExecKey}`,
        `tests_total=${testResults.total}`,
        `tests_passed=${testResults.passed}`,
        `tests_failed=${testResults.failed}`,
        `success_rate=${testResults.successRate}`
      ].join('\n');
      
      fs.appendFileSync(process.env.GITHUB_OUTPUT, output + '\n');
    }

    // ========================================
    // 9. RÉSUMÉ FINAL
    // ========================================
    console.log('═══════════════════════════════════════');
    console.log('✅ UPLOAD COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log(`📋 Test Execution: ${testExecKey}`);
    console.log(`🔗 URL: ${jiraBaseUrl}/browse/${testExecKey}`);
    console.log(`📊 Results: ${testResults.passed}/${testResults.total} passed (${testResults.successRate}%)`);
    console.log('\n📝 Next steps:');
    console.log(`   1. Open: ${jiraBaseUrl}/browse/${testExecKey}`);
    console.log(`   2. In Xray, click "..." menu`);
    console.log(`   3. Select "Import Execution Results"`);
    console.log(`   4. Choose "JUnit" format`);
    console.log(`   5. Select the attached "junit-results.xml"`);
    console.log('   6. Click "Import"\n');
    console.log('🎉 All test results will be linked automatically!\n');

  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

async function analyzeJUnit(junitFile) {
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser();
  const xmlContent = fs.readFileSync(junitFile, 'utf8');
  
  return new Promise((resolve, reject) => {
    parser.parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const testsuites = result.testsuites || result.testsuite;
      const suites = Array.isArray(testsuites?.testsuite) 
        ? testsuites.testsuite 
        : [testsuites];
      
      let total = 0, passed = 0, failed = 0, skipped = 0;
      const failedTests = [];

      suites.forEach(suite => {
        if (suite?.$) {
          total += parseInt(suite.$.tests || 0);
          failed += parseInt(suite.$.failures || 0) + parseInt(suite.$.errors || 0);
          skipped += parseInt(suite.$.skipped || 0);
        }

        // Récupérer les tests échoués
        if (suite.testcase && Array.isArray(suite.testcase)) {
          suite.testcase.forEach(testcase => {
            if (testcase.failure || testcase.error) {
              failedTests.push({
                name: testcase.$.name || 'Unknown',
                class: testcase.$.classname || '',
                error: (testcase.failure?.[0]?._ || testcase.error?.[0]?._ || 'Unknown error').substring(0, 500)
              });
            }
          });
        }
      });

      passed = total - failed - skipped;
      const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

      resolve({ 
        total, 
        passed, 
        failed, 
        skipped, 
        successRate: parseFloat(successRate),
        failedTests 
      });
    });
  });
}

function generateDescription(eventType, branch, runNumber, actor, sha, testPlanKey, results, repository, runId) {
  const emoji = results.successRate === 100 ? '🎉' : results.successRate >= 80 ? '✅' : '⚠️';
  
  return `${emoji} *Exécution automatique CI/CD*

h3. Contexte d'exécution

|| Propriété || Valeur ||
| Type | ${eventType} |
| Branche | {{${branch}}} |
| Build | #${runNumber} |
| Commit | {{${sha}}} |
| Déclenché par | ${actor} |
| Date | ${new Date().toLocaleString('fr-FR')} |
${testPlanKey ? `| Test Plan | [${testPlanKey}|../browse/${testPlanKey}] |` : ''}

h3. Résultats des tests

|| Métrique || Valeur ||
| Total | ${results.total} |
| {color:#00875A}✓ Réussis{color} | ${results.passed} |
| {color:#DE350B}✗ Échoués{color} | ${results.failed} |
| {color:#5E6C84}⊘ Ignorés{color} | ${results.skipped} |
| {color:#0052CC}Taux de réussite{color} | *${results.successRate}%* |

h3. Environnement

* Plateforme: ${process.env.CI ? 'GitHub Actions (Self-Hosted Runner)' : 'Local'}
* OS: Windows (XAMPP)
* Framework: Playwright
* Navigateur: Chromium

h3. Fichiers

Le fichier {{junit-results.xml}} est attaché à cette issue et contient tous les résultats détaillés.

*Pour importer les résultats dans Xray:*
# Cliquer sur le menu {{...}} en haut à droite
# Sélectionner {{Import Execution Results}}
# Choisir le format {{JUnit}}
# Sélectionner le fichier {{junit-results.xml}} attaché
# Cliquer sur {{Import}}

${runId && repository ? `\nh3. Liens\n\n[Voir l'exécution GitHub Actions|https://github.com/${repository}/actions/runs/${runId}]` : ''}

----
_Généré automatiquement par le pipeline CI/CD_`;
}

function generateResultsComment(results, repository, runId, failedTests) {
  const emoji = results.successRate === 100 ? '🎉' : results.successRate >= 80 ? '✅' : '⚠️';
  
  let comment = `${emoji} *Résultats détaillés de l'exécution*

|| Métrique || Valeur ||
| Total | ${results.total} |
| {color:#00875A}✓ Réussis{color} | ${results.passed} |
| {color:#DE350B}✗ Échoués{color} | ${results.failed} |
| {color:#5E6C84}⊘ Ignorés{color} | ${results.skipped} |
| {color:#0052CC}Taux de réussite{color} | *${results.successRate}%* |
`;

  if (failedTests && failedTests.length > 0) {
    comment += `\nh3. {color:#DE350B}Tests échoués{color}\n\n`;
    failedTests.forEach((test, index) => {
      comment += `h4. ${index + 1}. ${test.name}\n\n`;
      comment += `{code:title=Error}\n${test.error}\n{code}\n\n`;
    });
  }

  if (runId && repository) {
    comment += `\nh3. Liens\n\n`;
    comment += `[Voir l'exécution complète|https://github.com/${repository}/actions/runs/${runId}]\n`;
  }

  comment += `\n_Commentaire généré automatiquement le ${new Date().toLocaleString('fr-FR')}_`;

  return comment;
}

// Install xml2js if needed
try {
  require('xml2js');
} catch (e) {
  console.log('📦 Installing xml2js...');
  require('child_process').execSync('npm install xml2js', { stdio: 'inherit' });
}

uploadToXray();