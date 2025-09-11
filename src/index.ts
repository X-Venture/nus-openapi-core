// Export parser and types
export { SimpleOpenAPIParser } from './parser/SimpleOpenAPIParser';
export type {
  ParserResult,
  OpenAPIComponent,
  OpenAPIPath,
  OpenAPIInfo,
  OpenAPIServer
} from './parser/SimpleOpenAPIParser';

// Also export the original parser (may have dependency issues)
export { OpenAPIParser } from './parser/OpenAPIParser';

// Export diagnostic collector
export { DefaultDiagnosticCollector } from './parser/DiagnosticCollector';

// Note: Language server is available but not exported as a class
// Use the server.ts file to run it as a standalone process

// Export grammar components
export * from './grammar/openapi-grammar';

// Export types
export * from './types';

// Export examples for reference
export { runParserExample, SIMPLE_API_SPEC } from './examples/run-example';

// Note: Language server can be run as a separate process via server.ts
// Start with: npm run start:language-server