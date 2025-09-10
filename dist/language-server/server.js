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
let hasConfigurationCapability = false;
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
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
async function validateDocument(document) {
    try {
        const result = await parser.parse(document.getText());
        const diagnostics = [];
        if (result.diagnostics) {
            result.diagnostics.forEach(diagnostic => {
                diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: document.positionAt(diagnostic.range?.start?.offset || 0),
                        end: document.positionAt(diagnostic.range?.end?.offset || 0)
                    },
                    message: diagnostic.message || 'Unknown error',
                    source: 'openapi-validator'
                });
            });
        }
        // Send the diagnostics to the client
        connection.sendDiagnostics({ uri: document.uri, diagnostics });
    }
    catch (error) {
        connection.console.error(`Error validating document: ${error}`);
    }
}
// Provide component completion items
async function getComponentCompletions(document, position) {
    try {
        const result = await parser.parse(document.getText());
        if (!result.isValid || !result.document)
            return [];
        const components = parser.getComponents(result.document);
        return components.map(component => ({
            label: component.name,
            kind: node_1.CompletionItemKind.Class,
            detail: `${component.type} component`,
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: generateComponentDocumentation(component)
            }
        }));
    }
    catch (error) {
        connection.console.error(`Error getting completions: ${error}`);
        return [];
    }
}
// Provide hover information for components
async function getHoverInfo(document, position) {
    try {
        const result = await parser.parse(document.getText());
        if (!result.isValid || !result.document)
            return null;
        const offset = document.offsetAt(position.position);
        const text = document.getText();
        const wordRange = getWordRangeAtPosition(text, offset);
        if (!wordRange)
            return null;
        const word = text.substring(wordRange.start, wordRange.end);
        const components = parser.getComponents(result.document);
        const component = components.find(c => c.name === word);
        if (component) {
            return {
                contents: {
                    kind: node_1.MarkupKind.Markdown,
                    value: generateComponentDocumentation(component)
                }
            };
        }
        return null;
    }
    catch (error) {
        connection.console.error(`Error getting hover info: ${error}`);
        return null;
    }
}
// Helper function to generate component documentation
function generateComponentDocumentation(component) {
    let doc = `### ${component.name}\n\n**Type:** ${component.type}\n\n`;
    if (component.properties) {
        doc += '\n**Properties:**\n\n';
        Object.entries(component.properties).forEach(([name, prop]) => {
            doc += `- \`${name}\`: ${prop.type}${prop.description ? ` - ${prop.description}` : ''}\n`;
        });
    }
    if (component.required && component.required.length > 0) {
        doc += '\n**Required Properties:**\n\n';
        component.required.forEach((prop) => {
            doc += `- \`${prop}\`\n`;
        });
    }
    return doc;
}
// Helper function to get word range at position
function getWordRangeAtPosition(text, offset) {
    const wordPattern = /[a-zA-Z0-9_\-]+/g;
    let match;
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
connection.onCompletion(async (params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document)
        return [];
    return getComponentCompletions(document, params);
});
connection.onHover(async (params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document)
        return null;
    return getHoverInfo(document, params);
});
documents.onDidChangeContent(change => {
    validateDocument(change.document);
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
