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
export declare class DefaultDiagnosticCollector implements IDiagnosticsCollector {
    private _diagnostics;
    private _astDiagnostics;
    private _syntaxDiagnostics;
    get diagnostics(): () => Diagnostic[];
    add(diagnostic: Diagnostic): void;
    clearDiagnostics(): void;
    clearASTDiagnostics(): void;
    clearSyntaxDiagnostics(): void;
}
