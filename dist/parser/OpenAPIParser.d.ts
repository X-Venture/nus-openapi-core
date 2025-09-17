import { Diagnostic } from './DiagnosticCollector';
export interface ParserResult {
    isValid: boolean;
    document?: any;
    errors?: Error[];
    diagnostics?: Diagnostic[];
}
export interface OpenAPIComponent {
    name: string;
    type: string;
    properties?: Record<string, any>;
    required?: string[];
}
export interface OpenAPIPath {
    path: string;
    methods: Record<string, any>;
}
export interface OpenAPIInfo {
    title: string;
    version: string;
    description?: string;
}
export declare class OpenAPIParser {
    private diagnosticCollector;
    constructor();
    /**
     * Parse OpenAPI specification content
     * @param content The OpenAPI specification content (JSON or YAML)
     * @returns Parser result with validation status and parsed document
     */
    parse(content: string): Promise<ParserResult>;
    /**
     * Get OpenAPI version from parsed document
     */
    getVersion(document: any): string;
    /**
     * Get API information from parsed document
     */
    getInfo(document: any): OpenAPIInfo;
    /**
     * Get all components from parsed document
     */
    getComponents(document: any): OpenAPIComponent[];
    /**
     * Get all paths from parsed document
     */
    getPaths(document: any): OpenAPIPath[];
    /**
     * Get all references from parsed document
     */
    getReferences(document: any): string[];
    /**
     * Get server configurations from parsed document
     */
    getServers(document: any): any[];
    private getPathMethods;
    private findReferences;
}
