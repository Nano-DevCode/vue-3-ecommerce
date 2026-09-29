<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import ShoppingCartItem from './ShoppingCartItem.vue';

const cartStore = useCartStore();
</script>

<template>
  <!-- Empty State -->
  <v-card
    v-if="cartStore.details.length === 0"
    class="rounded-xl border pa-8 pa-md-12 text-center"
    elevation="1"
  >
    <v-avatar color="primary" variant="tonal" size="90" class="mb-4">
      <v-icon icon="mdi-cart-off" size="50" color="primary" />
    </v-avatar>
    <h2 class="text-h6 font-weight-bold mb-2">Tu carrito está vacío</h2>
    <p class="text-body-2 text-medium-emphasis mb-6" style="max-width: 440px; margin: 0 auto;">
      Aún no has agregado productos a tu orden. Descubre nuestras ofertas y añade periféricos a tu lista.
    </p>
    <v-btn
      to="/"
      color="primary"
      variant="flat"
      rounded="lg"
      size="large"
      prepend-icon="mdi-arrow-left"
      class="text-none font-weight-bold"
    >
      Explorar Productos
    </v-btn>
  </v-card>

  <!-- Items Table Card -->
  <v-card v-else class="rounded-xl border overflow-hidden" elevation="1">
    <div class="pa-4 pa-md-5 d-flex align-center justify-space-between border-b">
      <div class="d-flex align-center">
        <v-icon icon="mdi-format-list-bulleted" color="primary" class="mr-2" size="22" />
        <span class="text-subtitle-1 font-weight-bold">Artículos Seleccionados</span>
      </div>

      <v-btn
        variant="text"
        color="error"
        size="small"
        prepend-icon="mdi-delete-sweep-outline"
        class="text-none"
        @click="cartStore.clearCart()"
      >
        Vaciar Carrito
      </v-btn>
    </div>

    <v-table class="bg-transparent">
      <thead>
        <tr class="text-medium-emphasis">
          <th class="text-left font-weight-bold py-3">Producto</th>
          <th class="text-center font-weight-bold py-3" style="width: 140px;">Cantidad</th>
          <th class="text-center font-weight-bold py-3" style="width: 120px;">Precio</th>
          <th class="text-center font-weight-bold py-3" style="width: 120px;">Subtotal</th>
          <th class="text-center font-weight-bold py-3" style="width: 60px;">
            <span class="d-sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <ShoppingCartItem
          v-for="detail in cartStore.details"
          :key="detail.product.id"
          :detail="detail"
        />
      </tbody>
    </v-table>
  </v-card>
</template>
