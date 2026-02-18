// xray-upload.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // lit automatiquement le fichier .env

async function getXrayToken() {
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!email || !apiToken) {
    throw new Error('❌ JIRA_EMAIL and JIRA_API_TOKEN must be set');
  }

  const response = await axios.post(
    'https://xray.cloud.getxray.app/api/v2/authenticate',
    { client_id: email, client_secret: apiToken }
  );

  return response.data; // token Bearer
}

async function uploadToXray() {
  try {
    console.log('📤 Uploading test results to Xray Cloud...');

    const token = await getXrayToken();
    const junitFile = path.join('test-results', 'junit.xml');

    if (!fs.existsSync(junitFile)) {
      console.error('❌ JUnit file not found:', junitFile);
      process.exit(1);
    }

    const projectKey = process.env.JIRA_PROJECT_KEY;
    const testPlanKey = process.env.XRAY_TEST_PLAN_KEY;
    const testExecutionKey = process.env.XRAY_TEST_EXECUTION_KEY; // optionnel

    if (!projectKey) throw new Error('❌ JIRA_PROJECT_KEY must be set');

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

    const junitContent = fs.readFileSync(junitFile, 'utf8');
    const form = new FormData();
    form.append('file', junitContent, {
      filename: 'junit.xml',
      contentType: 'application/xml'
    });

    const headers = {
      ...form.getHeaders(),
      'Authorization': `Bearer ${token}`
    };

    let uploadUrl = 'https://xray.cloud.getxray.app/api/v2/import/execution/junit';
    let params = new URLSearchParams();

    if (testExecutionKey) {
      params.append('testExecKey', testExecutionKey);
    } else {
      params.append('projectKey', projectKey);
      if (testPlanKey) params.append('testPlanKey', testPlanKey);
    }

    const fullUrl = `${uploadUrl}?${params.toString()}`;
    console.log(`📡 Upload URL: ${fullUrl}`);

    const response = await axios.post(fullUrl, form, { headers });
    const testExecKey = response.data.testExecIssue?.key || response.data.key || testExecutionKey;

    console.log('\n✅ Test results uploaded!');
    console.log(`📋 Test Execution Key: ${testExecKey}`);
    console.log(`🔗 Test Execution URL: https://xray.cloud.getxray.app/browse/${testExecKey}`);

    // Générer un résumé simple
    fs.writeFileSync('test-results/xray-summary.json', JSON.stringify({
      testExecutionKey: testExecKey,
      testExecutionUrl: `https://xray.cloud.getxray.app/browse/${testExecKey}`,
      uploadedAt: new Date().toISOString()
    }, null, 2));

    console.log('💾 Summary saved to test-results/xray-summary.json');

  } catch (err) {
    console.error('\n❌ Upload failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

uploadToXray();
