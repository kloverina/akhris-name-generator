/**
 * Общие типы генераторов имён мира Акхрис.
 *
 * Каждое Градье (страна) — это отдельный генератор со своими правилами,
 * словарями и дополнительными параметрами.
 */

export type Gender = 'male' | 'female';

/** Фильтр пола в интерфейсе: «Любые» = случайный пол для каждой карточки. */
export type GenderFilter = Gender | 'any';

/** Дополнительный параметр, специфичный для конкретного Градья (звание, сословие…). */
export interface GeneratorOption {
    id: string;
    label: string;
    type: 'select' | 'checkbox';
    /** Значение по умолчанию. Для select обычно `'any'` — «не важно». */
    defaultValue?: string | boolean;
    options?: {
        value: string;
        label: string;
        hint?: string;
    }[];
}

/** Морфема — минимальная смысловая часть имени (корень, окончание, звание). */
export interface NameMorpheme {
    value: string;
    /** Значение морфемы. Опционально: не во всех Градьях части имени что-то значат. */
    meaning?: string;
}

/** Одна строка имени: личное имя, родовое/гордое имя, прозвище и т. п. */
export interface NamePart {
    /** Тип части — для подписи и стилей: 'given' | 'family' | 'title' | ... */
    kind: string;
    /** Человекочитаемая подпись типа части: «Личное имя», «Гордое имя». */
    label?: string;
    value: string;
    /** Разбор на морфемы — показывается мелко под именем («фенр + ай»). */
    morphemes?: NameMorpheme[];
    /** Итоговое значение части целиком — «Несущий нежность». Опционально. */
    meaning?: string;
}

export interface GeneratedName {
    /** Стабильный ключ для списков. */
    id: string;
    gender: Gender;
    gradjeId: string;
    parts: NamePart[];
    /** Короткая заметка к имени (например, про ударение). Опционально. */
    note?: string;
}

export interface GeneratorParams {
    gender: Gender;
    options: Record<string, string | boolean>;
}

export interface GradjeConfig {
    id: string;
    /** Название Градья: «Рет-Тат». */
    name: string;
    /** Короткое описание для подсказок и шапки. */
    description?: string;
    /**
     * Несут ли имена этого Градья значения.
     * Если false — карточка не показывает слой значений даже при наличии данных.
     */
    hasMeanings: boolean;
    options: GeneratorOption[];
    generate: (params: GeneratorParams) => GeneratedName;
}
