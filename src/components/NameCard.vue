<script setup lang="ts">
import { computed, ref } from 'vue';
import type { GeneratedName, GradjeConfig } from '@/generators/types';

const props = defineProps<{
    name: GeneratedName;
    gradje?: GradjeConfig;
}>();

const emit = defineEmits<{
    /** Перегенерировать одну часть имени, оставив остальные. */
    regeneratePart: [index: number];
}>();

/** Кнопка ↻ у части имеет смысл, только если частей несколько. */
const canRegenerateParts = computed(() => props.name.parts.length > 1);

/** Слой значений показываем, только если Градье их вообще поддерживает. */
const showMeanings = computed(() => props.gradje?.hasMeanings ?? false);

const fullName = computed(() => props.name.parts.map((part) => part.value).join(' '));

const genderLabels = { female: 'Женское', male: 'Мужское', any: 'Любой пол' } as const;
const genderIcons = { female: '♀', male: '♂', any: '' } as const;

const genderLabel = computed(() => genderLabels[props.name.gender]);
const genderIcon = computed(() => genderIcons[props.name.gender]);

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
            <!-- Универсальные имена без значка: ⚥ легко принять за мужской знак. -->
            <span
                v-if="name.gender !== 'any'"
                class="name-card__gender"
                :class="`is-${name.gender}`"
                :title="genderLabel"
            >
                {{ genderIcon }}
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
                <div class="name-card__head">
                    <div class="name-card__value">{{ part.value }}</div>
                    <div v-if="part.label" class="name-card__part-label">{{ part.label }}</div>
                    <button
                        v-if="canRegenerateParts"
                        type="button"
                        class="name-card__reroll"
                        :title="`Другое ${(part.label ?? 'имя').toLowerCase()}`"
                        :aria-label="`Перегенерировать: ${part.label ?? part.value}`"
                        @click="emit('regeneratePart', index)"
                    >
                        ↻
                    </button>
                </div>

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
    gap: 8px;
    padding: 12px 16px 14px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.2s, transform 0.2s;
}

.name-card:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-1px);
}

.name-card__meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--color-text-subtle);
}

.name-card__gender {
    display: inline-grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 11px;
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
    padding: 2px 6px;
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
    gap: 8px;
}

.name-card__part + .name-card__part {
    padding-top: 8px;
    border-top: 1px dashed var(--color-border);
}

.name-card__head {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0 8px;
}

.name-card__reroll {
    align-self: center;
    margin-left: auto;
    display: inline-grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    font-size: 15px;
    line-height: 1;
    color: var(--color-text-subtle);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s, background-color 0.15s, color 0.15s, transform 0.3s;
}

.name-card:hover .name-card__reroll,
.name-card__reroll:focus-visible {
    opacity: 1;
}

.name-card__reroll:hover {
    background: var(--color-accent-soft);
    color: var(--color-accent-text);
}

.name-card__reroll:active {
    transform: rotate(180deg);
}

@media (hover: none) {
    .name-card__reroll {
        opacity: 0.7;
    }
}

.name-card__part-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
}

.name-card__value {
    font-family: var(--font-display);
    font-size: 21px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-text);
}

.name-card__gloss {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
}

.name-card__morpheme {
    display: inline-flex;
    align-items: baseline;
    gap: 5px;
    padding: 1px 7px;
    border-radius: var(--radius-pill);
    background: var(--color-accent-soft);
    font-size: 11px;
}

.name-card__morpheme-value {
    font-weight: 600;
    color: var(--color-accent-text);
}

.name-card__morpheme-meaning {
    color: var(--color-text-muted);
}

.name-card__meaning {
    margin: 3px 0 0;
    font-family: var(--font-display);
    font-style: italic;
    font-size: 14px;
    line-height: 1.3;
    color: var(--color-text-muted);
}

.name-card__note {
    font-size: 11px;
    color: var(--color-text-subtle);
}
</style>
