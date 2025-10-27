<script lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { mapState } from 'pinia';
import { useProductsStore } from '@/stores/products';

export default{
  components:{
    ProductCard
  },
  props: ['details'],
  computed: {
    ...mapState(useProductsStore, ['products','loading'])
  }
}
</script>


<template>
  <div v-if="loading" class="d-flex justify-center align-center h-100">
    <v-progress-circular indeterminate :size="50" :width="5"></v-progress-circular>
  </div>
  <v-row v-else>
    <v-col v-for="p in products" :key="p.id" cols="12" sm="6" md="4" lg="3">
      <ProductCard
        :product="p"
        />
    </v-col>
  </v-row>
</template>
