import { parse as parseYaml } from 'yaml';

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
export class SimpleOpenAPIParser {
  async parse(content: string): Promise<ParserResult> {
    try {
      let document: any;
      
      // Determine if content is JSON or YAML
      const trimmedContent = content.trim();
      
      if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
        // Parse as JSON
        document = JSON.parse(content);
      } else {
        // Parse as YAML
        document = parseYaml(content);
      }
      
      // Basic validation
      const errors: Error[] = [];
      
      if (!document.openapi) {
        errors.push(new Error('Missing required field: openapi'));
      }
      
      if (!document.info) {
        errors.push(new Error('Missing required field: info'));
      } else {
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
      
    } catch (error) {
      return {
        isValid: false,
        document: undefined,
        errors: [error instanceof Error ? error : new Error(String(error))]
      };
    }
  }
  
  getVersion(document: any): string {
    return document?.openapi || 'unknown';
  }
  
  getInfo(document: any): OpenAPIInfo {
    return document?.info || { title: 'Unknown', version: 'Unknown' };
  }
  
  getServers(document: any): OpenAPIServer[] {
    return document?.servers || [];
  }
  
  getComponents(document: any): OpenAPIComponent[] {
    if (!document?.components?.schemas) {
      return [];
    }
    
    return Object.entries(document.components.schemas).map(([name, schema]: [string, any]) => ({
      name,
      type: 'schemas',
      properties: schema.properties || {},
      required: schema.required || []
    }));
  }
  
  getPaths(document: any): OpenAPIPath[] {
    if (!document?.paths) {
      return [];
    }
    
    return Object.entries(document.paths).map(([path, pathObj]: [string, any]) => ({
      path,
      methods: pathObj
    }));
  }
  
  getReferences(document: any): string[] {
    const refs: string[] = [];
    
    const findRefs = (obj: any): void => {
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
  getTags(document: any): string[] {
    return document?.tags?.map((tag: any) => tag.name) || [];
  }
  
  getSecuritySchemes(document: any): Record<string, any> {
    return document?.components?.securitySchemes || {};
  }
  
  getParametersByPath(document: any, path: string): any[] {
    const pathObj = document?.paths?.[path];
    if (!pathObj) return [];
    
    const parameters: any[] = [];
    
    // Path-level parameters
    if (pathObj.parameters) {
      parameters.push(...pathObj.parameters);
    }
    
    // Operation-level parameters
    Object.values(pathObj).forEach((operation: any) => {
      if (operation && typeof operation === 'object' && operation.parameters) {
        parameters.push(...operation.parameters);
      }
    });
    
    return parameters;
  }
  
  getResponsesByPath(document: any, path: string, method: string): Record<string, any> {
    return document?.paths?.[path]?.[method]?.responses || {};
  }
}
