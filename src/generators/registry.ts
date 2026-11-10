import type { GradjeConfig } from './types.ts';

import { retTatGradje } from './ret-tat';
import { taveriaGradje } from './taveria';

/**
 * Все Градья мира Акхрис, для которых есть генератор.
 * Чтобы добавить новое Градье: создайте папку рядом с `ret-tat/`
 * (index.ts, generator.ts, dictionaries.ts, rules.md) и добавьте его сюда.
 */
export const gradjes: GradjeConfig[] = [
    retTatGradje,
    taveriaGradje,
];

export function findGradje(id: string): GradjeConfig | undefined {
    return gradjes.find((item) => item.id === id);
}
