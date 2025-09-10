
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

### With the Parser Example
```bash
# Run the parser with these examples
npm run example:parser-dev

# The parser will automatically use the comprehensive example
# You can modify the specContent in run-example.ts to use different examples
```

### With the Electron App
```bash
# Start the Electron demo
npm run example:electron

# Use the "Examples" section in the sidebar to load:
# - Student API (based on nus-student-api.yaml)
# - Course Management (based on course-management.json)
# - Simple Example (based on simple-api.yaml)
```

### Manual Testing
```typescript
import { OpenAPIParser } from '@x-venture/nus-openapi-core';
import { readFileSync } from 'fs';

const parser = new OpenAPIParser();

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
3. Run it through the parser
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

## 📚 Additional Resources

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [OpenAPI Examples](https://github.com/OAI/OpenAPI-Specification/tree/main/examples)
- [NUS API Guidelines](https://nus.edu.sg/apis) (if available)

## 🆘 Need Help?

1. **Parser not working?** 
   - Check YAML/JSON syntax
   - Ensure proper indentation
   - Validate with online tools

2. **Understanding schemas?**
   - Start with simple-api.yaml
   - Use the Electron app's hover features
   - Check the parser output

3. **Want to add features?**
   - Study the comprehensive example
   - Copy patterns and modify
   - Test frequently with the parser

---

**Happy Learning! 🎓✨**

*These examples are designed to help NUS students master OpenAPI specifications and build amazing APIs for their projects.*
