"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleOpenAPIParser = void 0;
const yaml_1 = require("yaml");
/**
 * Simplified OpenAPI Parser that works without complex dependencies
 * Perfect for learning and basic parsing tasks
 */
class SimpleOpenAPIParser {
    async parse(content) {
        try {
            let document;
            // Determine if content is JSON or YAML
            const trimmedContent = content.trim();
            if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
                // Parse as JSON
                document = JSON.parse(content);
            }
            else {
                // Parse as YAML
                document = (0, yaml_1.parse)(content);
            }
            // Basic validation
            const errors = [];
            if (!document.openapi) {
                errors.push(new Error('Missing required field: openapi'));
            }
            if (!document.info) {
                errors.push(new Error('Missing required field: info'));
            }
            else {
                if (!document.info.title) {
                    errors.push(new Error('Missing required field: info.title'));
                }
                if (!document.info.version) {
                    errors.push(new Error('Missing required field: info.version'));
                }
            }
            return {
                isValid: errors.length === 0,
                document,
                errors: errors.length > 0 ? errors : undefined
            };
        }
        catch (error) {
            return {
                isValid: false,
                document: undefined,
                errors: [error instanceof Error ? error : new Error(String(error))]
            };
        }
    }
    getVersion(document) {
        return document?.openapi || 'unknown';
    }
    getInfo(document) {
        return document?.info || { title: 'Unknown', version: 'Unknown' };
    }
    getServers(document) {
        return document?.servers || [];
    }
    getComponents(document) {
        if (!document?.components?.schemas) {
            return [];
        }
        return Object.entries(document.components.schemas).map(([name, schema]) => ({
            name,
            type: 'schemas',
            properties: schema.properties || {},
            required: schema.required || []
        }));
    }
    getPaths(document) {
        if (!document?.paths) {
            return [];
        }
        return Object.entries(document.paths).map(([path, pathObj]) => ({
            path,
            methods: pathObj
        }));
    }
    getReferences(document) {
        const refs = [];
        const findRefs = (obj) => {
            if (typeof obj === 'object' && obj !== null) {
                if (obj['$ref']) {
                    refs.push(obj['$ref']);
                }
                Object.values(obj).forEach(findRefs);
            }
        };
        findRefs(document);
        return refs;
    }
    // Additional utility methods
    getTags(document) {
        return document?.tags?.map((tag) => tag.name) || [];
    }
    getSecuritySchemes(document) {
        return document?.components?.securitySchemes || {};
    }
    getParametersByPath(document, path) {
        const pathObj = document?.paths?.[path];
        if (!pathObj)
            return [];
        const parameters = [];
        // Path-level parameters
        if (pathObj.parameters) {
            parameters.push(...pathObj.parameters);
        }
        // Operation-level parameters
        Object.values(pathObj).forEach((operation) => {
            if (operation && typeof operation === 'object' && operation.parameters) {
                parameters.push(...operation.parameters);
            }
        });
        return parameters;
    }
    getResponsesByPath(document, path, method) {
        return document?.paths?.[path]?.[method]?.responses || {};
    }
}
exports.SimpleOpenAPIParser = SimpleOpenAPIParser;
