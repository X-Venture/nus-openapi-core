export interface Diagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  line?: number;
  column?: number;
  source?: string;
}

export interface IDiagnosticsCollector {
  diagnostics: () => Diagnostic[];
  add(diagnostic: Diagnostic): void;
  clearDiagnostics(): void;
  clearASTDiagnostics(): void;
  clearSyntaxDiagnostics(): void;
}

export class DefaultDiagnosticCollector implements IDiagnosticsCollector {
  private _diagnostics: Diagnostic[] = [];
  private _astDiagnostics: Set<Diagnostic> = new Set();
  private _syntaxDiagnostics: Set<Diagnostic> = new Set();

  get diagnostics(): () => Diagnostic[] {
    return () => this._diagnostics;
  }

  add(diagnostic: Diagnostic): void {
    this._diagnostics.push(diagnostic);
  }

  clearDiagnostics(): void {
    this._diagnostics = [];
    this._astDiagnostics.clear();
    this._syntaxDiagnostics.clear();
  }

  clearASTDiagnostics(): void {
    this._diagnostics = this._diagnostics.filter(d => !this._astDiagnostics.has(d));
    this._astDiagnostics.clear();
  }

  clearSyntaxDiagnostics(): void {
    this._diagnostics = this._diagnostics.filter(d => !this._syntaxDiagnostics.has(d));
    this._syntaxDiagnostics.clear();
  }
}