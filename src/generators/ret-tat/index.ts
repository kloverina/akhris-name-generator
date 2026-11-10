import type { GradjeConfig } from '../types.ts';
import { ranks, RETIRED_RANK, styles } from './dictionaries.ts';
import { generateRetTatName } from './generator.ts';

export const retTatGradje: GradjeConfig = {
    id: 'ret-tat',
    name: 'Рет-Тат',
    description:
        'Имена строятся вокруг звания рикса: личное имя из старо-язычных эпитетов и гордое имя из рода и звания.',
    hasMeanings: true,

    options: [
        {
            id: 'style',
            label: 'Стиль',
            type: 'select',
            defaultValue: 'any',
            options: [{ value: 'any', label: 'Любой' }, ...styles],
        },
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
                { value: RETIRED_RANK, label: 'В отставке', hint: 'связующая буква осталась, звания нет' },
            ],
        },
    ],

    generate: generateRetTatName,
};
