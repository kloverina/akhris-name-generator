<script setup lang="ts">
import { computed, ref } from 'vue';
import type { GeneratedName, GradjeConfig } from '@/generators/types';

const props = defineProps<{
    name: GeneratedName;
    gradje?: GradjeConfig;
}>();

/** Слой значений показываем, только если Градье их вообще поддерживает. */
const showMeanings = computed(() => props.gradje?.hasMeanings ?? false);

const fullName = computed(() => props.name.parts.map((part) => part.value).join(' '));

const genderLabel = computed(() => (props.name.gender === 'female' ? 'Женское' : 'Мужское'));

const copied = ref(false);

async function copy() {
    try {
        await navigator.clipboard.writeText(fullName.value);
        copied.value = true;
        setTimeout(() => (copied.value = false), 1400);
    } catch {
        /* буфер обмена недоступен — молча игнорируем */
    }
}
</script>

<template>
    <article class="name-card">
        <header class="name-card__meta">
            <span class="name-card__gender" :class="`is-${name.gender}`" :title="genderLabel">
                {{ name.gender === 'female' ? '♀' : '♂' }}
            </span>
            <span class="name-card__gradje">{{ gradje?.name ?? name.gradjeId }}</span>

            <button
                type="button"
                class="name-card__copy"
                :aria-label="`Скопировать имя ${fullName}`"
                @click="copy"
            >
                {{ copied ? 'Скопировано' : 'Копировать' }}
            </button>
        </header>

        <div class="name-card__parts">
            <section v-for="(part, index) in name.parts" :key="index" class="name-card__part">
                <div v-if="part.label" class="name-card__part-label">{{ part.label }}</div>
                <div class="name-card__value">{{ part.value }}</div>

                <template v-if="showMeanings">
                    <div v-if="part.morphemes?.length" class="name-card__gloss">
                        <span v-for="(morpheme, i) in part.morphemes" :key="i" class="name-card__morpheme">
                            <span class="name-card__morpheme-value">{{ morpheme.value }}</span>
                            <span v-if="morpheme.meaning" class="name-card__morpheme-meaning">
                                {{ morpheme.meaning }}
                            </span>
                        </span>
                    </div>
                    <p v-if="part.meaning" class="name-card__meaning">«{{ part.meaning }}»</p>
                </template>
            </section>
        </div>

        <footer v-if="name.note" class="name-card__note">{{ name.note }}</footer>
    </article>
</template>

<style scoped>
.name-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 22px 22px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.2s, transform 0.2s;
}

.name-card:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
}

.name-card__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text-subtle);
}

.name-card__gender {
    display: inline-grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 13px;
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
}

.name-card__gender.is-female {
    background: #fbe9ee;
    color: #b0476a;
}

.name-card__gender.is-male {
    background: #e6eefb;
    color: #3e64a8;
}

.name-card__copy {
    margin-left: auto;
    border: 0;
    background: transparent;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    color: var(--color-text-subtle);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s, background-color 0.15s, color 0.15s;
}

.name-card:hover .name-card__copy,
.name-card__copy:focus-visible {
    opacity: 1;
}

.name-card__copy:hover {
    background: var(--color-accent-soft);
    color: var(--color-accent-text);
}

@media (hover: none) {
    .name-card__copy {
        opacity: 1;
    }
}

.name-card__parts {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.name-card__part + .name-card__part {
    padding-top: 14px;
    border-top: 1px dashed var(--color-border);
}

.name-card__part-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
}

.name-card__value {
    margin-top: 2px;
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-text);
}

.name-card__gloss {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.name-card__morpheme {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    padding: 2px 9px;
    border-radius: var(--radius-pill);
    background: var(--color-accent-soft);
    font-size: 12px;
}

.name-card__morpheme-value {
    font-weight: 600;
    color: var(--color-accent-text);
}

.name-card__morpheme-meaning {
    color: var(--color-text-muted);
}

.name-card__meaning {
    margin: 8px 0 0;
    font-family: var(--font-display);
    font-style: italic;
    font-size: 15px;
    color: var(--color-text-muted);
}

.name-card__note {
    font-size: 12px;
    color: var(--color-text-subtle);
}
</style>
