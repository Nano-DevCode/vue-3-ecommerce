<script setup lang="ts">
import { computed } from 'vue';
import type { CartDetail } from '@/model/types';
import { useCartStore } from '@/stores/cart';

const props = defineProps<{
  detail: CartDetail
}>();

const cartStore = useCartStore();

const productImageUrl = computed(() => {
  return props.detail.product.image || 'https://cdn.vuetifyjs.com/images/parallax/material.jpg';
});

const subTotal = computed(() => {
  return props.detail.product.price * props.detail.quantity;
});
</script>

<template>
  <tr class="cart-item-row">
    <!-- Product Thumbnail & Name -->
    <td class="py-4">
      <div class="d-flex align-center">
        <v-avatar rounded="lg" size="52" class="mr-3 border bg-surface-variant flex-shrink-0">
          <v-img :src="productImageUrl" cover />
        </v-avatar>
        <div>
          <div class="font-weight-bold text-body-1 line-clamp-1" :title="detail.product.name">
            {{ detail.product.name }}
          </div>
          <span class="text-caption text-medium-emphasis">
            SKU: #00{{ detail.product.id }}
          </span>
        </div>
      </div>
    </td>

    <!-- Quantity Controls -->
    <td class="text-center py-4">
      <div class="d-inline-flex align-center bg-surface-variant rounded-pill pa-1 border">
        <v-btn
          icon="mdi-minus"
          size="x-small"
          variant="text"
          density="comfortable"
          :disabled="detail.quantity <= 1"
          @click="cartStore.decrement(detail.product.id)"
          aria-label="Disminuir cantidad"
        />
        <span class="px-3 font-weight-bold text-body-2">
          {{ detail.quantity }}
        </span>
        <v-btn
          icon="mdi-plus"
          size="x-small"
          variant="text"
          density="comfortable"
          @click="cartStore.increment(detail.product.id)"
          aria-label="Aumentar cantidad"
        />
      </div>
    </td>

    <!-- Unit Price -->
    <td class="text-center py-4 text-body-2 text-medium-emphasis">
      ${{ detail.product.price }} MXN
    </td>

    <!-- Subtotal -->
    <td class="text-center py-4 font-weight-bold text-primary text-body-1">
      ${{ subTotal }} MXN
    </td>

    <!-- Remove Action -->
    <td class="text-center py-4">
      <v-btn
        icon="mdi-trash-can-outline"
        size="small"
        color="error"
        variant="tonal"
        density="comfortable"
        title="Eliminar producto"
        @click="cartStore.deleteProduct(detail.product.id)"
      />
    </td>
  </tr>
</template>

<style scoped>
.cart-item-row:hover {
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
