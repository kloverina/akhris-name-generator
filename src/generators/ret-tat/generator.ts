import type {
    GeneratorParams,
    GeneratedName,
} from '../types.ts';

export function generateRetTatName(
    params: GeneratorParams,
): GeneratedName {
    const { gender, options } = params;
    const occupation = options.occupation ?? 'none';

    // 1. Определяем подходящие правила
    // 2. Выбираем нужные элементы из словарей
    // 3. Формируем имя
    // 4. Возвращаем результат

    return {
        fullName: 'Пример имени',
    };
}