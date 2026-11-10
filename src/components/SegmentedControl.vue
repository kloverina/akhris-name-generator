<script setup lang="ts" generic="T extends string">
defineProps<{
    label: string;
    items: { value: T; label: string }[];
}>();

const model = defineModel<T>({ required: true });
</script>

<template>
    <div class="segmented" role="radiogroup" :aria-label="label">
        <button
            v-for="item in items"
            :key="item.value"
            type="button"
            role="radio"
            class="segmented__item"
            :class="{ 'is-active': model === item.value }"
            :aria-checked="model === item.value"
            @click="model = item.value"
        >
            {{ item.label }}
        </button>
    </div>
</template>

<style scoped>
.segmented {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px;
    background: var(--color-surface-muted);
    border-radius: var(--radius-pill);
}

.segmented__item {
    border: 0;
    background: transparent;
    padding: 7px 16px;
    border-radius: var(--radius-pill);
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s, box-shadow 0.15s;
}

.segmented__item:hover {
    color: var(--color-text);
}

.segmented__item.is-active {
    background: var(--color-surface);
    color: var(--color-accent-text);
    box-shadow: 0 1px 3px rgb(42 38 32 / 10%);
}

@media (max-width: 480px) {
    .segmented__item {
        padding: 7px 12px;
    }
}
</style>
