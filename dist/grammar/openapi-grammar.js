"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAPIGrammar = void 0;
const Parser = require('tree-sitter');
const YAML = require('tree-sitter-yaml');
const JSON = require('tree-sitter-json');
class OpenAPIGrammar {
    constructor() {
        this.yamlParser = new Parser();
        this.jsonParser = new Parser();
        this.yamlParser.setLanguage(YAML);
        this.jsonParser.setLanguage(JSON);
    }
    /**
     * Parse OpenAPI content and create AST (Abstract Syntax Tree)
     */
    parse(content, format = 'yaml') {
        const parser = format === 'yaml' ? this.yamlParser : this.jsonParser;
        const tree = parser.parse(content);
        return this.transformNode(tree.rootNode);
    }
    /**
     * Transform tree-sitter node to our OpenAPI node format
     */
    transformNode(node) {
        const result = {
            type: node.type,
            startPosition: node.startPosition,
            endPosition: node.endPosition
        };
        if (node.children && node.children.length > 0) {
            result.children = node.children.map((child) => this.transformNode(child));
        }
        else {
            result.text = node.text;
        }
        return result;
    }
    /**
     * Find all nodes of a specific type in the AST
     */
    findNodes(root, type) {
        const nodes = [];
        const traverse = (node) => {
            if (node.type === type) {
                nodes.push(node);
            }
            if (node.children) {
                node.children.forEach(traverse);
            }
        };
        traverse(root);
        return nodes;
    }
    /**
     * Get node at specific position
     */
    getNodeAtPosition(root, row, column) {
        let result = null;
        const traverse = (node) => {
            if (this.isPositionInNode(node, row, column)) {
                result = node;
                if (node.children) {
                    node.children.forEach(traverse);
                }
            }
        };
        traverse(root);
        return result;
    }
    /**
     * Check if position is within node boundaries
     */
    isPositionInNode(node, row, column) {
        const start = node.startPosition;
        const end = node.endPosition;
        return ((row > start.row || (row === start.row && column >= start.column)) &&
            (row < end.row || (row === end.row && column <= end.column)));
    }
    /**
     * Get OpenAPI specific nodes (paths, components, etc.)
     */
    getOpenAPINodes(root) {
        if (!root.children)
            return {};
        const result = {};
        const mapping = {
            'info': 'info',
            'paths': 'paths',
            'components': 'components',
            'servers': 'servers',
            'security': 'security'
        };
        root.children.forEach(child => {
            if (child.type === 'block_mapping_pair') {
                const key = child.children?.[0]?.text;
                if (key && mapping[key]) {
                    result[mapping[key]] = child.children?.[1];
                }
            }
        });
        return result;
    }
    /**
     * Extract path operations (GET, POST, etc.)
     */
    getPathOperations(pathNode) {
        const operations = {};
        const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];
        if (pathNode.children) {
            pathNode.children.forEach(child => {
                if (child.type === 'block_mapping_pair') {
                    const method = child.children?.[0]?.text?.toLowerCase();
                    if (method && validMethods.includes(method)) {
                        operations[method] = child.children?.[1] || child;
                    }
                }
            });
        }
        return operations;
    }
    /**
     * Extract schema properties
     */
    getSchemaProperties(schemaNode) {
        const properties = {};
        if (schemaNode.children) {
            schemaNode.children.forEach(child => {
                if (child.type === 'block_mapping_pair') {
                    const key = child.children?.[0]?.text;
                    if (key) {
                        properties[key] = child.children?.[1] || child;
                    }
                }
            });
        }
        return properties;
    }
}
exports.OpenAPIGrammar = OpenAPIGrammar;
