import { ref } from 'vue';
import { gradjes, findGradje } from '@/generators/registry.ts';
import type { Gender, GenderFilter, GeneratedName } from '@/generators/types.ts';

/** `'all'` — случайное Градье для каждой карточки. */
export type GradjeFilter = string | 'all';

export interface BatchParams {
    gender: GenderFilter;
    gradjeId: GradjeFilter;
    /** Параметры конкретного Градья; учитываются, только если выбрано одно Градье. */
    options: Record<string, string | boolean>;
    count: number;
}

/** Сколько попыток на одно имя, прежде чем считать, что уникальные кончились. */
const MAX_ATTEMPTS_PER_NAME = 20;

function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export function useNameGenerator() {
    const names = ref<GeneratedName[]>([]);

    function generate({ gender, gradjeId, options, count }: BatchParams) {
        const single = gradjeId === 'all' ? undefined : findGradje(gradjeId);

        const generateOne = () => {
            const gradje = single ?? pick(gradjes);
            const cardGender: Gender = gender === 'any' ? pick<Gender>(['male', 'female']) : gender;

            return gradje.generate({
                gender: cardGender,
                options: single ? options : {},
            });
        };

        // Имена в одной выдаче не повторяются. Если словарь мал и уникальные
        // имена кончились — выдаём меньше карточек, а не дубли.
        const seen = new Set<string>();
        const batch: GeneratedName[] = [];

        for (let attempt = 0; batch.length < count && attempt < count * MAX_ATTEMPTS_PER_NAME; attempt++) {
            const name = generateOne();
            const key = `${name.gradjeId}:${name.parts.map((part) => part.value).join(' ')}`;

            if (!seen.has(key)) {
                seen.add(key);
                batch.push(name);
            }
        }

        names.value = batch;
    }

    return { names, generate };
}
