<script setup lang="ts">
import type { GeneratorOption } from '@/generators/types';

defineProps<{ options: GeneratorOption[] }>();

const values = defineModel<Record<string, string | boolean>>({ required: true });

/** Подсказка выбранного варианта — показывается рядом с селектом, а не внутри него. */
function hintFor(option: GeneratorOption) {
    return option.options?.find((item) => item.value === values.value[option.id])?.hint;
}

function update(id: string, value: string | boolean) {
    values.value = { ...values.value, [id]: value };
}
</script>

<template>
    <div class="gradje-options">
        <label v-for="option in options" :key="option.id" class="gradje-options__field">
            <span class="gradje-options__label">{{ option.label }}</span>

            <select
                v-if="option.type === 'select'"
                class="gradje-options__select"
                :value="values[option.id]"
                @change="update(option.id, ($event.target as HTMLSelectElement).value)"
            >
                <option v-for="item in option.options" :key="item.value" :value="item.value">
                    {{ item.label }}
                </option>
            </select>

            <input
                v-else
                type="checkbox"
                :checked="Boolean(values[option.id])"
                @change="update(option.id, ($event.target as HTMLInputElement).checked)"
            />

            <span class="gradje-options__hint">{{ hintFor(option) }}</span>
        </label>
    </div>
</template>

<style scoped>
.gradje-options {
    display: grid;
    grid-template-columns: auto 180px minmax(0, 1fr);
    align-items: center;
    gap: 10px 12px;
}

/* Поле раскладывается по колонкам общей сетки: подпись · селект · подсказка. */
.gradje-options__field {
    display: contents;
}

.gradje-options__label {
    font-size: 14px;
    color: var(--color-text-muted);
}

.gradje-options__hint {
    font-size: 13px;
    color: var(--color-text-subtle);
}

.gradje-options__select {
    appearance: none;
    width: 100%;
    text-overflow: ellipsis;
    padding: 7px 34px 7px 14px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    background:
        var(--color-surface)
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath stroke='%236f675a' stroke-width='1.5' d='m1 1 4 4 4-4'/%3E%3C/svg%3E")
        no-repeat right 14px center;
    font-size: 14px;
    cursor: pointer;
}

.gradje-options__select:hover {
    border-color: var(--color-border-strong);
}

@media (max-width: 600px) {
    .gradje-options {
        grid-template-columns: auto minmax(0, 1fr);
    }

    .gradje-options__hint {
        grid-column: 2;
        margin-top: -4px;
    }
}
</style>
