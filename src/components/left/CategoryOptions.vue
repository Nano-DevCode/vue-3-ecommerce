<script lang="ts">
import { useCategoriesStore } from '@/stores/categories';
import { mapState } from 'pinia';

export default {
  methods: {
    clearCategory() {
      this.$router.push({ name: 'catalog' });
    },
    goToCategory(categoryId: number) {
      this.$router.push({
        name: 'category',
        params: { categoryId }
      });
    },
    getCategoryIcon(name: string) {
      const lower = name.toLowerCase();
      if (lower.includes('oficina')) return 'mdi-desk';
      if (lower.includes('computadora')) return 'mdi-laptop';
      if (lower.includes('audio')) return 'mdi-headphones';
      return 'mdi-shape-outline';
    }
  },
  computed: {
    ...mapState(useCategoriesStore, ['categories', 'loading']),
    isAllActive() {
      return (this.$route.name === 'catalog' || this.$route.name === 'home') && !this.$route.params.categoryId;
    }
  }
}
</script>

<template>
  <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis px-3 mb-1">
    Categorías
  </div>

  <v-list-item
    link
    @click="clearCategory()"
    :active="isAllActive"
    color="primary"
    rounded="lg"
    prepend-icon="mdi-all-inclusive"
  >
    <v-list-item-title class="font-weight-medium">
      Todas las Categorías
    </v-list-item-title>
  </v-list-item>

  <v-progress-linear v-if="loading" indeterminate color="primary" rounded class="my-2" />

  <v-list-item
    v-else
    v-for="category in categories"
    :key="category.id"
    link
    @click="goToCategory(category.id)"
    :active="$route.name === 'category' && Number($route.params.categoryId) === category.id"
    color="primary"
    rounded="lg"
    :prepend-icon="getCategoryIcon(category.name)"
  >
    <v-list-item-title class="font-weight-medium">
      {{ category.name }}
    </v-list-item-title>
  </v-list-item>
</template>
