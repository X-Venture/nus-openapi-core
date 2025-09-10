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
  DiagnosticSeverity
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { OpenAPIParser } from '../parser/OpenAPIParser';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const parser = new OpenAPIParser();

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Enable completion support
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', '"', "'"]
      },
      // Enable hover support
      hoverProvider: true
    }
  };
  return result;
});

// Handle document validation
async function validateDocument(document: TextDocument): Promise<void> {
  const diagnostics: Diagnostic[] = [];
  
  try {
    const result = await parser.parse(document.getText());
    
    if (!result.isValid && result.errors) {
      result.errors.forEach(error => {
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: document.positionAt(0),
            end: document.positionAt(document.getText().length)
          },
          message: error.message,
          source: 'openapi-validator'
        });
      });
    }
  } catch (error) {
    // Handle unexpected errors
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: {
        start: document.positionAt(0),
        end: document.positionAt(document.getText().length)
      },
      message: 'An unexpected error occurred while validating the document',
      source: 'openapi-validator'
    });
  }

  // Send the computed diagnostics to the client
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

// Validate documents on change
documents.onDidChangeContent(change => {
  validateDocument(change.document);
});

// Handle completion requests
connection.onCompletion(
  (params: TextDocumentPositionParams): CompletionItem[] => {
    // This is a simplified completion provider
    // You would want to expand this based on the OpenAPI spec
    return [
      {
        label: 'openapi',
        kind: CompletionItemKind.Keyword,
        data: 1
      },
      {
        label: 'info',
        kind: CompletionItemKind.Keyword,
        data: 2
      },
      {
        label: 'paths',
        kind: CompletionItemKind.Keyword,
        data: 3
      },
      {
        label: 'components',
        kind: CompletionItemKind.Keyword,
        data: 4
      }
    ];
  }
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
