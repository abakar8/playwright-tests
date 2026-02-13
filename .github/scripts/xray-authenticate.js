const axios = require('axios');
const fs = require('fs');

async function authenticateXray() {
  try {
    console.log('🔐 Authenticating with Jira API Token...');

    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraToken = process.env.JIRA_API_TOKEN;
    const jiraBaseUrl = process.env.JIRA_BASE_URL;

    if (!jiraEmail || !jiraToken) {
      throw new Error('❌ JIRA_EMAIL and JIRA_API_TOKEN must be set in GitHub Secrets');
    }

    if (!jiraBaseUrl) {
      throw new Error('❌ JIRA_BASE_URL must be set in GitHub Secrets');
    }

    // Créer le token Basic Auth
    const basicAuth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
    const authHeader = `Basic ${basicAuth}`;
    
    // Tester la connexion
    console.log('🔍 Testing connection to Jira...');
    const testResponse = await axios.get(
      `${jiraBaseUrl}/rest/api/2/myself`,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Connected as: ${testResponse.data.displayName} (${testResponse.data.emailAddress})`);
    
    // Sauvegarder le token pour les prochaines étapes
    fs.writeFileSync('.xray-token', authHeader);
    fs.writeFileSync('.xray-auth-method', 'basic_auth');
    
    console.log('✅ Authentication successful');
    console.log(`📧 User: ${jiraEmail}`);
    console.log(`🔗 Jira URL: ${jiraBaseUrl}`);
    
    return authHeader;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n💡 Tips:');
        console.error('   - Verify your JIRA_EMAIL is correct');
        console.error('   - Verify your JIRA_API_TOKEN is valid');
        console.error('   - Create a new token at: https://id.atlassian.com/manage-profile/security/api-tokens');
      }
    }
    process.exit(1);
  }
}

authenticateXray();