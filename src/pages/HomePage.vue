<script setup lang="ts">
import { computed, ref } from 'vue';

type GenderFilter = 'any' | 'female' | 'male';

interface MockName {
    firstName: string;
    lastName: string;
    gender: Exclude<GenderFilter, 'any'>;
}

const gender = ref<GenderFilter>('any');

// Мок-данные: логика генерации будет подключена позже
const allNames: MockName[] = [
    { firstName: 'Фенрай', lastName: 'Ирик-Гах', gender: 'male' },
    { firstName: 'Срарэй', lastName: 'Ирид-Тет', gender: 'female' },
    { firstName: 'Перин', lastName: 'Ириг-Ват', gender: 'male' },
    { firstName: 'Нрарэк', lastName: 'Ирил-Ла', gender: 'female' },
    { firstName: 'Каврап', lastName: 'Ири-Тат', gender: 'male' },
    { firstName: 'Прапуй', lastName: 'Ириф-Ро', gender: 'female' },
    { firstName: 'Евпэк', lastName: 'Ирик-Гах', gender: 'male' },
    { firstName: 'Певпик', lastName: 'Ириг-Ват', gender: 'female' },
];

const shownNames = ref<MockName[]>([...allNames]);

const filteredNames = computed(() =>
    gender.value === 'any'
        ? shownNames.value
        : shownNames.value.filter((item) => item.gender === gender.value),
);

function refreshNames() {
    shownNames.value = [...allNames].sort(() => Math.random() - 0.5);
}
</script>

<template>
  <div class="page">
    <header class="header">
      <h1 class="title">Генератор имён</h1>
      <label class="filter">
        <span class="filter-label">Пол</span>
        <select v-model="gender" class="select">
          <option value="any">Любые</option>
          <option value="female">Женские</option>
          <option value="male">Мужские</option>
        </select>
      </label>
    </header>

    <main class="content">
      <div class="cards">
        <article v-for="item in filteredNames" :key="`${item.firstName}-${item.lastName}`" class="card">
          <span class="card-first-name">{{ item.firstName }}</span>
          <span class="card-last-name">{{ item.lastName }}</span>
        </article>
      </div>

      <button type="button" class="refresh-button" @click="refreshNames">
        Новые имена
      </button>
    </main>
  </div>
</template>

<style scoped>
.page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 24px 32px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.title {
    margin: 0;
    font-size: 24px;
}

.filter {
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-label {
    font-size: 14px;
    color: #666;
}

.select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    margin-top: 32px;
}

.cards {
    width: 100%;
    max-width: 800px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
}

.card-first-name {
    font-size: 18px;
    font-weight: 600;
}

.card-last-name {
    font-size: 14px;
    color: #666;
}

.refresh-button {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    background: #4a67d8;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
}

.refresh-button:hover {
    background: #3a55c0;
}
</style>
