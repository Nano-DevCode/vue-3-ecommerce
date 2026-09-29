<script setup lang="ts">
import ShoppingCart from '@/components/cart/ShoppingCart.vue';
import SummaryCard from '@/components/cart/SummaryCard.vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
</script>

<template>
  <div>
    <!-- Cart Header -->
    <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-6">
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <v-icon icon="mdi-cart-outline" color="primary" size="28" />
          <h1 class="text-h5 text-md-h4 font-weight-bold">
            Carrito de Compras
          </h1>
          <v-chip v-if="cartStore.cartItemCount > 0" color="primary" size="small" variant="flat">
            {{ cartStore.cartItemCount }} {{ cartStore.cartItemCount === 1 ? 'artículo' : 'artículos' }}
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis">
          Revisa y gestiona los artículos de tu compra antes de proceder al pago seguro.
        </p>
      </div>

      <v-btn
        to="/"
        variant="tonal"
        color="primary"
        rounded="lg"
        prepend-icon="mdi-arrow-left"
        class="text-none"
      >
        Continuar Comprando
      </v-btn>
    </div>

    <!-- Main Grid -->
    <v-row>
      <v-col cols="12" lg="8">
        <ShoppingCart />
      </v-col>
      <v-col cols="12" lg="4">
        <SummaryCard />
      </v-col>
    </v-row>
  </div>
</template>
