<script lang="ts">
import LeftMenu from '@/components/LeftMenu.vue';
import ProductList from '@/components/ProductList.vue';
import { useCategoriesStore } from '@/stores/categories';
import { useProductsStore } from '@/stores/products';

function updateCategoryFromRouteParams(categoryIdParam: string | string[]){
  const productsStore = useProductsStore();
  const categoryId = Number(categoryIdParam);
  productsStore.selectCategory(categoryId);
}

export default {
  components: {
    ProductList,
    LeftMenu,
  },
  beforeRouteEnter(to){
    console.log('beforeRouteEnter' ,to.params);
    updateCategoryFromRouteParams(to.params.categoryId);
  },
  beforeRouteUpdate(to) {
    console.log( 'beforeRouteUpdate' ,to.params);
    updateCategoryFromRouteParams(to.params.categoryId);
  },
  mounted(){
    console.log('mounted');

    const productsStore = useProductsStore();
    productsStore.fetchProducts();

    const categoriesStore = useCategoriesStore();
    categoriesStore.fetchCategories();

  }
}
</script>

<template>
  <main>

    <v-row>
      <v-col cols="12" sm="3" md="3" lg="2">
        <LeftMenu />
      </v-col>

      <v-col cols="12" sm="9" md="9" lg="10">
        <ProductList />
      </v-col>
    </v-row>

  </main>
</template>
