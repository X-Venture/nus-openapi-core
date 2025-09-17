# OpenAPI Specification Examples

This directory contains sample OpenAPI specifications designed specifically for NUS students to learn and test the parser functionality.

## 📁 Available Examples

### 1. `simple-api.yaml` - Beginner Friendly
- **Perfect for**: First-time OpenAPI learners
- **Complexity**: Basic
- **Features**: Simple endpoints, basic schemas, minimal components
- **Use Case**: Understanding OpenAPI fundamentals

**What you'll learn:**
- Basic OpenAPI structure
- Simple path definitions
- Basic schema components
- Error handling patterns

### 2. `student-api.yaml` - Intermediate Example
- **Perfect for**: Students ready for more features
- **Complexity**: Intermediate
- **Features**: CRUD operations, parameters, validation, references
- **Use Case**: Real-world API design patterns

**What you'll learn:**
- Schema relationships with `$ref`
- Parameter validation
- HTTP methods (GET, POST, PUT)
- Error responses
- Component reusability

## 🚀 How to Use These Examples

### With the Parser Examples
```bash
# Run the simple parser example (uses simple-api.yaml)
npm run example:simple-dev

# Run the comprehensive parser example
npm run example:parser-dev

# You can also modify the examples and run them again
```

### Manual Testing
```typescript
import { SimpleOpenAPIParser } from '@x-venture/nus-openapi-core';
import { readFileSync } from 'fs';

const parser = new SimpleOpenAPIParser();

// Load and parse any example
const yamlContent = readFileSync('examples/simple-api.yaml', 'utf8');
const result = await parser.parse(yamlContent);

if (result.isValid) {
  console.log('✅ Valid specification!');
  const components = parser.getComponents(result.document);
  console.log(`Found ${components.length} components`);
}
```

## 🎓 Learning Path for NUS Students

### Step 1: Start Simple
1. Open `simple-api.yaml`
2. Understand the basic structure
3. Run it through the parser: `npm run example:simple-dev`
4. Modify it and see what happens

### Step 2: Explore Features
1. Open `student-api.yaml`
2. Notice the complexity increase
3. Study the component relationships
4. Understand parameter validation

### Step 3: Create Your Own
1. Start with `simple-api.yaml` as a template
2. Add your own endpoints
3. Create custom schemas
4. Test with the parser

## 🔍 Key Learning Points

### From `simple-api.yaml`
- Basic OpenAPI 3.1.0 structure
- Path parameters
- Simple response schemas
- Basic error handling

### From `student-api.yaml`
- Schema relationships with `$ref`
- Parameter validation
- CRUD operations
- Error responses
- Component reusability
- Real-world patterns

## 🛠️ Customization Ideas

### For Your NUS Project
1. **Library Management System**
   - Modify student API for book borrowing
   - Add library resources and reservations

2. **Event Management**
   - Use student API as base
   - Add event registration and ticketing

3. **Food Ordering System**
   - Adapt the schemas for restaurants and orders
   - Add payment and delivery tracking

4. **Study Group Finder**
   - Combine student concepts with messaging
   - Add matching and communication features

## 📚 Parser Usage Examples

### Simple Analysis
```bash
# Run the simple example
npm run example:simple-dev

# Expected output:
# ✅ Valid OpenAPI specification
# 📋 API: Simple NUS API Example v1.0.0
# 🧩 Components: 4 (Message, Student, Course, Error)
# 🛤️ Endpoints: 3 (/hello, /students/{studentId}, /courses)
# 🔗 References: 4
```

### Comprehensive Analysis
```bash
# Run the comprehensive example
npm run example:parser-dev

# Expected output:
# ✅ Valid OpenAPI specification
# 📋 Detailed API information
# 🧩 Component breakdown with properties
# 🛤️ Path analysis with operations
# 🔗 Reference tracking
```

## 🧪 Experiment Ideas

### Try These Modifications

1. **Add a new endpoint:**
```yaml
paths:
  /teachers:
    get:
      summary: Get all teachers
      responses:
        '200':
          description: List of teachers
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Teacher'
```

2. **Create a new schema:**
```yaml
components:
  schemas:
    Teacher:
      type: object
      required: [id, name, department]
      properties:
        id:
          type: string
        name:
          type: string
        department:
          type: string
          enum: [Engineering, Science, Arts, Business]
```

3. **Add validation:**
```yaml
properties:
  email:
    type: string
    format: email
    pattern: '^[a-zA-Z0-9._%+-]+@u\.nus\.edu$'
```

After making changes, run the parser again to see the results!

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

## 📚 Additional Resources

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [OpenAPI Examples](https://github.com/OAI/OpenAPI-Specification/tree/main/examples)
- [YAML Syntax Guide](https://yaml.org/spec/1.2/spec.html)

## 🆘 Need Help?

1. **Parser not working?** 
   - Check YAML/JSON syntax
   - Ensure proper indentation
   - Validate with online tools

2. **Understanding schemas?**
   - Start with simple-api.yaml
   - Use the parser output to understand structure
   - Check the comprehensive example

3. **Want to add features?**
   - Study the student-api.yaml example
   - Copy patterns and modify
   - Test frequently with the parser

## 🔧 Available Parser Methods

```typescript
const parser = new SimpleOpenAPIParser();
const result = await parser.parse(yamlContent);

// Basic information
const info = parser.getInfo(result.document);
const version = parser.getVersion(result.document);
const servers = parser.getServers(result.document);

// Component analysis
const components = parser.getComponents(result.document);
const paths = parser.getPaths(result.document);
const references = parser.getReferences(result.document);

// Additional utilities
const tags = parser.getTags(result.document);
const securitySchemes = parser.getSecuritySchemes(result.document);
const parameters = parser.getParametersByPath(result.document, '/students');
const responses = parser.getResponsesByPath(result.document, '/students', 'get');
```

---

**Happy Learning! 🎓✨**

*These examples are designed to help NUS students master OpenAPI specifications and build amazing APIs for their projects.*