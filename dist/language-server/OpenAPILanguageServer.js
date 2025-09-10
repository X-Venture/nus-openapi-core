"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const OpenAPIParser_1 = require("../parser/OpenAPIParser");
// Create a connection for the server
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a text document manager
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const parser = new OpenAPIParser_1.OpenAPIParser();
connection.onInitialize((params) => {
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
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
async function validateDocument(document) {
    const diagnostics = [];
    try {
        const result = await parser.parse(document.getText());
        if (!result.isValid && result.errors) {
            result.errors.forEach(error => {
                diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: document.positionAt(0),
                        end: document.positionAt(document.getText().length)
                    },
                    message: error.message,
                    source: 'openapi-validator'
                });
            });
        }
    }
    catch (error) {
        // Handle unexpected errors
        diagnostics.push({
            severity: node_1.DiagnosticSeverity.Error,
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
connection.onCompletion((params) => {
    // This is a simplified completion provider
    // You would want to expand this based on the OpenAPI spec
    return [
        {
            label: 'openapi',
            kind: node_1.CompletionItemKind.Keyword,
            data: 1
        },
        {
            label: 'info',
            kind: node_1.CompletionItemKind.Keyword,
            data: 2
        },
        {
            label: 'paths',
            kind: node_1.CompletionItemKind.Keyword,
            data: 3
        },
        {
            label: 'components',
            kind: node_1.CompletionItemKind.Keyword,
            data: 4
        }
    ];
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
