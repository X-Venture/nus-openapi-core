import Parser from 'tree-sitter';
import * as YAML from 'tree-sitter-yaml';
import * as JSON from 'tree-sitter-json';

export interface OpenAPINode {
  type: string;
  startPosition: { row: number; column: number };
  endPosition: { row: number; column: number };
  children?: OpenAPINode[];
  text?: string;
}

export class OpenAPIGrammar {
  private yamlParser: Parser;
  private jsonParser: Parser;

  constructor() {
    this.yamlParser = new Parser();
    this.jsonParser = new Parser();
    this.yamlParser.setLanguage(YAML);
    this.jsonParser.setLanguage(JSON);
  }

  /**
   * Parse OpenAPI content and create AST (Abstract Syntax Tree)
   */
  public parse(content: string, format: 'yaml' | 'json' = 'yaml'): OpenAPINode {
    const parser = format === 'yaml' ? this.yamlParser : this.jsonParser;
    const tree = parser.parse(content);
    return this.transformNode(tree.rootNode);
  }

  /**
   * Transform tree-sitter node to our OpenAPI node format
   */
  private transformNode(node: any): OpenAPINode {
    const result: OpenAPINode = {
      type: node.type,
      startPosition: node.startPosition,
      endPosition: node.endPosition
    };

    if (node.children && node.children.length > 0) {
      result.children = node.children.map((child: any) => this.transformNode(child));
    } else {
      result.text = node.text;
    }

    return result;
  }

  /**
   * Find all nodes of a specific type in the AST
   */
  public findNodes(root: OpenAPINode, type: string): OpenAPINode[] {
    const nodes: OpenAPINode[] = [];
    
    const traverse = (node: OpenAPINode) => {
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
  public getNodeAtPosition(root: OpenAPINode, row: number, column: number): OpenAPINode | null {
    let result: OpenAPINode | null = null;

    const traverse = (node: OpenAPINode) => {
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
  private isPositionInNode(node: OpenAPINode, row: number, column: number): boolean {
    const start = node.startPosition;
    const end = node.endPosition;

    return (
      (row > start.row || (row === start.row && column >= start.column)) &&
      (row < end.row || (row === end.row && column <= end.column))
    );
  }

  /**
   * Get OpenAPI specific nodes (paths, components, etc.)
   */
  public getOpenAPINodes(root: OpenAPINode): {
    info?: OpenAPINode;
    paths?: OpenAPINode;
    components?: OpenAPINode;
    servers?: OpenAPINode;
    security?: OpenAPINode;
  } {
    if (!root.children) return {};

    const result: any = {};
    const mapping: Record<string, string> = {
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
  public getPathOperations(pathNode: OpenAPINode): Record<string, OpenAPINode> {
    const operations: Record<string, OpenAPINode> = {};
    const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];

    if (pathNode.children) {
      pathNode.children.forEach(child => {
        if (child.type === 'block_mapping_pair') {
          const method = child.children?.[0]?.text?.toLowerCase();
          if (method && validMethods.includes(method)) {
            operations[method] = child.children[1];
          }
        }
      });
    }

    return operations;
  }

  /**
   * Extract schema properties
   */
  public getSchemaProperties(schemaNode: OpenAPINode): Record<string, OpenAPINode> {
    const properties: Record<string, OpenAPINode> = {};

    if (schemaNode.children) {
      schemaNode.children.forEach(child => {
        if (child.type === 'block_mapping_pair') {
          const key = child.children?.[0]?.text;
          if (key) {
            properties[key] = child.children[1];
          }
        }
      });
    }

    return properties;
  }
}
