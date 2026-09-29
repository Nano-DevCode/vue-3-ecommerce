<script setup lang="ts">
import { ref, watch } from 'vue';
import OrderOptions from './left/OrderOptions.vue';
import CategoryOptions from './left/CategoryOptions.vue';
import { useProductsStore } from '@/stores/products';
import { useRouter } from 'vue-router';

const productsStore = useProductsStore();
const router = useRouter();

const priceVal = ref(productsStore.maxPrice || 500);

watch(priceVal, (val) => {
  productsStore.setMaxPrice(val);
});

function resetAllFilters() {
  priceVal.value = 500;
  productsStore.resetFilters();
  router.push({ name: 'catalog' });
}
</script>

<template>
  <v-card rounded="xl" elevation="1" class="border filter-sidebar">
    <div class="pa-4 d-flex align-center justify-space-between border-b">
      <div class="d-flex align-center">
        <v-icon icon="mdi-tune-variant" color="primary" class="mr-2" size="20" />
        <span class="text-subtitle-1 font-weight-bold">Filtros</span>
      </div>
      <v-btn
        v-if="productsStore.categoryId !== null || productsStore.searchQuery !== '' || productsStore.order !== 'price' || productsStore.maxPrice !== null || productsStore.onlyOffers"
        variant="text"
        size="x-small"
        color="primary"
        class="font-weight-medium"
        @click="resetAllFilters"
      >
        Limpiar
      </v-btn>
    </div>

    <div class="pa-3">
      <!-- Categories list -->
      <v-list density="comfortable" nav class="bg-transparent pa-0">
        <CategoryOptions />
      </v-list>

      <v-divider class="my-3" />

      <!-- Price Range Filter Slider -->
      <div class="px-2 mb-2">
        <div class="d-flex justify-space-between align-center mb-1">
          <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis">
            Precio Máximo
          </span>
          <span class="text-caption font-weight-bold text-primary">
            ${{ priceVal }} MXN
          </span>
        </div>
        <v-slider
          v-model="priceVal"
          :min="20"
          :max="500"
          :step="10"
          color="primary"
          track-color="surface-variant"
          density="compact"
          thumb-label
          hide-details
        />
      </div>

      <!-- Only Offers Switch -->
      <div class="px-2 mb-2">
        <v-switch
          :model-value="productsStore.onlyOffers"
          @update:model-value="productsStore.setOnlyOffers(!!$event)"
          color="primary"
          density="compact"
          hide-details
          label="Solo con Descuento"
          class="font-weight-medium text-body-2"
        />
      </div>

      <v-divider class="my-3" />

      <!-- Order options -->
      <v-list density="comfortable" nav class="bg-transparent pa-0">
        <OrderOptions />
      </v-list>
    </div>
  </v-card>
</template>

<style scoped>
@media (min-width: 960px) {
  .filter-sidebar {
    position: sticky;
    top: 84px;
  }
}
</style>
