# 🎓 NUS OpenAPI Parser Core

A clean, dependency-free toolkit for **NUS students** to parse, validate, and analyze OpenAPI specifications. This package provides everything you need to work with OpenAPI specs without complex external dependencies.

## 🌟 What You Get

- **🔍 Smart OpenAPI Parser** - Parse, validate, and analyze YAML/JSON specifications
- **📚 Comprehensive Examples** - Learn from complete, working implementations
- **🎯 Student-Friendly** - Designed specifically for NUS project requirements
- **🚫 Zero Complex Dependencies** - No X-venture packages, clean and simple

## 🚀 Quick Start

### 1. Installation

```bash
# Install the core package
npm install yaml

# Install peer dependencies
npm install ts-node@^10.9.1 typescript@^5.0.3

# Optional: Install TypeScript globally if not already installed
npm install -g typescript
```

### 2. Try the Parser Examples

```bash
# Clone or download this repository
git clone <repository-url>
cd nus-openapi-core

# Install dependencies
npm install

# Build the project
npm run build

# Run the comprehensive parser example
npm run example:parser

# Run the simple API example using simple-api.yaml
npm run example:simple

# Or run in development mode (with TypeScript directly)
npm run example:parser-dev
npm run example:simple-dev
```

## 🛠️ Core Features

### 📖 OpenAPI Parser
- **Multi-format Support**: Parse both YAML and JSON OpenAPI specifications
- **Smart Analysis**: Extract components, paths, operations, and references
- **Validation Engine**: Comprehensive syntax and schema validation
- **Component Discovery**: Automatically identify schemas, parameters, responses
- **Reference Tracking**: Find and validate all $ref references

## 📋 Example Usage

### Basic Parser Usage

```typescript
import { SimpleOpenAPIParser } from '@x-venture/nus-openapi-core';

const parser = new SimpleOpenAPIParser();

// Parse from string
const result = await parser.parse(yamlContent);

if (result.isValid) {
  console.log('✅ Valid OpenAPI specification!');
  
  // Get API information
  const info = parser.getInfo(result.document);
  console.log(`API: ${info.title} v${info.version}`);
  
  // Get components
  const components = parser.getComponents(result.document);
  console.log(`Components: ${components.length}`);
  
  // Get paths
  const paths = parser.getPaths(result.document);
  console.log(`Endpoints: ${paths.length}`);
} else {
  console.log('❌ Invalid specification');
  result.errors?.forEach(error => console.log(error.message));
}
```

### Enhanced Parser Usage

```typescript
import { OpenAPIParser } from '@x-venture/nus-openapi-core';

const parser = new OpenAPIParser();

// Parse with enhanced validation
const result = await parser.parse(yamlContent);

if (result.isValid) {
  console.log('✅ Valid OpenAPI specification!');
  
  // Get detailed diagnostics
  const diagnostics = result.diagnostics;
  console.log(`Validation diagnostics: ${diagnostics?.length || 0}`);
} else {
  console.log('❌ Invalid specification');
  result.diagnostics?.forEach(diag => console.log(diag.message));
}
```

## 📚 Examples Included

### 🎯 Simple Parser Example
Run with: `npm run example:simple`

**Features demonstrated:**
- 📄 Loading OpenAPI specs from files (simple-api.yaml)
- 🔍 Basic parsing and validation
- 📊 Component analysis
- 🛤️ Path and operation breakdown
- 🔗 Reference tracking
- 📈 Statistics and insights

### 🧪 Comprehensive Parser Example
Run with: `npm run example:parser`

**Features demonstrated:**
- 📖 Complex OpenAPI specification parsing
- 🧩 Advanced component analysis
- 🌐 Server configuration analysis
- 📝 Detailed operation breakdown
- 🎓 Learning tips for NUS students

## 🎯 Working with simple-api.yaml

The included `examples/simple-api.yaml` file is perfect for learning:

```yaml
openapi: 3.1.0
info:
  title: Simple NUS API Example
  description: A basic API example perfect for beginners
  version: 1.0.0

paths:
  /hello:
    get:
      summary: Say hello
      responses:
        '200':
          description: Hello message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Message'

  /students/{studentId}:
    get:
      summary: Get student information
      parameters:
        - name: studentId
          in: path
          required: true
          schema:
            type: string
            pattern: '^A\\d{7}[A-Z]$'
      responses:
        '200':
          description: Student information
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'

components:
  schemas:
    Message:
      type: object
      required: [text]
      properties:
        text:
          type: string
        timestamp:
          type: string
          format: date-time

    Student:
      type: object
      required: [id, name, email, faculty]
      properties:
        id:
          type: string
          pattern: '^A\\d{7}[A-Z]$'
        name:
          type: string
        email:
          type: string
          format: email
        faculty:
          type: string
          enum: [Engineering, Science, Arts, Business]
```

### To see the parser in action with this file:

```bash
# Build and run the simple example
npm run example:simple

# Or run in development mode
npm run example:simple-dev
```

**Expected Output:**
- ✅ Validation results
- 📋 API information (title, version, description)
- 🧩 Component analysis (Message, Student schemas)
- 🛤️ Path analysis (/hello, /students/{studentId})
- 🔗 Reference tracking ($ref usage)
- 📊 Statistics and insights

## 👨‍💻 Development Setup

### For NUS Students - Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd nus-openapi-core

# 2. Install all dependencies
npm install

# 3. Build the project
npm run build

# 4. Test everything works
npm run example:simple-dev

# 5. Start development mode (auto-rebuild on changes)
npm run dev
```

### Available Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript | Before running examples |
| `npm run dev` | Watch mode - rebuilds on changes | During development |
| `npm run test` | Run test suite | Before committing changes |
| `npm run example:parser` | Run comprehensive parser example | To see advanced features |
| `npm run example:parser-dev` | Run parser example (dev) | During development |
| `npm run example:simple` | Run simple API example | To see basic parsing |
| `npm run example:simple-dev` | Run simple example (dev) | During development |

## 📁 Project Structure

```
nus-openapi-core/
├── src/
│   ├── 📖 parser/              # Core OpenAPI parsing logic
│   │   ├── SimpleOpenAPIParser.ts   # Simple, dependency-free parser
│   │   ├── OpenAPIParser.ts         # Enhanced parser with diagnostics
│   │   └── DiagnosticCollector.ts   # Error collection and validation
│   │
│   ├── 🎯 examples/           # Complete working examples
│   │   ├── parser-usage.ts    # Simple API demo with simple-api.yaml
│   │   └── run-example.ts     # Comprehensive parser demo
│   │
│   ├── 📝 types.ts           # TypeScript definitions
│   └── 📦 index.ts           # Main export file
│
├── examples/                  # Example OpenAPI specifications
│   ├── simple-api.yaml       # Basic example for learning
│   └── student-api.yaml      # More complex example
│
├── 📋 package.json           # Dependencies and scripts
├── ⚙️ tsconfig.json          # TypeScript configuration
└── 📚 README.md              # This file
```

## 🔧 Troubleshooting

### Common Issues for NUS Students

#### ❌ "Cannot find module" errors
```bash
# Solution: Install all dependencies
npm install

# If still failing, clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Parser example not running
```bash
# Make sure to build first
npm run build

# Then run the example
npm run example:simple

# For development (no build needed)
npm run example:simple-dev
```

#### ❌ simple-api.yaml not found
- Make sure you're running from the project root directory
- Verify the `examples/simple-api.yaml` file exists
- Check file permissions

## 🎓 Learning Path for NUS Students

1. **Start Simple**: Run `npm run example:simple-dev` to see basic parsing
2. **Understand Structure**: Examine the `simple-api.yaml` file
3. **Explore Advanced**: Try `npm run example:parser-dev` for complex features
4. **Modify Examples**: Edit the YAML files and see how parsing changes
5. **Build Your Own**: Use the parser in your own projects

## 📖 API Reference

### SimpleOpenAPIParser

```typescript
class SimpleOpenAPIParser {
  // Parse OpenAPI specification
  async parse(content: string): Promise<ParserResult>
  
  // Get API information
  getInfo(document: any): OpenAPIInfo
  getVersion(document: any): string
  getServers(document: any): Array<{url: string, description?: string}>
  
  // Get components and structure
  getComponents(document: any): OpenAPIComponent[]
  getPaths(document: any): OpenAPIPath[]
  getReferences(document: any): string[]
  
  // Additional utilities
  getTags(document: any): string[]
  getSecuritySchemes(document: any): Record<string, any>
  getParametersByPath(document: any, path: string): any[]
  getResponsesByPath(document: any, path: string, method: string): Record<string, any>
}
```

### OpenAPIParser (Enhanced)

```typescript
class OpenAPIParser {
  // Parse with enhanced validation
  async parse(content: string): Promise<ParserResult>
  
  // Same methods as SimpleOpenAPIParser
  // Plus enhanced diagnostic collection
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for NUS students with ❤️
- Clean, dependency-free implementation
- OpenAPI 3.1 specification support