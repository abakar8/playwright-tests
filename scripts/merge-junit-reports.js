const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

async function mergeJUnitReports() {
  const resultsDir = 'merged-results';
  const outputFile = path.join(resultsDir, 'junit.xml');
  
  if (!fs.existsSync(resultsDir)) {
    console.log('❌ Directory merged-results does not exist');
    process.exit(1);
  }

  const junitFiles = fs.readdirSync(resultsDir)
    .filter(file => file.startsWith('junit-') && file.endsWith('.xml'));

  if (junitFiles.length === 0) {
    console.log('⚠️  No JUnit files found to merge, looking for single junit.xml...');
    
    // Chercher un fichier junit.xml simple
    const singleJunit = path.join(resultsDir, 'junit.xml');
    if (fs.existsSync(singleJunit)) {
      console.log('✅ Found single junit.xml, using it directly');
      return;
    }
    
    console.log('❌ No JUnit files found at all');
    process.exit(1);
  }

  console.log(`📦 Merging ${junitFiles.length} JUnit files...`);

  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder({
    xmldec: { version: '1.0', encoding: 'UTF-8' }
  });

  const mergedSuites = {
    testsuites: {
      $: {
        name: 'Playwright Tests',
        tests: 0,
        failures: 0,
        errors: 0,
        skipped: 0,
        time: 0
      },
      testsuite: []
    }
  };

  for (const file of junitFiles) {
    const filePath = path.join(resultsDir, file);
    const xmlContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      const result = await parser.parseStringPromise(xmlContent);
      
      if (result.testsuites && result.testsuites.testsuite) {
        const suites = Array.isArray(result.testsuites.testsuite) 
          ? result.testsuites.testsuite 
          : [result.testsuites.testsuite];
        
        suites.forEach(suite => {
          mergedSuites.testsuites.testsuite.push(suite);
          
          const attrs = suite.$;
          mergedSuites.testsuites.$.tests += parseInt(attrs.tests || 0);
          mergedSuites.testsuites.$.failures += parseInt(attrs.failures || 0);
          mergedSuites.testsuites.$.errors += parseInt(attrs.errors || 0);
          mergedSuites.testsuites.$.skipped += parseInt(attrs.skipped || 0);
          mergedSuites.testsuites.$.time += parseFloat(attrs.time || 0);
        });
      }
    } catch (error) {
      console.warn(`⚠️  Error parsing ${file}:`, error.message);
    }
  }

  const xml = builder.buildObject(mergedSuites);
  fs.writeFileSync(outputFile, xml);
  
  console.log(`✅ Merged ${junitFiles.length} reports into ${outputFile}`);
  console.log(`   📊 Total tests: ${mergedSuites.testsuites.$.tests}`);
  console.log(`   ❌ Failures: ${mergedSuites.testsuites.$.failures}`);
  console.log(`   ⚠️  Errors: ${mergedSuites.testsuites.$.errors}`);
  console.log(`   ⏭️  Skipped: ${mergedSuites.testsuites.$.skipped}`);
}

try {
  require('xml2js');
} catch (e) {
  console.log('📦 Installing xml2js...');
  require('child_process').execSync('npm install xml2js', { stdio: 'inherit' });
}

mergeJUnitReports().catch(error => {
  console.error('❌ Merge failed:', error);
  process.exit(1);
});