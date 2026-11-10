import type { GeneratedName, GeneratorParams } from '../types.ts';
import { examples, styles } from './dictionaries.ts';

/**
 * ⚠️ МОК. Генератор выбирает готовые примеры из rules.md.
 *
 * План настоящей логики:
 * 1. Традиционный стиль: короткие слоги со стяжением гласных, выпадением М/В
 *    и «щелчками» П, К, Т на концах (Тводк, Снадк, Шпат).
 * 2. Новый стиль: имена от названий городов и столицы (Этверьн → Эдвин)
 *    и мягкие благозвучные формы (Рерита, Шехьят).
 */

function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export function generateTaveriaName(params: GeneratorParams): GeneratedName {
    const style = styles.find((item) => item.id === params.options.style) ?? pick(styles);
    const pool = examples[style.id].filter((item) => item.gender === params.gender);
    const name = pick(pool.length > 0 ? pool : examples[style.id]);

    return {
        id: crypto.randomUUID(),
        // Пол берём у самого имени: у каждого имени он один.
        gender: name.gender,
        gradjeId: 'taveria',
        parts: [{ kind: 'given', label: 'Имя', value: name.value }],
        note: style.note,
    };
}
