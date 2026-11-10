import type { GeneratedName, GeneratorParams, NamePart } from '../types.ts';
import {
    canonicalMeanings,
    endings,
    epithets,
    familyRoots,
    fullNameExamples,
    personalExamples,
    ranks,
    RETIRED_RANK,
    type Ending,
    type Epithet,
    type Rank,
    type RetTatStyle,
} from './dictionaries.ts';

/**
 * Генератор Рет-Тата (см. rules.md).
 *
 * Личное имя = эпитет (на Р/П) + окончание-сложение.
 *   • «По словарю» — эпитет из словаря, значение собирается целиком.
 *   • «Свободный» — новый эпитет по правилам звучания, значение есть только у окончания.
 * Гордое имя = родовое имя + связующая буква звания + «-» + звание.
 *
 * Пол не учитывается: все имена Рет-Тата помечаются как «любой пол».
 * Ударение в сгенерированных именах пока не ставим — только в примерах.
 */

const EXAMPLE_CHANCE = 0.15;
const FULL_EXAMPLE_SHARE = 0.6;
const FREE_STYLE_CHANCE = 0.35;
const CONTRACTION_CHANCE = 0.35;
const BARE_EPITHET_CHANCE = 0.1;
const KNOWN_FAMILY_CHANCE = 0.6;
const RETIRED_CHANCE = 0.05;

// ── утилиты ──────────────────────────────────────────────

function pick<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

/** Выбор с весами: [значение, вес][]. */
function weighted(items: readonly [string, number][]): string {
    const total = items.reduce((sum, [, w]) => sum + w, 0);
    let roll = Math.random() * total;
    for (const [value, w] of items) {
        roll -= w;
        if (roll < 0) return value;
    }
    return items[items.length - 1][0];
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const VOWELS = 'аеёиоуыэюя';
const isVowel = (ch: string) => VOWELS.includes(ch.toLowerCase());
/** Йотированные гласные после гласной звучат как «й» + гласная: Аяр. */
const IOTATED = 'еёюя';

// ── звуки свободных эпитетов ─────────────────────────────

/*
 * По rules.md популярные гласные — И, А, Э, О, согласные — Л, Р, К, М, Н
 * (ср. Илларей, Аяр, родовые Ири/Или/Ака). Они составляют основу.
 * Редкие буквы (RARE) встречаются в словарных эпитетах (Фенр, Кавр, Идир, Евп, Авяр),
 * поэтому допустимы, но с малым весом и не больше одной на эпитет.
 */
const RARE = new Set(['в', 'ф', 'д', 'п', 'е', 'я']);
const MAX_RARE_LETTERS = 1;

const vowels: [string, number][] = [
    ['и', 6], ['а', 6], ['э', 3], ['о', 3],
    // редкие
    ['е', 0.6], ['я', 0.6],
];
/** Первая гласная в начале слова: «е»/«я» в начале звучат иначе, не берём. */
const initialVowels: [string, number][] = [['и', 6], ['а', 6], ['э', 2], ['о', 2]];
const consonants: [string, number][] = [
    ['л', 6], ['р', 5], ['к', 4], ['м', 4], ['н', 4],
    // редкие
    ['в', 0.6], ['ф', 0.5], ['д', 0.5],
];
/** Согласные, которые хорошо стоят перед финальной Р (Анер → Ан-р, Фенр, Кавр). */
const preFinal: [string, number][] = [['н', 4], ['л', 3], ['м', 2], ['в', 0.6]];
/** Эпитет всегда кончается на Р или П; П — редкая. */
const finals: [string, number][] = [['р', 8], ['п', 0.6]];

const v = () => weighted(vowels);
const c = () => weighted(consonants);

const templates: (() => string)[] = [
    // Аяр-подобные: гласная-согласная-гласная-Р
    () => weighted(initialVowels) + c() + v() + weighted(finals),
    // Иллар-подобные: с удвоенной согласной
    () => {
        const double = weighted([['л', 5], ['н', 2], ['м', 1], ['к', 1]]);
        return weighted(initialVowels) + double + double + v() + weighted(finals);
    },
    // Авяр/Анер-подобные с согласной в начале: Ларэр, Мирар
    () => c() + v() + c() + v() + weighted(finals),
    // Пер-подобные: короткие
    () => c() + v() + weighted(finals),
    // Фенр/Кавр-подобные: согласная перед финальной Р
    () => c() + v() + weighted(preFinal) + 'р',
];

const dictionaryValues = new Set(
    epithets.flatMap((e) => [e.value, ...(e.contracted ?? [])].map((x) => x.toLowerCase())),
);

/** Проверка звучания: без тройных согласных и двойных гласных (кроме йотированных: Аяр). */
export function soundsValid(word: string): boolean {
    const lower = word.toLowerCase();
    let consonantRun = 0;
    for (let i = 0; i < lower.length; i++) {
        const ch = lower[i];
        if (isVowel(ch)) {
            if (i > 0 && isVowel(lower[i - 1]) && !IOTATED.includes(ch)) return false;
            consonantRun = 0;
        } else {
            consonantRun++;
            if (consonantRun >= 3) return false;
        }
    }
    return true;
}

const rareCount = (word: string) => [...word.toLowerCase()].filter((ch) => RARE.has(ch)).length;

function freeEpithet(): string {
    for (let attempt = 0; attempt < 50; attempt++) {
        const word = pick(templates)();
        if (word.length < 3 || word.length > 6) continue;
        if (dictionaryValues.has(word)) continue;
        if (!soundsValid(word)) continue;
        if (rareCount(word) > MAX_RARE_LETTERS) continue;
        return capitalize(word);
    }
    return 'Аяр';
}

// ── личное имя ───────────────────────────────────────────

/** Склеить эпитет и окончание; при стечении трёх согласных вернёт null. */
function join(epithet: string, ending: string): string | null {
    const word = epithet + ending;
    return soundsValid(word) ? word : null;
}

function dictionaryGiven(): NamePart {
    const epithet = pick(epithets);

    if (Math.random() < BARE_EPITHET_CHANCE) {
        return {
            kind: 'given',
            label: 'Личное имя',
            value: epithet.value,
            morphemes: [{ value: epithet.value.toLowerCase(), meaning: epithet.meaning }],
            meaning: capitalize(epithet.meaning),
        };
    }

    const ending = pick(endings);
    const stem =
        epithet.contracted && Math.random() < CONTRACTION_CHANCE
            ? pick(epithet.contracted)
            : epithet.value;
    const value = join(stem, ending.value) ?? epithet.value + ending.value;

    return {
        kind: 'given',
        label: 'Личное имя',
        value,
        morphemes: [
            { value: epithet.value.toLowerCase(), meaning: epithet.meaning },
            { value: ending.value, meaning: ending.meaning },
        ],
        meaning: composeMeaning(epithet, ending),
    };
}

function composeMeaning(epithet: Epithet, ending: Ending): string {
    return canonicalMeanings[`${epithet.value}+${ending.value}`] ?? ending.compose(epithet);
}

function freeGiven(): NamePart {
    const epithet = freeEpithet();

    if (Math.random() < BARE_EPITHET_CHANCE) {
        return {
            kind: 'given',
            label: 'Личное имя',
            value: epithet,
            morphemes: [{ value: epithet.toLowerCase() }],
        };
    }

    for (let attempt = 0; attempt < 20; attempt++) {
        const ending = pick(endings);
        const value = join(epithet, ending.value);
        if (!value) continue;
        return {
            kind: 'given',
            label: 'Личное имя',
            value,
            morphemes: [
                { value: epithet.toLowerCase() },
                { value: ending.value, meaning: ending.meaning },
            ],
        };
    }
    return freeGiven();
}

// ── гордое имя ───────────────────────────────────────────

function familyRoot(): string {
    if (Math.random() < KNOWN_FAMILY_CHANCE) return pick(familyRoots);
    const first = weighted([['и', 4], ['а', 4], ['э', 2], ['о', 1]]);
    const middle = weighted([...consonants.filter(([ch]) => ch !== 'п'), ['в', 2]]);
    const last = weighted([['и', 4], ['а', 4], ['е', 2], ['э', 1]]);
    return capitalize(first + middle + last);
}

type RankChoice = { rank: Rank; retired: boolean };

function chooseRank(option: string | boolean | undefined): RankChoice {
    if (option === RETIRED_RANK) return { rank: pick(ranks.filter((r) => r.linkLetter)), retired: true };
    const fixed = ranks.find((item) => item.id === option);
    if (fixed) return { rank: fixed, retired: false };
    // Без звания остаются только те, у кого была связующая буква.
    if (Math.random() < RETIRED_CHANCE) {
        return { rank: pick(ranks.filter((r) => r.linkLetter)), retired: true };
    }
    return { rank: pick(ranks), retired: false };
}

function proudPart(root: string, { rank, retired }: RankChoice): NamePart {
    const family = root + rank.linkLetter;

    if (retired) {
        return {
            kind: 'proud',
            label: 'Гордое имя',
            value: family,
            morphemes: [
                { value: root.toLowerCase(), meaning: 'род' },
                ...(rank.linkLetter
                    ? [{ value: rank.linkLetter, meaning: `бывший -${rank.suffix} (${rank.meaning})` }]
                    : []),
            ],
            meaning: 'Без звания',
        };
    }

    return {
        kind: 'proud',
        label: 'Гордое имя',
        value: `${family}-${rank.suffix}`,
        morphemes: [
            { value: family.toLowerCase(), meaning: 'род' },
            { value: rank.suffix.toLowerCase(), meaning: rank.meaning },
        ],
    };
}

// ── примеры ──────────────────────────────────────────────

function fromExamples(
    params: GeneratorParams,
    style: RetTatStyle | 'any',
    rankChoice: RankChoice,
): GeneratedName | null {
    const rankOption = params.options.rank;
    const rankFixed = typeof rankOption === 'string' && rankOption !== 'any';

    const fullPool = fullNameExamples.filter(
        (item) =>
            (!rankFixed || item.rank === rankOption) &&
            (style === 'any' || item.style === style),
    );
    const personalPool = style === 'free' ? [] : personalExamples;

    const useFull =
        fullPool.length > 0 && (personalPool.length === 0 || Math.random() < FULL_EXAMPLE_SHARE);

    if (useFull) {
        const item = pick(fullPool);
        const rank = ranks.find((r) => r.id === item.rank)!;
        const epithet = epithets.find((e) => e.value === item.epithet);
        const ending = endings.find((e) => e.value === item.ending);

        let given: NamePart;
        if (item.style === 'exception') {
            given = { kind: 'given', label: 'Личное имя', value: item.given };
        } else if (epithet) {
            given = {
                kind: 'given',
                label: 'Личное имя',
                value: item.given,
                morphemes: [
                    { value: epithet.value.toLowerCase(), meaning: epithet.meaning },
                    ...(ending ? [{ value: ending.value, meaning: ending.meaning }] : []),
                ],
                meaning: ending ? composeMeaning(epithet, ending) : capitalize(epithet.meaning),
            };
        } else {
            given = {
                kind: 'given',
                label: 'Личное имя',
                value: item.given,
                morphemes: [
                    { value: item.epithet!.toLowerCase() },
                    ...(ending ? [{ value: ending.value, meaning: ending.meaning }] : []),
                ],
            };
        }

        return {
            id: crypto.randomUUID(),
            gender: 'any',
            gradjeId: 'ret-tat',
            parts: [given, proudPart(item.family, { rank, retired: false })],
            note: item.style === 'exception' ? 'Личное имя — исключение из правил' : undefined,
        };
    }

    if (personalPool.length === 0) return null;

    const item = pick(personalPool);
    const epithet = epithets.find((e) => e.value === item.epithet)!;
    const ending = endings.find((e) => e.value === item.ending)!;

    return {
        id: crypto.randomUUID(),
        gender: 'any',
        gradjeId: 'ret-tat',
        parts: [
            {
                kind: 'given',
                label: 'Личное имя',
                value: item.given,
                morphemes: [
                    { value: epithet.value.toLowerCase(), meaning: epithet.meaning },
                    { value: ending.value, meaning: ending.meaning },
                ],
                meaning: composeMeaning(epithet, ending),
            },
            proudPart(familyRoot(), rankChoice),
        ],
        note: item.stress ? `Ударение: ${item.stress}` : undefined,
    };
}

// ── сборка ───────────────────────────────────────────────

export function generateRetTatName(params: GeneratorParams): GeneratedName {
    const styleOption = params.options.style;
    const style: RetTatStyle | 'any' =
        styleOption === 'dictionary' || styleOption === 'free' ? styleOption : 'any';
    const rankChoice = chooseRank(params.options.rank);

    if (params.options.rank !== RETIRED_RANK && Math.random() < EXAMPLE_CHANCE) {
        const example = fromExamples(params, style, rankChoice);
        if (example) return example;
    }

    const resolvedStyle: RetTatStyle =
        style === 'any' ? (Math.random() < FREE_STYLE_CHANCE ? 'free' : 'dictionary') : style;
    const given = resolvedStyle === 'free' ? freeGiven() : dictionaryGiven();

    return {
        id: crypto.randomUUID(),
        gender: 'any',
        gradjeId: 'ret-tat',
        parts: [given, proudPart(familyRoot(), rankChoice)],
    };
}
