/**
 * Словари Рет-Тата. Данные перенесены из rules.md.
 * Логика сборки имён будет опираться на эти таблицы.
 */
import type { NameMorpheme } from '../types.ts';

/** Эпитетная (изначальная) часть личного имени. Всегда оканчивается на Р или П. */
export const epithets: NameMorpheme[] = [
    { value: 'Фенр', meaning: 'нежный' },
    { value: 'Пер', meaning: 'сильный' },
    { value: 'Кавр', meaning: 'зоркий' },
    { value: 'Идир', meaning: 'тёплый' },
    { value: 'Прап', meaning: 'умный' },
    { value: 'Срар', meaning: 'большой' },
    { value: 'Нрар', meaning: 'маленький' },
    { value: 'Евп', meaning: 'быстрый' },
    { value: 'Певп', meaning: 'медленный' },
    { value: 'Анер', meaning: 'яркий' },
    { value: 'Авяр', meaning: 'красивый' },
];

/** Окончания-сложения личного имени. Оканчиваются на Й, П, К (и Н в «Перин»). */
export const endings: NameMorpheme[] = [
    { value: 'ай', meaning: 'несущий' },
    { value: 'ин', meaning: 'в отличие от всех' },
    { value: 'ап', meaning: 'не являющийся' },
    { value: 'ей', meaning: 'забравший' },
    { value: 'уй', meaning: 'отец' },
    { value: 'эй', meaning: 'мать' },
    { value: 'оп', meaning: 'направляющий' },
    { value: 'эк', meaning: 'для себя' },
    { value: 'ик', meaning: 'для всех' },
];

/** Примеры родовых имён: 3 буквы, две гласные и одна согласная. */
export const familyRoots = ['Ири', 'Ака', 'Эве', 'Ана', 'Или', 'Иви'];

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
