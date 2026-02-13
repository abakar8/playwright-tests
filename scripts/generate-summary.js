const fs = require('fs');
const path = require('path');

function generateSummary() {
  const junitFile = path.join('merged-results', 'junit.xml');
  
  if (!fs.existsSync(junitFile)) {
    // Essayer dans test-results
    const altPath = path.join('test-results', 'junit.xml');
    if (fs.existsSync(altPath)) {
      console.log('📋 Using junit.xml from test-results/');
      fs.copyFileSync(altPath, junitFile);
    } else {
      console.error('❌ JUnit file not found in merged-results/ or test-results/');
      process.exit(1);
    }
  }

  const xml2js = require('xml2js');
  const parser = new xml2js.Parser();
  const xmlContent = fs.readFileSync(junitFile, 'utf8');
  
  parser.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error('❌ Error parsing JUnit XML:', err);
      process.exit(1);
    }

    const testsuites = result.testsuites;
    const attrs = testsuites.$;
    
    const total = parseInt(attrs.tests || 0);
    const failures = parseInt(attrs.failures || 0);
    const errors = parseInt(attrs.errors || 0);
    const skipped = parseInt(attrs.skipped || 0);
    const failed = failures + errors;
    const passed = total - failed - skipped;
    
    const summary = {
      total: total,
      passed: passed,
      failed: failed,
      skipped: skipped,
      successRate: total > 0 ? ((passed / total) * 100).toFixed(1) : 0,
      time: parseFloat(attrs.time || 0),
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('merged-results/summary.json', JSON.stringify(summary, null, 2));
    
    console.log('✅ Summary generated');
    console.log(JSON.stringify(summary, null, 2));
  });
}

try {
  require('xml2js');
} catch (e) {
  console.log('📦 Installing xml2js...');
  require('child_process').execSync('npm install xml2js', { stdio: 'inherit' });
}

generateSummary();