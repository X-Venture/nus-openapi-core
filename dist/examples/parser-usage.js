"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSimpleAPI = analyzeSimpleAPI;
const SimpleOpenAPIParser_1 = require("../parser/SimpleOpenAPIParser");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * OpenAPI Parser Usage Example with simple-api.yaml
 *
 * This example demonstrates how to:
 * 1. Parse and validate OpenAPI specifications from files
 * 2. Extract components and paths
 * 3. Understand the structure of OpenAPI documents
 * 4. Handle validation errors
 * 5. Analyze grammar and AST structure
 */
async function analyzeSimpleAPI() {
    console.log('🎓 NUS OpenAPI Parser - Simple API Analysis');
    console.log('='.repeat(60));
    const parser = new SimpleOpenAPIParser_1.SimpleOpenAPIParser();
    // Load the simple-api.yaml file
    let specContent;
    try {
        const yamlPath = (0, path_1.join)(__dirname, '../../examples/simple-api.yaml');
        specContent = (0, fs_1.readFileSync)(yamlPath, 'utf-8');
        console.log('📂 Loaded simple-api.yaml from examples directory');
    }
    catch (error) {
        console.error('❌ Could not load simple-api.yaml file');
        console.error('   Make sure the file exists in the examples/ directory');
        return;
    }
    try {
        console.log('\n📖 Step 1: Parsing simple-api.yaml specification...');
        const result = await parser.parse(specContent);
        if (!result.isValid) {
            console.log('❌ Invalid OpenAPI specification found!');
            console.log('\n🔍 Validation Errors:');
            if (result.errors) {
                result.errors.forEach((error, index) => {
                    console.log(`   ${index + 1}. ${error.message}`);
                });
            }
            if (result.diagnostics) {
                result.diagnostics.forEach((diagnostic, index) => {
                    console.log(`   ${index + 1}. ${diagnostic.message || diagnostic}`);
                });
            }
            return;
        }
        console.log('✅ OpenAPI specification is valid!');
        if (!result.document) {
            console.error('❌ No document parsed');
            return;
        }
        // Detailed analysis starts here
        console.log('\n📋 Step 2: API Information Analysis');
        console.log('-'.repeat(40));
        const version = parser.getVersion(result.document);
        const info = parser.getInfo(result.document);
        const servers = parser.getServers(result.document);
        console.log(`   OpenAPI Version: ${version}`);
        console.log(`   API Title: ${info.title}`);
        console.log(`   API Version: ${info.version}`);
        console.log(`   Description: ${info.description?.substring(0, 100)}...`);
        if (servers.length > 0) {
            console.log(`\n🌐 Servers (${servers.length}):`);
            servers.forEach((server, index) => {
                console.log(`   ${index + 1}. ${server.url}`);
                console.log(`      Description: ${server.description || 'No description'}`);
            });
        }
        console.log('\n🧩 Step 3: Components Analysis');
        console.log('-'.repeat(40));
        const components = parser.getComponents(result.document);
        console.log(`   Total Components: ${components.length}`);
        // Group and analyze components by type
        const componentsByType = components.reduce((acc, comp) => {
            if (!acc[comp.type])
                acc[comp.type] = [];
            acc[comp.type].push(comp);
            return acc;
        }, {});
        Object.entries(componentsByType).forEach(([type, comps]) => {
            console.log(`\n   📦 ${type.toUpperCase()} Components (${comps.length}):`);
            comps.forEach((comp, index) => {
                console.log(`      ${index + 1}. ${comp.name}`);
                if (comp.properties) {
                    const propCount = Object.keys(comp.properties).length;
                    const requiredCount = comp.required ? comp.required.length : 0;
                    console.log(`         Properties: ${propCount} (${requiredCount} required)`);
                    // Show first few properties as examples
                    const propEntries = Object.entries(comp.properties).slice(0, 3);
                    propEntries.forEach(([propName, propDef]) => {
                        const isRequired = comp.required?.includes(propName) ? ' *' : '';
                        const propType = propDef.type || 'unknown';
                        console.log(`         - ${propName}: ${propType}${isRequired}`);
                    });
                    if (Object.keys(comp.properties).length > 3) {
                        console.log(`         ... and ${Object.keys(comp.properties).length - 3} more`);
                    }
                }
            });
        });
        console.log('\n🛤️  Step 4: API Paths and Operations Analysis');
        console.log('-'.repeat(50));
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
                console.log(`        Tags: ${operation.tags ? operation.tags.join(', ') : 'None'}`);
                // Analyze parameters
                if (operation.parameters && operation.parameters.length > 0) {
                    console.log(`        Parameters (${operation.parameters.length}):`);
                    operation.parameters.forEach((param) => {
                        const required = param.required ? ' (required)' : ' (optional)';
                        console.log(`          - ${param.name} (${param.in}): ${param.schema?.type || 'unknown'}${required}`);
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
        console.log('\n🔗 Step 5: References Analysis');
        console.log('-'.repeat(35));
        const references = parser.getReferences(result.document);
        console.log(`   Total References Found: ${references.length}`);
        if (references.length > 0) {
            // Group references by type
            const refsByType = references.reduce((acc, ref) => {
                const parts = ref.split('/');
                const type = parts[parts.length - 2] || 'unknown';
                if (!acc[type])
                    acc[type] = [];
                acc[type].push(parts[parts.length - 1]);
                return acc;
            }, {});
            Object.entries(refsByType).forEach(([type, refs]) => {
                console.log(`   ${type}: ${refs.length} references`);
                console.log(`     - ${refs.slice(0, 5).join(', ')}${refs.length > 5 ? '...' : ''}`);
            });
        }
        console.log('\n🎉 Analysis Complete!');
        console.log('='.repeat(60));
        console.log('\n💡 Learning Points for NUS Students:');
        console.log('   1. ✅ Successfully parsed a simple OpenAPI specification');
        console.log('   2. 📊 Analyzed API structure, components, and relationships');
        console.log('   3. 🔍 Identified patterns and validation results');
        console.log('   4. 🧩 Understood component reusability through references');
        console.log('   5. 🛤️  Mapped out all API endpoints and their capabilities');
        console.log('\n🚀 Next Steps:');
        console.log('   • Try modifying the simple-api.yaml file');
        console.log('   • Add your own components and endpoints');
        console.log('   • Use the language server for real-time validation');
        console.log('   • Explore grammar parsing for syntax highlighting');
        console.log('\n📚 Remember: This parser can handle both YAML and JSON formats!');
    }
    catch (error) {
        console.error('\n❌ Error analyzing OpenAPI specification:');
        console.error('   Message:', error instanceof Error ? error.message : error);
        if (error instanceof Error && error.stack) {
            console.error('   Stack trace:');
            console.error('  ', error.stack.split('\n').slice(0, 5).join('\n   '));
        }
        throw error;
    }
}
// Run the example
if (require.main === module) {
    analyzeSimpleAPI().catch(console.error);
}
