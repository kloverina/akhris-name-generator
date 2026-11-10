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
    /** Параметры последней выдачи — чтобы перегенерация части имени их учитывала. */
    let lastParams: BatchParams | undefined;

    function generate(params: BatchParams) {
        lastParams = params;
        const { gender, gradjeId, options, count } = params;
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

    /**
     * Перегенерировать одну часть имени (личное или гордое), оставив остальные.
     * Берём новое имя того же Градья и пола и переносим из него только эту часть.
     * Заметка карточки относится к личному имени, поэтому меняется вместе с первой частью.
     */
    function regeneratePart(id: string, partIndex: number) {
        const index = names.value.findIndex((item) => item.id === id);
        const current = names.value[index];
        const gradje = current && findGradje(current.gradjeId);
        if (!gradje) return;

        const options = lastParams?.gradjeId === gradje.id ? lastParams.options : {};
        const gender: Gender = current.gender === 'any' ? pick<Gender>(['male', 'female']) : current.gender;
        const oldPart = current.parts[partIndex];

        for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_NAME; attempt++) {
            const fresh = gradje.generate({ gender, options });
            const part = fresh.parts.find((item) => item.kind === oldPart.kind);
            if (!part || part.value === oldPart.value) continue;

            const parts = current.parts.map((item, i) => (i === partIndex ? part : item));
            names.value[index] = {
                ...current,
                parts,
                note: partIndex === 0 ? fresh.note : current.note,
            };
            return;
        }
    }

    return { names, generate, regeneratePart };
}
