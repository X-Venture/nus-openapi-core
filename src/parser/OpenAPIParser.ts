import { parse as parseYaml } from 'yaml';
import { DefaultDiagnosticCollector, IDiagnosticsCollector, Diagnostic } from './DiagnosticCollector';

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

export class OpenAPIParser {
  private diagnosticCollector: IDiagnosticsCollector;

  constructor() {
    this.diagnosticCollector = new DefaultDiagnosticCollector();
  }

  /**
   * Parse OpenAPI specification content
   * @param content The OpenAPI specification content (JSON or YAML)
   * @returns Parser result with validation status and parsed document
   */
  public async parse(content: string): Promise<ParserResult> {
    try {
      // Reset diagnostics for new parse
      this.diagnosticCollector = new DefaultDiagnosticCollector();

      let document: any;
      const trimmedContent = content.trim();
      
      // Determine if content is JSON or YAML
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
        this.diagnosticCollector.add({
          message: 'Missing required field: openapi',
          severity: 'error'
        });
      }
      
      if (!document.info) {
        this.diagnosticCollector.add({
          message: 'Missing required field: info',
          severity: 'error'
        });
      } else {
        if (!document.info.title) {
          this.diagnosticCollector.add({
            message: 'Missing required field: info.title',
            severity: 'error'
          });
        }
        if (!document.info.version) {
          this.diagnosticCollector.add({
            message: 'Missing required field: info.version',
            severity: 'error'
          });
        }
      }

      const diagnostics = this.diagnosticCollector.diagnostics();

      return {
        isValid: diagnostics.length === 0,
        document,
        diagnostics
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error as Error]
      };
    }
  }

  /**
   * Get OpenAPI version from parsed document
   */
  public getVersion(document: any): string {
    return document.openapi;
  }

  /**
   * Get API information from parsed document
   */
  public getInfo(document: any): OpenAPIInfo {
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
  public getComponents(document: any): OpenAPIComponent[] {
    const components = document.components || {};
    const result: OpenAPIComponent[] = [];

    // Process each component type (schemas, parameters, responses, etc.)
    Object.entries(components).forEach(([type, typeComponents]) => {
      Object.entries(typeComponents as Record<string, any>).forEach(([name, component]) => {
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
  public getPaths(document: any): OpenAPIPath[] {
    const paths = document.paths || {};
    return Object.entries(paths).map(([path, pathItem]) => ({
      path,
      methods: this.getPathMethods(pathItem as Record<string, any>)
    }));
  }

  /**
   * Get all references from parsed document
   */
  public getReferences(document: any): string[] {
    const refs: string[] = [];
    this.findReferences(document, refs);
    return refs;
  }

  /**
   * Get server configurations from parsed document
   */
  public getServers(document: any): any[] {
    return document.servers || [];
  }

  private getPathMethods(pathItem: Record<string, any>): Record<string, any> {
    const methods: Record<string, any> = {};
    const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];
    
    httpMethods.forEach(method => {
      if (pathItem[method]) {
        methods[method] = pathItem[method];
      }
    });

    return methods;
  }

  private findReferences(obj: any, refs: string[]): void {
    if (!obj || typeof obj !== 'object') return;

    if (obj.$ref && typeof obj.$ref === 'string') {
      refs.push(obj.$ref);
    }

    Object.values(obj).forEach(value => {
      this.findReferences(value, refs);
    });
  }
}