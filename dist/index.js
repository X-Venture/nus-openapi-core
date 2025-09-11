"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIMPLE_API_SPEC = exports.runParserExample = exports.DefaultDiagnosticCollector = exports.OpenAPIParser = exports.SimpleOpenAPIParser = void 0;
// Export parser and types
var SimpleOpenAPIParser_1 = require("./parser/SimpleOpenAPIParser");
Object.defineProperty(exports, "SimpleOpenAPIParser", { enumerable: true, get: function () { return SimpleOpenAPIParser_1.SimpleOpenAPIParser; } });
// Also export the original parser (may have dependency issues)
var OpenAPIParser_1 = require("./parser/OpenAPIParser");
Object.defineProperty(exports, "OpenAPIParser", { enumerable: true, get: function () { return OpenAPIParser_1.OpenAPIParser; } });
// Export diagnostic collector
var DiagnosticCollector_1 = require("./parser/DiagnosticCollector");
Object.defineProperty(exports, "DefaultDiagnosticCollector", { enumerable: true, get: function () { return DiagnosticCollector_1.DefaultDiagnosticCollector; } });
// Note: Language server is available but not exported as a class
// Use the server.ts file to run it as a standalone process
// Export grammar components
__exportStar(require("./grammar/openapi-grammar"), exports);
// Export types
__exportStar(require("./types"), exports);
// Export examples for reference
var run_example_1 = require("./examples/run-example");
Object.defineProperty(exports, "runParserExample", { enumerable: true, get: function () { return run_example_1.runParserExample; } });
Object.defineProperty(exports, "SIMPLE_API_SPEC", { enumerable: true, get: function () { return run_example_1.SIMPLE_API_SPEC; } });
// Note: Language server can be run as a separate process via server.ts
// Start with: npm run start:language-server
