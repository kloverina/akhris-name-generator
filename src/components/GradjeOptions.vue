<script setup lang="ts">
import type { GeneratorOption } from '@/generators/types';

defineProps<{ options: GeneratorOption[] }>();

const values = defineModel<Record<string, string | boolean>>({ required: true });

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
                    {{ item.label }}{{ item.hint ? ` — ${item.hint}` : '' }}
                </option>
            </select>

            <input
                v-else
                type="checkbox"
                :checked="Boolean(values[option.id])"
                @change="update(option.id, ($event.target as HTMLInputElement).checked)"
            />
        </label>
    </div>
</template>

<style scoped>
.gradje-options {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
}

.gradje-options__field {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    max-width: 100%;
}

.gradje-options__label {
    font-size: 14px;
    color: var(--color-text-muted);
}

.gradje-options__select {
    appearance: none;
    min-width: 0;
    max-width: 100%;
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
</style>
