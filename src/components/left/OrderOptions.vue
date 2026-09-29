<script lang="ts">
import { useProductsStore } from '@/stores/products';
import { mapActions, mapState } from 'pinia';

export default {
  methods: {
    ...mapActions(useProductsStore, ['orderByName', 'orderByPrice', 'orderByNameDesc', 'orderByPriceDesc'])
  },
  computed: {
    ...mapState(useProductsStore, ['order'])
  }
}
</script>

<template>
  <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis px-3 mb-1">
    Ordenar por
  </div>

  <v-list-item
    link
    @click="orderByPrice"
    :active="order === 'price'"
    color="primary"
    rounded="lg"
    prepend-icon="mdi-sort-numeric-ascending"
  >
    <v-list-item-title class="font-weight-medium">
      Menor precio
    </v-list-item-title>
  </v-list-item>

  <v-list-item
    link
    @click="orderByPriceDesc"
    :active="order === 'priceDesc'"
    color="primary"
    rounded="lg"
    prepend-icon="mdi-sort-numeric-descending"
  >
    <v-list-item-title class="font-weight-medium">
      Mayor precio
    </v-list-item-title>
  </v-list-item>

  <v-list-item
    link
    @click="orderByName"
    :active="order === 'name'"
    color="primary"
    rounded="lg"
    prepend-icon="mdi-sort-alphabetical-ascending"
  >
    <v-list-item-title class="font-weight-medium">
      Nombre (A-Z)
    </v-list-item-title>
  </v-list-item>

  <v-list-item
    link
    @click="orderByNameDesc"
    :active="order === 'nameDesc'"
    color="primary"
    rounded="lg"
    prepend-icon="mdi-sort-alphabetical-descending"
  >
    <v-list-item-title class="font-weight-medium">
      Nombre (Z-A)
    </v-list-item-title>
  </v-list-item>
</template>
