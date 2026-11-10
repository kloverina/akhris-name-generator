/**
 * Словари Рет-Тата. Данные перенесены из rules.md.
 */
import type { NameMorpheme } from '../types.ts';

/** Эпитет со словоформами — из них собирается значение личного имени. */
export interface Epithet extends NameMorpheme {
    meaning: string;
    /** Существительное в вин. падеже: «нежность» (несущий нежность). */
    noun: string;
    /** Сравнительная степень: «нежнее» (нежнее, чем все). */
    comparative: string;
    /** Род. падеж мн. числа: «нежных» (отец нежных). */
    plural: string;
    /** Стяжённые формы: Идир → Идр (Идрей). */
    contracted?: string[];
}

/** Эпитетная (изначальная) часть личного имени. Всегда оканчивается на Р или П. */
export const epithets: Epithet[] = [
    { value: 'Фенр', meaning: 'нежный', noun: 'нежность', comparative: 'нежнее', plural: 'нежных' },
    { value: 'Пер', meaning: 'сильный', noun: 'силу', comparative: 'сильнее', plural: 'сильных' },
    { value: 'Кавр', meaning: 'зоркий', noun: 'зоркость', comparative: 'зорче', plural: 'зорких' },
    { value: 'Идир', meaning: 'тёплый', noun: 'тепло', comparative: 'теплее', plural: 'тёплых', contracted: ['Идр'] },
    { value: 'Прап', meaning: 'умный', noun: 'мудрость', comparative: 'умнее', plural: 'мудрых' },
    { value: 'Срар', meaning: 'большой', noun: 'величие', comparative: 'больше', plural: 'больших' },
    { value: 'Нрар', meaning: 'маленький', noun: 'малость', comparative: 'меньше', plural: 'малых', contracted: ['Нар'] },
    { value: 'Евп', meaning: 'быстрый', noun: 'быстроту', comparative: 'быстрее', plural: 'быстрых' },
    { value: 'Певп', meaning: 'медленный', noun: 'медленность', comparative: 'медленнее', plural: 'медленных' },
    { value: 'Анер', meaning: 'яркий', noun: 'яркость', comparative: 'ярче', plural: 'ярких' },
    { value: 'Авяр', meaning: 'красивый', noun: 'красоту', comparative: 'красивее', plural: 'красивых' },
];

/** Окончание со смыслом и шаблоном значения всего имени. */
export interface Ending extends NameMorpheme {
    meaning: string;
    /** Значение имени из эпитета. */
    compose: (epithet: Epithet) => string;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Окончания-сложения личного имени. Оканчиваются на Й, П, К (и Н в «Перин»). */
export const endings: Ending[] = [
    { value: 'ай', meaning: 'несущий', compose: (e) => `Несущий ${e.noun}` },
    { value: 'ин', meaning: 'в отличие от всех', compose: (e) => `${capitalize(e.comparative)}, чем все` },
    { value: 'ап', meaning: 'не являющийся', compose: (e) => `Не-${e.meaning}` },
    { value: 'ей', meaning: 'забравший', compose: (e) => `Забравший ${e.noun}` },
    { value: 'уй', meaning: 'отец', compose: (e) => `Отец ${e.plural}` },
    { value: 'эй', meaning: 'мать', compose: (e) => `Мать ${e.plural}` },
    { value: 'оп', meaning: 'направляющий', compose: (e) => `Направляющий ${e.plural}` },
    { value: 'эк', meaning: 'для себя', compose: (e) => `${capitalize(e.meaning)} для себя` },
    { value: 'ик', meaning: 'для всех', compose: (e) => `${capitalize(e.meaning)} для всех` },
];

/**
 * Канонические значения из примеров rules.md — важнее шаблона.
 * Ключ: эпитет + окончание.
 */
export const canonicalMeanings: Record<string, string> = {
    'Фенр+ай': 'Несущий нежность',
    'Пер+ин': 'Сильнее, чем все',
    'Кавр+ап': 'Не-зрящий',
    'Идир+ей': 'Забравший тепло',
    'Прап+уй': 'Отец мудрых',
    'Срар+эй': 'Мать больших',
    'Нрар+оп': 'Направляющий малых',
    'Евп+эк': 'Быстрый для себя',
    'Певп+ик': 'Медленный ради других',
    'Анер+ай': 'Несущий яркость',
    'Авяр+оп': 'Направляющий красоту',
};

/** Примеры родовых имён: 3 буквы, две гласные и одна согласная. */
export const familyRoots = ['Ири', 'Ака', 'Эве', 'Ана', 'Или', 'Иви', 'Аве'];

/**
 * Сочетания, которые уже значат что-то своё (слова, земные имена, ругательства).
 * Сгенерированные части имени, содержащие их, отбрасываются. Словарные эпитеты
 * и примеры из правил не проверяются — они заданы вручную.
 */
export const forbiddenFragments = [
    // гордое имя: родовое + связующая буква
    'олег', 'омег', 'анал', 'орал', 'овал', 'арал', 'ирак', 'одел', 'орел', 'олен',
    'алик', 'эдик', 'эрик', 'офиг', 'афиг', 'ифиг', 'идиот', 'амеб', 'ирод', 'анек',
    // личное имя
    'марин', 'карин', 'мирин', 'ирин', 'элин', 'алин', 'нарик', 'комар', 'кумар', 'моп',
    // общее
    'анус', 'член', 'хер', 'хуй', 'жоп', 'пизд', 'бля', 'сук', 'ебл', 'говн', 'срак', 'дерьм',
];

export type RankId =
    | 'tat' | 'to' | 'tet' | 'gah' | 'ger'
    | 'vat' | 'vah' | 'vav' | 'va'
    | 'sa' | 'ra' | 'la' | 'ro';

export interface Rank {
    id: RankId;
    suffix: string;
    meaning: string;
    /** Буква, добавляемая к родовому имени перед званием ('' — без изменений). */
    linkLetter: string;
}

/** Звания-окончания гордого имени. */
export const ranks: Rank[] = [
    { id: 'tat', suffix: 'Тат', meaning: 'король, Градье', linkLetter: '' },
    { id: 'to', suffix: 'То', meaning: 'некоронованный, будущий король', linkLetter: 'д' },
    { id: 'tet', suffix: 'Тет', meaning: 'Аратв, служитель двора', linkLetter: 'д' },
    { id: 'gah', suffix: 'Гах', meaning: 'Пре-Аратв, будущий Аратв', linkLetter: 'к' },
    { id: 'ger', suffix: 'Гэр', meaning: 'бывший или не-боевой Аратв', linkLetter: 'к' },
    { id: 'vat', suffix: 'Ват', meaning: 'высокий армейский чин', linkLetter: 'г' },
    { id: 'vah', suffix: 'Вах', meaning: 'офицер, капитан', linkLetter: 'г' },
    { id: 'vav', suffix: 'Вав', meaning: 'наставник', linkLetter: 'г' },
    { id: 'va', suffix: 'Ва', meaning: 'рядовой солдат', linkLetter: '' },
    { id: 'sa', suffix: 'Са', meaning: 'врач', linkLetter: 'л' },
    { id: 'ra', suffix: 'Ра', meaning: 'учёный', linkLetter: 'л' },
    { id: 'la', suffix: 'Ла', meaning: 'художник', linkLetter: 'л' },
    { id: 'ro', suffix: 'Ро', meaning: 'клеймо заключённого', linkLetter: 'ф' },
];

/** Особое значение опции звания: родовое имя со связующей буквой, но без звания. */
export const RETIRED_RANK = 'retired';

export type RetTatStyle = 'dictionary' | 'free';

export const styles: { value: RetTatStyle; label: string; hint: string }[] = [
    { value: 'dictionary', label: 'По словарю', hint: 'эпитет из словаря, имя со значением' },
    { value: 'free', label: 'Свободный', hint: 'новый эпитет по правилам, значение только у окончания' },
];

/** Готовые полные имена из примеров. */
export interface FullNameExample {
    given: string;
    /** Разбор личного имени; нет — имя-исключение. */
    epithet?: string;
    ending?: string;
    /** Значение эпитета — только для словарных. */
    meaning?: string;
    family: string;
    rank: RankId;
    style: RetTatStyle | 'exception';
}

export const fullNameExamples: FullNameExample[] = [
    // Три брата и их мать — одно гордое имя.
    { given: 'Фенрай', epithet: 'Фенр', ending: 'ай', family: 'Ири', rank: 'gah', style: 'dictionary' },
    { given: 'Аяр', epithet: 'Аяр', family: 'Ири', rank: 'gah', style: 'free' },
    { given: 'Идирик', epithet: 'Идир', ending: 'ик', family: 'Ири', rank: 'gah', style: 'dictionary' },
    { given: 'Аранья', family: 'Ири', rank: 'gah', style: 'exception' },
    { given: 'Илларей', epithet: 'Иллар', ending: 'ей', family: 'Аве', rank: 'vat', style: 'free' },
];

/** Личные имена из примеров (к ним генерируется гордое имя). */
export interface PersonalExample {
    given: string;
    epithet: string;
    ending: string;
    stress?: string;
}

export const personalExamples: PersonalExample[] = [
    { given: 'Фенрай', epithet: 'Фенр', ending: 'ай' },
    { given: 'Перин', epithet: 'Пер', ending: 'ин' },
    { given: 'Каврап', epithet: 'Кавр', ending: 'ап' },
    { given: 'Идрей', epithet: 'Идир', ending: 'ей' },
    { given: 'Прапуй', epithet: 'Прап', ending: 'уй' },
    { given: 'Срарэй', epithet: 'Срар', ending: 'эй' },
    { given: 'Нрароп', epithet: 'Нрар', ending: 'оп' },
    { given: 'Евпэк', epithet: 'Евп', ending: 'эк' },
    { given: 'Певпик', epithet: 'Певп', ending: 'ик' },
    { given: 'Анерай', epithet: 'Анер', ending: 'ай' },
    { given: 'Авяроп', epithet: 'Авяр', ending: 'оп' },
    { given: 'Нрарэк', epithet: 'Нрар', ending: 'эк', stress: 'НрарЭк (ж.), НрАрэк (м.)' },
    { given: 'Нарэк', epithet: 'Нрар', ending: 'эк', stress: 'НарЭк (ж.), НАрэк (м.)' },
];
