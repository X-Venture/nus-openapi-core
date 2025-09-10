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
export interface ValidationResult {
    valid: boolean;
    errors?: string[];
}
