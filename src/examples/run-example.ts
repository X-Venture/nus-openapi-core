/**
 * Simple OpenAPI Parser Example for NUS Students
 * This demonstrates basic parser functionality without complexity
 */

import { OpenAPIParser } from '../parser/OpenAPIParser';

// Simple OpenAPI specification for testing
const SIMPLE_API_SPEC = `openapi: 3.1.0
info:
  title: NUS Student API
  description: Simple API for NUS students to learn OpenAPI
  version: 1.0.0

servers:
  - url: https://api.nus.edu.sg/v1

paths:
  /students:
    get:
      summary: Get all students
      responses:
        '200':
          description: List of students
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Student'
    post:
      summary: Create a student
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StudentCreate'
      responses:
        '201':
          description: Student created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'

  /students/{id}:
    get:
      summary: Get student by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            example: 'A1234567B'
      responses:
        '200':
          description: Student details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'

components:
  schemas:
    Student:
      type: object
      required:
        - id
        - name
        - email
      properties:
        id:
          type: string
          example: 'A1234567B'
        name:
          type: string
          example: 'John Doe'
        email:
          type: string
          format: email
          example: 'john.doe@u.nus.edu'
        faculty:
          type: string
          enum: [Engineering, Science, Arts, Business]
          example: 'Engineering'

    StudentCreate:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
          example: 'Jane Smith'
        email:
          type: string
          format: email
          example: 'jane.smith@u.nus.edu'
        faculty:
          type: string
          enum: [Engineering, Science, Arts, Business]
          example: 'Science'`;

async function runParserExample() {
  console.log('🎓 NUS OpenAPI Parser Example');
  console.log('=' .repeat(40));
  
  const parser = new OpenAPIParser();
  
  try {
    console.log('\n📖 Parsing OpenAPI specification...');
    const result = await parser.parse(SIMPLE_API_SPEC);
    
    if (!result.isValid) {
      console.error('❌ Invalid OpenAPI specification!');
      if (result.errors) {
        result.errors.forEach(error => {
          console.error(`   Error: ${error.message}`);
        });
      }
      return;
    }
    
    console.log('✅ OpenAPI specification is valid!');
    
    if (!result.document) {
      console.error('❌ No document parsed');
      return;
    }
    
    // Basic API information
    console.log('\n📋 API Information:');
    const version = parser.getVersion(result.document);
    const info = parser.getInfo(result.document);
    console.log(`   OpenAPI Version: ${version}`);
    console.log(`   API Title: ${info.title}`);
    console.log(`   API Version: ${info.version}`);
    
    // Components analysis
    console.log('\n🧩 Components:');
    const components = parser.getComponents(result.document);
    console.log(`   Total Components: ${components.length}`);
    
    components.forEach(comp => {
      console.log(`   - ${comp.name} (${comp.type})`);
      if (comp.required && comp.required.length > 0) {
        console.log(`     Required fields: ${comp.required.join(', ')}`);
      }
    });
    
    // Paths analysis
    console.log('\n🛤️  API Paths:');
    const paths = parser.getPaths(result.document);
    console.log(`   Total Paths: ${paths.length}`);
    
    paths.forEach(pathInfo => {
      console.log(`   ${pathInfo.path}:`);
      Object.entries(pathInfo.methods).forEach(([method, operation]) => {
        console.log(`     ${method.toUpperCase()}: ${operation.summary || 'No summary'}`);
      });
    });
    
    // References
    console.log('\n🔗 References:');
    const references = parser.getReferences(result.document);
    console.log(`   Total References: ${references.length}`);
    references.forEach(ref => {
      console.log(`   - ${ref}`);
    });
    
    console.log('\n🎉 Analysis Complete!');
    console.log('\n💡 Next Steps:');
    console.log('   • Modify the specification above');
    console.log('   • Add your own endpoints');
    console.log('   • Try the simple-api.yaml example with: npm run example:simple');
    
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  }
}

// Run the example
if (require.main === module) {
  runParserExample().catch(console.error);
}

export { runParserExample, SIMPLE_API_SPEC };