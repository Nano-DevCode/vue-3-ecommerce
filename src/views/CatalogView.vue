<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import LeftMenu from '@/components/LeftMenu.vue';
import ProductList from '@/components/ProductList.vue';
import ProductDetailModal from '@/components/ProductDetailModal.vue';
import { useCategoriesStore } from '@/stores/categories';
import { useProductsStore } from '@/stores/products';

const route = useRoute();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

function syncCategory() {
  if (route.params.categoryId) {
    productsStore.selectCategory(Number(route.params.categoryId));
  } else {
    productsStore.selectCategory(null);
  }
}

onMounted(() => {
  productsStore.fetchProducts();
  categoriesStore.fetchCategories();
  syncCategory();
});

watch(() => route.params.categoryId, () => {
  syncCategory();
});
</script>

<template>
  <div class="py-2">
    <!-- Breadcrumb & Header -->
    <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-6">
      <div>
        <v-breadcrumbs class="pa-0 mb-1 text-body-2">
          <v-breadcrumbs-item to="/">Inicio</v-breadcrumbs-item>
          <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
          <v-breadcrumbs-item disabled class="font-weight-medium text-high-emphasis">
            Catálogo de Productos
          </v-breadcrumbs-item>
        </v-breadcrumbs>
        <h1 class="text-h4 font-weight-black">
          Explora Nuestro Catálogo
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          Encuentra accesorios y periféricos para tu setup tecnológico con filtros avanzados y entrega inmediata.
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <v-row class="ga-0">
      <!-- Sidebar Filters -->
      <v-col cols="12" md="4" lg="3" class="pr-md-4">
        <LeftMenu />
      </v-col>

      <!-- Products Grid -->
      <v-col cols="12" md="8" lg="9">
        <ProductList />
      </v-col>
    </v-row>

    <!-- Quick View Modal -->
    <ProductDetailModal />
  </div>
</template>
