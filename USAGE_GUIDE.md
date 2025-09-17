# 📖 Usage Guide: OpenAPI Parser

This guide shows you how to use the NUS OpenAPI Core package to parse and analyze OpenAPI specifications, with special focus on the included `simple-api.yaml` example.

## 🚀 Quick Start

### 1. Setup and Installation

```bash
# Navigate to project directory
cd nus-openapi-core

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Run the Simple API Example

The easiest way to see the parser in action is with the simple-api.yaml file:

```bash
# Run the simple example (uses simple-api.yaml)
npm run example:simple

# Or run in development mode (faster for testing)
npm run example:simple-dev
```

**Expected Output:**
```
🎓 NUS OpenAPI Parser - Simple API Analysis
============================================================
📂 Loaded simple-api.yaml from examples directory

📖 Step 1: Parsing simple-api.yaml specification...
✅ OpenAPI specification is valid!

📋 Step 2: API Information Analysis
----------------------------------------
   OpenAPI Version: 3.1.0
   API Title: Simple NUS API Example
   API Version: 1.0.0
   Description: A basic API example perfect for beginners learning OpenAPI...

🌐 Servers (1):
   1. https://simple-api.nus.edu.sg/v1
      Description: Simple API server

🧩 Step 3: Components Analysis
----------------------------------------
   Total Components: 4

   📦 SCHEMAS Components (4):
      1. Message
         Properties: 2 (1 required)
         - text: string *
         - timestamp: string

      2. Student
         Properties: 4 (4 required)
         - id: string *
         - name: string *
         - email: string *

      3. Course
         Properties: 3 (3 required)
         - code: string *
         - title: string *
         - credits: integer *

      4. Error
         Properties: 2 (2 required)
         - message: string *
         - code: string *

🛤️  Step 4: API Paths and Operations Analysis
--------------------------------------------------
   Total API Paths: 3

   1. 📍 /hello:
      GET:
        Summary: Say hello
        Tags: None
        Responses: 200

   2. 📍 /students/{studentId}:
      GET:
        Summary: Get student information
        Tags: None
        Parameters (1):
          - studentId (path): string (required)
        Responses: 200, 404

   3. 📍 /courses:
      GET:
        Summary: List all courses
        Tags: None
        Responses: 200

   📊 Operation Statistics:
      Total Operations: 3
      GET: 3 operations

🔗 Step 5: References Analysis
-----------------------------------
   Total References Found: 4
   schemas: 4 references
     - Message, Student, Course, Error

🎉 Analysis Complete!
============================================================

💡 Learning Points for NUS Students:
   1. ✅ Successfully parsed a simple OpenAPI specification
   2. 📊 Analyzed API structure, components, and relationships
   3. 🔍 Identified patterns and validation results
   4. 🧩 Understood component reusability through references
   5. 🛤️  Mapped out all API endpoints and their capabilities

🚀 Next Steps:
   • Try modifying the simple-api.yaml file
   • Add your own components and endpoints
   • Explore the enhanced parser for validation
   • Build your own OpenAPI tools

📚 Remember: This parser can handle both YAML and JSON formats!
```

## 📝 Understanding simple-api.yaml

The `examples/simple-api.yaml` file is designed as a learning example:

### Structure Overview
```yaml
openapi: 3.1.0                    # OpenAPI version
info:                             # API metadata
  title: Simple NUS API Example
  description: Basic API example
  version: 1.0.0
  
servers:                          # API servers
  - url: https://simple-api.nus.edu.sg/v1
  
paths:                            # API endpoints
  /hello:                         # Simple GET endpoint
  /students/{studentId}:          # Parameterized endpoint
  /courses:                       # List endpoint
  
components:                       # Reusable components
  schemas:                        # Data models
    Message:                      # Simple message schema
    Student:                      # Student data model
    Course:                       # Course data model
    Error:                        # Error response model
```

### Key Learning Points

1. **Component Reusability**: Notice how `$ref` is used to reference schemas
2. **Parameter Validation**: The `studentId` parameter uses pattern validation
3. **Response Codes**: Different endpoints return different HTTP status codes
4. **Data Types**: Mix of string, integer, and enum types
5. **Required Fields**: Some fields are marked as required

## 🛠️ Programmatic Usage

### Basic Parser Usage

```typescript
import { SimpleOpenAPIParser } from '@x-venture/nus-openapi-core';
import { readFileSync } from 'fs';

// Load the simple-api.yaml file
const yamlContent = readFileSync('examples/simple-api.yaml', 'utf-8');

// Create parser instance
const parser = new SimpleOpenAPIParser();

// Parse the specification
const result = await parser.parse(yamlContent);

if (result.isValid) {
  // Get basic info
  const info = parser.getInfo(result.document);
  console.log(`API: ${info.title} v${info.version}`);
  
  // Get all components
  const components = parser.getComponents(result.document);
  components.forEach(comp => {
    console.log(`Component: ${comp.name} (${comp.type})`);
  });
  
  // Get all paths
  const paths = parser.getPaths(result.document);
  paths.forEach(path => {
    console.log(`Path: ${path.path}`);
    Object.keys(path.methods).forEach(method => {
      console.log(`  ${method.toUpperCase()}: ${path.methods[method].summary}`);
    });
  });
}
```

### Enhanced Parser Usage

```typescript
import { OpenAPIParser } from '@x-venture/nus-openapi-core';

// Create enhanced parser instance
const parser = new OpenAPIParser();

// Parse with enhanced validation
const result = await parser.parse(yamlContent);

if (result.isValid) {
  console.log('✅ Valid OpenAPI specification!');
  
  // Enhanced validation provides detailed diagnostics
  if (result.diagnostics && result.diagnostics.length > 0) {
    console.log('📋 Validation messages:');
    result.diagnostics.forEach(diag => {
      console.log(`  - ${diag.message} (${diag.severity})`);
    });
  }
} else {
  console.log('❌ Invalid specification');
  result.errors?.forEach(error => console.log(error.message));
}
```

### Advanced Analysis

```typescript
// Detailed component analysis
const components = parser.getComponents(result.document);
const schemas = components.filter(comp => comp.type === 'schemas');

schemas.forEach(schema => {
  console.log(`\n📦 Schema: ${schema.name}`);
  
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([propName, propDef]) => {
      const type = (propDef as any).type || 'unknown';
      const required = schema.required?.includes(propName) ? ' (required)' : '';
      console.log(`  - ${propName}: ${type}${required}`);
    });
  }
});

// Reference analysis
const references = parser.getReferences(result.document);
console.log(`\n🔗 Found ${references.length} references:`);
references.forEach(ref => console.log(`  - ${ref}`));
```

## 🧪 Modifying simple-api.yaml

Try these modifications to see how the parser responds:

### 1. Add a New Endpoint

```yaml
paths:
  # ... existing paths ...
  /students:
    post:
      summary: Create a new student
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
```

### 2. Add a New Schema

```yaml
components:
  schemas:
    # ... existing schemas ...
    StudentCreate:
      type: object
      required:
        - name
        - email
        - faculty
      properties:
        name:
          type: string
          minLength: 2
          maxLength: 100
        email:
          type: string
          format: email
          pattern: '^[a-zA-Z0-9._%+-]+@u\.nus\.edu$'
        faculty:
          type: string
          enum: [Engineering, Science, Arts, Business]
```

### 3. Add Parameters

```yaml
paths:
  /students:
    get:
      summary: List students with filtering
      parameters:
        - name: faculty
          in: query
          schema:
            type: string
            enum: [Engineering, Science, Arts, Business]
        - name: year
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 6
      responses:
        '200':
          description: List of students
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Student'
```

After making changes, run the parser again:

```bash
npm run example:simple-dev
```

## 🔍 Validation Examples

### Valid Modifications
- Adding new properties to existing schemas
- Creating new endpoints with proper structure
- Adding query parameters with validation
- Using existing component references

### Common Errors to Try
- Invalid OpenAPI version
- Missing required fields
- Broken $ref references
- Invalid HTTP methods
- Malformed YAML syntax

## 📊 Understanding Parser Output

### Component Analysis
- **Total Components**: Number of reusable components found
- **Properties Count**: Number of properties in each schema
- **Required Fields**: Fields marked as required (shown with *)

### Path Analysis  
- **Total Paths**: Number of API endpoints
- **Operations**: HTTP methods for each path
- **Parameters**: Query, path, header parameters
- **Responses**: HTTP status codes returned

### Reference Analysis
- **Total References**: Number of $ref usages
- **Reference Types**: Grouped by component type (schemas, responses, etc.)

## 🎯 Parser Comparison

### SimpleOpenAPIParser
- ✅ **Lightweight**: No complex dependencies
- ✅ **Fast**: Quick parsing and analysis
- ✅ **Simple**: Easy to understand and use
- ✅ **Reliable**: Dependency-free operation

### OpenAPIParser (Enhanced)
- ✅ **All SimpleOpenAPIParser features**
- ✅ **Enhanced Validation**: Detailed diagnostic messages
- ✅ **Better Error Reporting**: Line and column information
- ✅ **Comprehensive Analysis**: More detailed parsing results

## 🎯 Next Steps

1. **Experiment**: Modify simple-api.yaml and see how parsing changes
2. **Create Your Own**: Build your own OpenAPI specification
3. **Advanced Features**: Explore the comprehensive parser example
4. **Build Applications**: Use the parser in your own projects

## 📚 Additional Resources

- [YAML Syntax Guide](https://yaml.org/spec/1.2/spec.html)
- [JSON Schema Validation](https://json-schema.org/)

Happy parsing! 🎉