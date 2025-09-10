import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  Diagnostic,
  DiagnosticSeverity,
  Hover,
  MarkupContent,
  MarkupKind
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { OpenAPIParser } from '../parser/OpenAPIParser';
import { parse as parseYaml } from 'yaml';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const parser = new OpenAPIParser();

let hasConfigurationCapability = false;

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;

  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Enable completion support
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', '"', "'", '/']
      },
      // Enable hover support
      hoverProvider: true
    }
  };

  return result;
});

// Handle document validation
async function validateDocument(document: TextDocument): Promise<void> {
  try {
    const result = await parser.parse(document.getText());
    const diagnostics: Diagnostic[] = [];

    if (result.diagnostics) {
      result.diagnostics.forEach(diagnostic => {
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: document.positionAt(diagnostic.range.start.offset),
            end: document.positionAt(diagnostic.range.end.offset)
          },
          message: diagnostic.message,
          source: 'openapi-validator'
        });
      });
    }

    // Send the diagnostics to the client
    connection.sendDiagnostics({ uri: document.uri, diagnostics });
  } catch (error) {
    connection.console.error(`Error validating document: ${error}`);
  }
}

// Provide component completion items
async function getComponentCompletions(document: TextDocument, position: TextDocumentPositionParams): Promise<CompletionItem[]> {
  try {
    const result = await parser.parse(document.getText());
    if (!result.isValid || !result.document) return [];

    const components = parser.getComponents(result.document);
    return components.map(component => ({
      label: component.name,
      kind: CompletionItemKind.Class,
      detail: `${component.type} component`,
      documentation: {
        kind: MarkupKind.Markdown,
        value: generateComponentDocumentation(component)
      }
    }));
  } catch (error) {
    connection.console.error(`Error getting completions: ${error}`);
    return [];
  }
}

// Provide hover information for components
async function getHoverInfo(document: TextDocument, position: TextDocumentPositionParams): Promise<Hover | null> {
  try {
    const result = await parser.parse(document.getText());
    if (!result.isValid || !result.document) return null;

    const offset = document.offsetAt(position.position);
    const text = document.getText();
    const wordRange = getWordRangeAtPosition(text, offset);
    if (!wordRange) return null;

    const word = text.substring(wordRange.start, wordRange.end);
    const components = parser.getComponents(result.document);
    const component = components.find(c => c.name === word);

    if (component) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: generateComponentDocumentation(component)
        }
      };
    }

    return null;
  } catch (error) {
    connection.console.error(`Error getting hover info: ${error}`);
    return null;
  }
}

// Helper function to generate component documentation
function generateComponentDocumentation(component: any): string {
  let doc = `### ${component.name}\n\n**Type:** ${component.type}\n\n`;

  if (component.properties) {
    doc += '\n**Properties:**\n\n';
    Object.entries(component.properties).forEach(([name, prop]: [string, any]) => {
      doc += `- \`${name}\`: ${prop.type}${prop.description ? ` - ${prop.description}` : ''}\n`;
    });
  }

  if (component.required && component.required.length > 0) {
    doc += '\n**Required Properties:**\n\n';
    component.required.forEach((prop: string) => {
      doc += `- \`${prop}\`\n`;
    });
  }

  return doc;
}

// Helper function to get word range at position
function getWordRangeAtPosition(text: string, offset: number): { start: number; end: number } | null {
  const wordPattern = /[a-zA-Z0-9_\-]+/g;
  let match: RegExpExecArray | null;

  while ((match = wordPattern.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (offset >= start && offset <= end) {
      return { start, end };
    }
  }

  return null;
}

// Register handlers
connection.onCompletion(getComponentCompletions);
connection.onHover(getHoverInfo);
documents.onDidChangeContent(change => {
  validateDocument(change.document);
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
