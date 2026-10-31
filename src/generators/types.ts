export type Gender = 'male' | 'female';

export interface GeneratorOption {
    id: string;
    label: string;
    type: 'select' | 'checkbox';
    options?: {
        value: string;
        label: string;
    }[];
}

export interface GeneratorConfig {
    id: string;
    name: string;
    description?: string;
    options: GeneratorOption[];
    generate: (params: GeneratorParams) => GeneratedName;
}

export interface GeneratorParams {
    gender: Gender;
    options: Record<string, string | boolean>;
}

export interface GeneratedName {
    fullName: string;
    parts?: {
        value: string;
        description?: string;
    }[];
}