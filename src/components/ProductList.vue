<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const router = useRouter()

const currentCategoryName = computed(() => {
  if (!productsStore.categoryId) return null
  const cat = categoriesStore.categories.find(c => c.id === productsStore.categoryId)
  return cat ? cat.name : null
})

function clearFilters() {
  productsStore.resetFilters()
  router.push({ name: 'catalog' })
}
</script>

<template>
  <div>
    <!-- Results Header / Filter Info -->
    <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-4">
      <div class="d-flex align-center flex-wrap ga-2">
        <span class="text-subtitle-1 font-weight-bold">
          {{ currentCategoryName ? currentCategoryName : 'Catálogo Completo' }}
        </span>
        <v-chip size="small" variant="tonal" color="primary">
          {{ productsStore.products.length }} {{ productsStore.products.length === 1 ? 'producto' : 'productos' }}
        </v-chip>

        <!-- Active Search Tag -->
        <v-chip
          v-if="productsStore.searchQuery"
          size="small"
          closable
          color="secondary"
          variant="tonal"
          @click:close="productsStore.setSearchQuery('')"
        >
          Búsqueda: "{{ productsStore.searchQuery }}"
        </v-chip>
      </div>

      <v-btn
        v-if="productsStore.categoryId !== null || productsStore.searchQuery !== ''"
        variant="text"
        size="small"
        color="primary"
        prepend-icon="mdi-filter-remove-outline"
        @click="clearFilters"
      >
        Restablecer
      </v-btn>
    </div>

    <!-- Loading Skeleton Grid -->
    <v-row v-if="productsStore.loading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="4">
        <v-skeleton-loader
          type="image, article, actions"
          class="rounded-xl border"
          elevation="1"
        />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card
      v-else-if="productsStore.products.length === 0"
      class="pa-10 text-center rounded-xl border"
      variant="flat"
    >
      <v-avatar color="primary" variant="tonal" size="80" class="mb-4">
        <v-icon icon="mdi-package-variant-closed-remove" size="44" color="primary" />
      </v-avatar>
      <h3 class="text-h6 font-weight-bold mb-2">No se encontraron productos</h3>
      <p class="text-body-2 text-medium-emphasis mb-6" style="max-width: 420px; margin: 0 auto;">
        No pudimos encontrar productos que coincidan con tus filtros o término de búsqueda.
      </p>
      <v-btn
        color="primary"
        variant="flat"
        rounded="lg"
        prepend-icon="mdi-refresh"
        @click="clearFilters"
      >
        Ver Todos los Productos
      </v-btn>
    </v-card>

    <!-- Products Grid -->
    <v-row v-else>
      <v-col
        v-for="p in productsStore.products"
        :key="p.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <ProductCard :product="p" />
      </v-col>
    </v-row>
  </div>
</template>
