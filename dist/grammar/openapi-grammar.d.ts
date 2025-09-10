export interface OpenAPINode {
    type: string;
    startPosition: {
        row: number;
        column: number;
    };
    endPosition: {
        row: number;
        column: number;
    };
    children?: OpenAPINode[];
    text?: string;
}
export declare class OpenAPIGrammar {
    private yamlParser;
    private jsonParser;
    constructor();
    /**
     * Parse OpenAPI content and create AST (Abstract Syntax Tree)
     */
    parse(content: string, format?: 'yaml' | 'json'): OpenAPINode;
    /**
     * Transform tree-sitter node to our OpenAPI node format
     */
    private transformNode;
    /**
     * Find all nodes of a specific type in the AST
     */
    findNodes(root: OpenAPINode, type: string): OpenAPINode[];
    /**
     * Get node at specific position
     */
    getNodeAtPosition(root: OpenAPINode, row: number, column: number): OpenAPINode | null;
    /**
     * Check if position is within node boundaries
     */
    private isPositionInNode;
    /**
     * Get OpenAPI specific nodes (paths, components, etc.)
     */
    getOpenAPINodes(root: OpenAPINode): {
        info?: OpenAPINode;
        paths?: OpenAPINode;
        components?: OpenAPINode;
        servers?: OpenAPINode;
        security?: OpenAPINode;
    };
    /**
     * Extract path operations (GET, POST, etc.)
     */
    getPathOperations(pathNode: OpenAPINode): Record<string, OpenAPINode>;
    /**
     * Extract schema properties
     */
    getSchemaProperties(schemaNode: OpenAPINode): Record<string, OpenAPINode>;
}
