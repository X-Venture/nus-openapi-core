# NUS OpenAPI Editor Core

This package provides core functionality for building an OpenAPI specification editor in Electron, including:
- OpenAPI Parser with component identification
- Language Server Protocol (LSP) implementation
- Validation capabilities
- Electron integration utilities

## Installation

```bash
npm install @x-venture/nus-openapi-core
```

## Features

1. **OpenAPI Parser**
   - Parse YAML and JSON OpenAPI specifications
   - Validate against OpenAPI schema
   - Extract and identify components
   - Path analysis
   - Reference tracking

2. **Language Server**
   - Real-time syntax validation
   - Component-aware code completion
   - Error diagnostics
   - Hover information for components
   - Reference resolution

3. **Electron Integration**
   - Ready-to-use example implementation
   - IPC communication setup
   - Language server process management

## Usage

### Parser

```typescript
import { OpenAPIParser } from '@x-venture/nus-openapi-core';

const parser = new OpenAPIParser();

async function analyzeSpec(content: string) {
  const result = await parser.parse(content);
  if (result.isValid && result.document) {
    // Get OpenAPI version
    const version = parser.getVersion(result.document);
    
    // Get API information
    const info = parser.getInfo(result.document);
    
    // Get components (schemas, parameters, responses, etc.)
    const components = parser.getComponents(result.document);
    
    // Get paths and operations
    const paths = parser.getPaths(result.document);
    
    // Get references
    const references = parser.getReferences(result.document);
  }
}
```

### Language Server Integration

The language server should be run as a separate process in your Electron application. See `examples/electron-integration.ts` for a complete implementation example.

Basic setup:

```typescript
import { spawn } from 'child_process';
import { join } from 'path';

// Start language server
const serverModule = join(__dirname, 'node_modules/@x-venture/nus-openapi-core/dist/language-server/server.js');
const serverProcess = spawn('node', [serverModule]);

// Handle server process events
serverProcess.stdout.on('data', (data) => {
  console.log('Language server output:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error('Language server error:', data.toString());
});
```

### Editor Features

The language server provides several features for editor integration:

1. **Component Completion**
   - Triggers on: `.`, `"`, `'`, `/`
   - Provides component names and types
   - Includes documentation in completion items

2. **Hover Information**
   - Shows component details
   - Displays property information
   - Lists required fields

3. **Validation**
   - Real-time syntax checking
   - Schema validation
   - Reference validation

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Run tests:
```bash
npm test
```

4. Start language server (for development):
```bash
npm run start:language-server
```

## Project Structure

```
src/
├── parser/           # OpenAPI parser implementation
├── language-server/  # LSP implementation
├── examples/         # Usage examples
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For support or questions, please open an issue in the repository.