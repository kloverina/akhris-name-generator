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

function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export function useNameGenerator() {
    const names = ref<GeneratedName[]>([]);

    function generate({ gender, gradjeId, options, count }: BatchParams) {
        const single = gradjeId === 'all' ? undefined : findGradje(gradjeId);

        names.value = Array.from({ length: count }, () => {
            const gradje = single ?? pick(gradjes);
            const cardGender: Gender = gender === 'any' ? pick<Gender>(['male', 'female']) : gender;

            return gradje.generate({
                gender: cardGender,
                options: single ? options : {},
            });
        });
    }

    return { names, generate };
}
