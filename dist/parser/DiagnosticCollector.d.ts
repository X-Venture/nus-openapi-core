import { IDiagnosticsCollector, Diagnostic } from '@x-venture/xapi-types';
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
