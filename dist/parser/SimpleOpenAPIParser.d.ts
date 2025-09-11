export interface ParserResult {
    isValid: boolean;
    document?: any;
    errors?: Error[];
    diagnostics?: string[];
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
    contact?: any;
    license?: any;
}
export interface OpenAPIServer {
    url: string;
    description?: string;
}
/**
 * Simplified OpenAPI Parser that works without complex dependencies
 * Perfect for learning and basic parsing tasks
 */
export declare class SimpleOpenAPIParser {
    parse(content: string): Promise<ParserResult>;
    getVersion(document: any): string;
    getInfo(document: any): OpenAPIInfo;
    getServers(document: any): OpenAPIServer[];
    getComponents(document: any): OpenAPIComponent[];
    getPaths(document: any): OpenAPIPath[];
    getReferences(document: any): string[];
    getTags(document: any): string[];
    getSecuritySchemes(document: any): Record<string, any>;
    getParametersByPath(document: any, path: string): any[];
    getResponsesByPath(document: any, path: string, method: string): Record<string, any>;
}
