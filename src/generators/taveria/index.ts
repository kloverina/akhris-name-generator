import type { GradjeConfig } from '../types.ts';
import { styles } from './dictionaries.ts';
import { generateTaveriaName } from './generator.ts';

export const taveriaGradje: GradjeConfig = {
    id: 'taveria',
    name: 'Таверия',
    description: 'Традиционные имена в духе простоязычья и новые — без подражания Ивагруму.',
    hasMeanings: false,
    options: [
        {
            id: 'style',
            label: 'Стиль',
            type: 'select',
            defaultValue: 'any',
            options: [
                { value: 'any', label: 'Любой' },
                ...styles.map((style) => ({ value: style.id, label: style.label, hint: style.hint })),
            ],
        },
    ],
    generate: generateTaveriaName,
};
