"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDiagnosticCollector = void 0;
class DefaultDiagnosticCollector {
    constructor() {
        this._diagnostics = [];
        this._astDiagnostics = new Set();
        this._syntaxDiagnostics = new Set();
    }
    get diagnostics() {
        return () => this._diagnostics;
    }
    add(diagnostic) {
        this._diagnostics.push(diagnostic);
    }
    clearDiagnostics() {
        this._diagnostics = [];
        this._astDiagnostics.clear();
        this._syntaxDiagnostics.clear();
    }
    clearASTDiagnostics() {
        this._diagnostics = this._diagnostics.filter(d => !this._astDiagnostics.has(d));
        this._astDiagnostics.clear();
    }
    clearSyntaxDiagnostics() {
        this._diagnostics = this._diagnostics.filter(d => !this._syntaxDiagnostics.has(d));
        this._syntaxDiagnostics.clear();
    }
}
exports.DefaultDiagnosticCollector = DefaultDiagnosticCollector;
