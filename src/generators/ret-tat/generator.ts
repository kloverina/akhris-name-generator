import type { GeneratedName, GeneratorParams, NamePart } from '../types.ts';
import { ranks } from './dictionaries.ts';

/**
 * ⚠️ МОК. Настоящей логики сборки имён пока нет — генератор выбирает
 * готовые примеры из rules.md. Правила и словари лежат рядом
 * (rules.md, dictionaries.ts) и будут подключены позже.
 *
 * План настоящей логики:
 * 1. Личное имя = эпитет + окончание-сложение (значение собирается из обеих морфем).
 * 2. Гордое имя = родовое имя (+ связующая буква по группе звания) + «-» + звание.
 * 3. Ударение зависит от пола (НрарЭк — Ж, НрАрэк — М).
 */

const personalExamples: NamePart[] = [
    personal('Фенрай', 'Фенр', 'нежный', 'ай', 'несущий', 'Несущий нежность'),
    personal('Перин', 'Пер', 'сильный', 'ин', 'в отличие от всех', 'Сильнее, чем все'),
    personal('Каврап', 'Кавр', 'зоркий', 'ап', 'не являющийся', 'Не-зрящий'),
    personal('Идрей', 'Идир', 'тёплый', 'ей', 'забравший', 'Забравший тепло'),
    personal('Прапуй', 'Прап', 'умный', 'уй', 'отец', 'Отец мудрых'),
    personal('Срарэй', 'Срар', 'большой', 'эй', 'мать', 'Мать больших'),
    personal('Нрароп', 'Нрар', 'маленький', 'оп', 'направляющий', 'Направляющий малых'),
    personal('Евпэк', 'Евп', 'быстрый', 'эк', 'для себя', 'Быстрый для себя'),
    personal('Певпик', 'Певп', 'медленный', 'ик', 'для всех', 'Медленный ради других'),
    personal('Анерай', 'Анер', 'яркий', 'ай', 'несущий', 'Несущий яркость'),
    personal('Авяроп', 'Авяр', 'красивый', 'оп', 'направляющий', 'Направляющий красоту'),
];

const familyExamples: Record<string, string> = {
    tat: 'Ири', to: 'Ирид', tet: 'Ирид', gah: 'Ирик', ger: 'Ирик',
    vat: 'Ириг', vah: 'Ириг', vav: 'Ириг', va: 'Ири',
    sa: 'Ирил', ra: 'Ирил', la: 'Ирил', ro: 'Ириф',
};

function personal(
    value: string,
    epithet: string,
    epithetMeaning: string,
    ending: string,
    endingMeaning: string,
    meaning: string,
): NamePart {
    return {
        kind: 'given',
        label: 'Личное имя',
        value,
        morphemes: [
            { value: epithet.toLowerCase(), meaning: epithetMeaning },
            { value: ending, meaning: endingMeaning },
        ],
        meaning,
    };
}

function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export function generateRetTatName(params: GeneratorParams): GeneratedName {
    const rankOption = params.options.rank;
    const rank = ranks.find((item) => item.id === rankOption) ?? pick(ranks);
    const family = familyExamples[rank.id];

    const given = pick(personalExamples);
    const proud: NamePart = {
        kind: 'proud',
        label: 'Гордое имя',
        value: `${family}-${rank.suffix}`,
        morphemes: [
            { value: family.toLowerCase(), meaning: 'род' },
            { value: rank.suffix.toLowerCase(), meaning: rank.meaning },
        ],
    };

    return {
        id: crypto.randomUUID(),
        gender: params.gender,
        gradjeId: 'ret-tat',
        parts: [given, proud],
    };
}
