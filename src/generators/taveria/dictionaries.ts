/**
 * Словари Таверии. Данные перенесены из rules.md.
 */
import type { Gender } from '../types.ts';

export type StyleId = 'traditional' | 'modern';

export interface Style {
    id: StyleId;
    label: string;
    hint: string;
    /** Подпись в карточке имени. */
    note: string;
}

export const styles: Style[] = [
    { id: 'traditional', label: 'Традиционный', hint: 'Тверья, простоязычье', note: 'Традиционное имя (Тверья)' },
    { id: 'modern', label: 'Новый', hint: 'Таверия, без подражания Ивагруму', note: 'Имя нового стиля (Таверия)' },
];

export interface NameExample {
    value: string;
    gender: Gender;
}

export const examples: Record<StyleId, NameExample[]> = {
    traditional: [
        { value: 'Тводк', gender: 'male' },
        { value: 'Снадк', gender: 'male' },
        { value: 'Шпат', gender: 'male' },
        { value: 'Кнодптос', gender: 'male' },
        { value: 'Шотьек', gender: 'male' },
        /** Старый вариант имени Эдвин — по народному имени столицы. */
        { value: 'Этверьн', gender: 'male' },
        { value: 'Воипья', gender: 'female' },
        { value: 'Сетвока', gender: 'female' },
    ],
    modern: [
        { value: 'Эдвин', gender: 'male' },
        { value: 'Рерита', gender: 'female' },
        { value: 'Шехьят', gender: 'female' },
    ],
};
