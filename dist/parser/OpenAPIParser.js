"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAPIParser = void 0;
const xapi_parser_1 = require("@x-venture/xapi-parser");
const xapi_editor_core_1 = require("@x-venture/xapi-editor-core");
const yaml_1 = require("yaml");
const DiagnosticCollector_1 = require("./DiagnosticCollector");
class OpenAPIParser {
    constructor() {
        this.diagnosticCollector = new DiagnosticCollector_1.DefaultDiagnosticCollector();
    }
    /**
     * Parse OpenAPI specification content
     * @param content The OpenAPI specification content (JSON or YAML)
     * @returns Parser result with validation status and parsed document
     */
    async parse(content) {
        try {
            // Reset diagnostics for new parse
            this.diagnosticCollector = new DiagnosticCollector_1.DefaultDiagnosticCollector();
            // Determine if content is JSON or YAML
            const isJson = (0, xapi_editor_core_1.isJsonContent)(content);
            // Parse content using appropriate parser
            const ast = isJson
                ? (0, xapi_parser_1.parseJSON)(content, this.diagnosticCollector)
                : (0, xapi_parser_1.parseYAML)(content, this.diagnosticCollector);
            const diagnostics = this.diagnosticCollector.diagnostics();
            // Parse document for structure analysis
            const document = isJson ? JSON.parse(content) : (0, yaml_1.parse)(content);
            return {
                isValid: diagnostics.length === 0,
                document,
                diagnostics
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: [error]
            };
        }
    }
    /**
     * Get OpenAPI version from parsed document
     */
    getVersion(document) {
        return document.openapi || document.swagger;
    }
    /**
     * Get API information from parsed document
     */
    getInfo(document) {
        const info = document.info || {};
        return {
            title: info.title || '',
            version: info.version || '',
            description: info.description
        };
    }
    /**
     * Get all components from parsed document
     */
    getComponents(document) {
        const components = document.components || {};
        const result = [];
        // Process each component type (schemas, parameters, responses, etc.)
        Object.entries(components).forEach(([type, typeComponents]) => {
            Object.entries(typeComponents).forEach(([name, component]) => {
                result.push({
                    name,
                    type,
                    properties: component.properties,
                    required: component.required
                });
            });
        });
        return result;
    }
    /**
     * Get all paths from parsed document
     */
    getPaths(document) {
        const paths = document.paths || {};
        return Object.entries(paths).map(([path, pathItem]) => ({
            path,
            methods: this.getPathMethods(pathItem)
        }));
    }
    /**
     * Get all references from parsed document
     */
    getReferences(document) {
        const refs = [];
        this.findReferences(document, refs);
        return refs;
    }
    /**
     * Get server configurations from parsed document
     */
    getServers(document) {
        return document.servers || [];
    }
    getPathMethods(pathItem) {
        const methods = {};
        const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];
        httpMethods.forEach(method => {
            if (pathItem[method]) {
                methods[method] = pathItem[method];
            }
        });
        return methods;
    }
    findReferences(obj, refs) {
        if (!obj || typeof obj !== 'object')
            return;
        if (obj.$ref && typeof obj.$ref === 'string') {
            refs.push(obj.$ref);
        }
        Object.values(obj).forEach(value => {
            this.findReferences(value, refs);
        });
    }
}
exports.OpenAPIParser = OpenAPIParser;
