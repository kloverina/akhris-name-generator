import type { GradjeConfig } from '../types.ts';
import { ranks } from './dictionaries.ts';
import { generateRetTatName } from './generator.ts';

export const retTatGradje: GradjeConfig = {
    id: 'ret-tat',
    name: 'Рет-Тат',
    description:
        'Имена строятся вокруг звания рикса: личное имя из старо-язычных эпитетов и гордое имя из рода и звания.',
    hasMeanings: true,

    options: [
        {
            id: 'rank',
            label: 'Звание',
            type: 'select',
            defaultValue: 'any',
            options: [
                { value: 'any', label: 'Любое' },
                ...ranks.map((rank) => ({
                    value: rank.id,
                    label: `-${rank.suffix}`,
                    hint: rank.meaning,
                })),
            ],
        },
    ],

    generate: generateRetTatName,
};
