import type { GeneratorConfig } from '../types.ts';
import { generateRetTatName } from './generator.ts';

export const retTatGenerator: GeneratorConfig = {
    id: 'ret-tat',
    name: 'Рет-тат',
    description: 'Генератор имён Рет-тат',

    options: [
        {
            id: 'occupation',
            label: 'Род деятельности',
            type: 'select',
            options: [
                { value: 'soldier', label: 'Солдат' },
                { value: 'merchant', label: 'Торговец' },
                { value: 'priest', label: 'Жрец' },
                { value: 'none', label: 'Не важно' },
            ],
        },
    ],

    generate: generateRetTatName,
};