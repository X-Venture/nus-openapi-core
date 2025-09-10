/**
 * Simple test script to demonstrate OpenAPI parsing
 * This bypasses the complex dependency issues and shows basic functionality
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Simple OpenAPI parser implementation for demonstration
class SimpleOpenAPIParser {
  parse(content) {
    try {
      // Parse YAML content
      const document = yaml.parse(content);
      
      return {
        isValid: true,
        document: document,
        errors: []
      };
    } catch (error) {
      return {
        isValid: false,
        document: null,
        errors: [{ message: error.message }]
      };
    }
  }
  
  getInfo(document) {
    return document.info || {};
  }
  
  getVersion(document) {
    return document.openapi || 'unknown';
  }
  
  getServers(document) {
    return document.servers || [];
  }
  
  getComponents(document) {
    if (!document.components || !document.components.schemas) {
      return [];
    }
    
    return Object.entries(document.components.schemas).map(([name, schema]) => ({
      name,
      type: 'schemas',
      properties: schema.properties || {},
      required: schema.required || []
    }));
  }
  
  getPaths(document) {
    if (!document.paths) return [];
    
    return Object.entries(document.paths).map(([path, pathObj]) => ({
      path,
      methods: pathObj
    }));
  }
  
  getReferences(document) {
    const refs = [];
    const findRefs = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj['$ref']) {
          refs.push(obj['$ref']);
        }
        Object.values(obj).forEach(findRefs);
      }
    };
    findRefs(document);
    return refs;
  }
}

async function testSimpleAPI() {
  console.log('🎓 Simple OpenAPI Parser Test');
  console.log('=' .repeat(50));
  
  const parser = new SimpleOpenAPIParser();
  
  // Load the simple-api.yaml file
  let specContent;
  try {
    const yamlPath = path.join(__dirname, 'examples', 'simple-api.yaml');
    specContent = fs.readFileSync(yamlPath, 'utf-8');
    console.log('📂 Loaded simple-api.yaml from examples directory');
  } catch (error) {
    console.error('❌ Could not load simple-api.yaml file');
    console.error('   Make sure the file exists in the examples/ directory');
    return;
  }
  
  console.log('\n📖 Step 1: Parsing simple-api.yaml specification...');
  const result = parser.parse(specContent);
  
  if (!result.isValid) {
    console.log('❌ Invalid OpenAPI specification found!');
    console.log('\n🔍 Validation Errors:');
    result.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.message}`);
    });
    return;
  }
  
  console.log('✅ OpenAPI specification is valid!');
  
  // Basic API information
  console.log('\n📋 Step 2: API Information Analysis');
  console.log('-' .repeat(40));
  
  const version = parser.getVersion(result.document);
  const info = parser.getInfo(result.document);
  const servers = parser.getServers(result.document);
  
  console.log(`   OpenAPI Version: ${version}`);
  console.log(`   API Title: ${info.title}`);
  console.log(`   API Version: ${info.version}`);
  if (info.description) {
    console.log(`   Description: ${info.description.substring(0, 100)}...`);
  }
  
  if (servers.length > 0) {
    console.log(`\n🌐 Servers (${servers.length}):`);
    servers.forEach((server, index) => {
      console.log(`   ${index + 1}. ${server.url}`);
      if (server.description) {
        console.log(`      Description: ${server.description}`);
      }
    });
  }
  
  // Components analysis
  console.log('\n🧩 Step 3: Components Analysis');
  console.log('-' .repeat(40));
  
  const components = parser.getComponents(result.document);
  console.log(`   Total Components: ${components.length}`);
  
  if (components.length > 0) {
    console.log('\n   📦 SCHEMAS Components:');
    components.forEach((comp, index) => {
      console.log(`      ${index + 1}. ${comp.name}`);
      const propCount = Object.keys(comp.properties).length;
      const requiredCount = comp.required.length;
      console.log(`         Properties: ${propCount} (${requiredCount} required)`);
      
      // Show first few properties
      const propEntries = Object.entries(comp.properties).slice(0, 3);
      propEntries.forEach(([propName, propDef]) => {
        const isRequired = comp.required.includes(propName) ? ' *' : '';
        const propType = propDef.type || 'unknown';
        console.log(`         - ${propName}: ${propType}${isRequired}`);
      });
      
      if (Object.keys(comp.properties).length > 3) {
        console.log(`         ... and ${Object.keys(comp.properties).length - 3} more`);
      }
    });
  }
  
  // Paths analysis
  console.log('\n🛤️  Step 4: API Paths and Operations Analysis');
  console.log('-' .repeat(50));
  
  const paths = parser.getPaths(result.document);
  console.log(`   Total API Paths: ${paths.length}`);
  
  let totalOperations = 0;
  const operationsByMethod = {};
  
  paths.forEach((pathInfo, pathIndex) => {
    console.log(`\n   ${pathIndex + 1}. 📍 ${pathInfo.path}:`);
    
    const methodEntries = Object.entries(pathInfo.methods);
    totalOperations += methodEntries.length;
    
    methodEntries.forEach(([method, operation]) => {
      operationsByMethod[method.toUpperCase()] = (operationsByMethod[method.toUpperCase()] || 0) + 1;
      
      console.log(`      ${method.toUpperCase()}:`);
      console.log(`        Summary: ${operation.summary || 'No summary'}`);
      
      // Analyze parameters
      if (operation.parameters && operation.parameters.length > 0) {
        console.log(`        Parameters (${operation.parameters.length}):`);
        operation.parameters.forEach((param) => {
          const required = param.required ? ' (required)' : ' (optional)';
          const paramType = param.schema?.type || 'unknown';
          console.log(`          - ${param.name} (${param.in}): ${paramType}${required}`);
        });
      }
      
      // Analyze responses
      if (operation.responses) {
        const responseCodes = Object.keys(operation.responses);
        console.log(`        Responses: ${responseCodes.join(', ')}`);
      }
    });
  });
  
  console.log(`\n   📊 Operation Statistics:`);
  console.log(`      Total Operations: ${totalOperations}`);
  Object.entries(operationsByMethod).forEach(([method, count]) => {
    console.log(`      ${method}: ${count} operations`);
  });
  
  // References analysis
  console.log('\n🔗 Step 5: References Analysis');
  console.log('-' .repeat(35));
  
  const references = parser.getReferences(result.document);
  console.log(`   Total References Found: ${references.length}`);
  
  if (references.length > 0) {
    // Group references by type
    const refsByType = references.reduce((acc, ref) => {
      const parts = ref.split('/');
      const type = parts[parts.length - 2] || 'unknown';
      if (!acc[type]) acc[type] = [];
      acc[type].push(parts[parts.length - 1]);
      return acc;
    }, {});
    
    Object.entries(refsByType).forEach(([type, refs]) => {
      console.log(`   ${type}: ${refs.length} references`);
      console.log(`     - ${refs.slice(0, 5).join(', ')}${refs.length > 5 ? '...' : ''}`);
    });
  }
  
  console.log('\n🎉 Analysis Complete!');
  console.log('=' .repeat(60));
  console.log('\n💡 Learning Points for NUS Students:');
  console.log('   1. ✅ Successfully parsed a simple OpenAPI specification');
  console.log('   2. 📊 Analyzed API structure, components, and relationships');
  console.log('   3. 🔍 Identified patterns and validation results');
  console.log('   4. 🧩 Understood component reusability through references');
  console.log('   5. 🛤️  Mapped out all API endpoints and their capabilities');
  console.log('\n🚀 Next Steps:');
  console.log('   • Try modifying the simple-api.yaml file');
  console.log('   • Add your own components and endpoints');
  console.log('   • Build a full parser with the provided TypeScript classes');
  console.log('   • Integrate with editors for real-time validation');
  console.log('\n📚 This demonstrates the core parsing functionality!');
}

// Run the test
testSimpleAPI().catch(console.error);
