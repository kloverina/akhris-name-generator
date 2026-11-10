<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SegmentedControl from '@/components/SegmentedControl.vue';
import GradjeOptions from '@/components/GradjeOptions.vue';
import NameCard from '@/components/NameCard.vue';
import { gradjes, findGradje } from '@/generators/registry';
import type { GenderFilter } from '@/generators/types';
import { useNameGenerator, type GradjeFilter } from '@/composables/useNameGenerator';

const NAMES_PER_BATCH = 12;

const genderItems: { value: GenderFilter; label: string }[] = [
    { value: 'any', label: 'Любые' },
    { value: 'male', label: 'Мужские' },
    { value: 'female', label: 'Женские' },
];

const gradjeItems = computed<{ value: GradjeFilter; label: string }[]>(() => [
    { value: 'all', label: 'Все Градья' },
    ...gradjes.map((gradje) => ({ value: gradje.id, label: gradje.name })),
]);

const gender = ref<GenderFilter>('any');
const gradjeId = ref<GradjeFilter>(gradjes.length === 1 ? gradjes[0].id : 'all');

const selectedGradje = computed(() => (gradjeId.value === 'all' ? undefined : findGradje(gradjeId.value)));

function defaultOptions() {
    return Object.fromEntries(
        (selectedGradje.value?.options ?? []).map((option) => [option.id, option.defaultValue ?? '']),
    ) as Record<string, string | boolean>;
}

const gradjeOptions = ref(defaultOptions());
watch(gradjeId, () => (gradjeOptions.value = defaultOptions()));

const { names, generate, regeneratePart } = useNameGenerator();

function regenerate() {
    generate({
        gender: gender.value,
        gradjeId: gradjeId.value,
        options: gradjeOptions.value,
        count: NAMES_PER_BATCH,
    });
}

watch([gender, gradjeId, gradjeOptions], regenerate, { immediate: true });
</script>

<template>
    <div class="page">
        <header class="hero">
            <p class="hero__eyebrow">Акхрис</p>
            <h1 class="hero__title">Генератор имён</h1>
            <p class="hero__lead">
                Имена для персонажей по правилам каждого Градья. Где имена что-то значат —
                карточка покажет, из чего имя сложено и как оно переводится.
            </p>
        </header>

        <section class="controls" aria-label="Параметры генерации">
            <div class="controls__main">
                <div class="controls__row">
                    <span class="controls__label">Пол</span>
                    <SegmentedControl v-model="gender" label="Пол" :items="genderItems" />
                </div>

                <div class="controls__row">
                    <span class="controls__label">Градье</span>
                    <SegmentedControl v-model="gradjeId" label="Градье" :items="gradjeItems" />
                </div>
            </div>

            <div v-if="selectedGradje?.options.length" class="controls__row">
                <span class="controls__label">Детали</span>
                <GradjeOptions v-model="gradjeOptions" :options="selectedGradje.options" />
            </div>

            <p v-if="selectedGradje?.description" class="controls__hint">
                {{ selectedGradje.description }}
            </p>
        </section>

        <section class="results" aria-live="polite">
            <div class="results__grid">
                <NameCard
                    v-for="name in names"
                    :key="name.id"
                    :name="name"
                    :gradje="findGradje(name.gradjeId)"
                    @regenerate-part="(index) => regeneratePart(name.id, index)"
                />
            </div>

            <div class="results__actions">
                <button type="button" class="button-primary" @click="regenerate">
                    <span aria-hidden="true">↻</span> Новые имена
                </button>
            </div>
        </section>

        <footer class="about">
            <h2 class="about__title">Об именах Акхриса</h2>
            <p>
                Каждое Градье называет своих жителей по-своему. В Рет-Тате имя состоит из личного
                имени, собранного из старо-язычных эпитетов, и гордого имени — рода и звания.
                В других Градьях имена могут и не нести значения: тогда карточка покажет только само имя.
            </p>
            <p class="about__note">
                Сейчас генератор работает на примерах — полноценная логика имён появится позже.
            </p>
        </footer>
    </div>
</template>

<style scoped>
.page {
    max-width: var(--page-width);
    margin: 0 auto;
    padding: 24px 24px 64px;
}

.hero {
    max-width: 920px;
    margin-bottom: 20px;
}

.hero__eyebrow {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-accent);
}

.hero__title {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(30px, 4vw, 40px);
    font-weight: 600;
    line-height: 1.1;
}

.hero__lead {
    margin: 8px 0 0;
    font-size: 15px;
    color: var(--color-text-muted);
}

.controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 18px;
    margin-bottom: 16px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
}

.controls__main {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 32px;
}

.controls__main > .controls__row {
    flex: 1 1 360px;
}

.controls__row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 16px;
}

.controls__row > :not(.controls__label) {
    flex: 1 1 0;
    min-width: 0;
    max-width: 100%;
}

.controls__label {
    width: 72px;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-subtle);
}

.controls__hint {
    margin: 0;
    padding-top: 10px;
    border-top: 1px solid var(--color-border);
    font-size: 13px;
    color: var(--color-text-muted);
}

.results__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: 1fr;
    gap: 12px;
}

.results__actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.button-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border: 0;
    border-radius: var(--radius-pill);
    background: var(--color-accent);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s, transform 0.1s;
}

.button-primary:hover {
    background: var(--color-accent-hover);
}

.button-primary:active {
    transform: scale(0.98);
}

.about {
    max-width: 720px;
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
    color: var(--color-text-muted);
}

.about__title {
    margin: 0 0 10px;
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text);
}

.about__note {
    font-size: 13px;
    color: var(--color-text-subtle);
}

@media (max-width: 600px) {
    .page {
        padding-top: 24px;
    }

    .controls__label {
        width: 100%;
    }
}
</style>
