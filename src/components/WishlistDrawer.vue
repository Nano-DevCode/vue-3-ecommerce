<script setup lang="ts">
import { useWishlistStore } from '@/stores/wishlist';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/model/types';

defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

function close() {
  emit('update:modelValue', false);
}

function moveToCart(product: Product) {
  cartStore.addProduct(product);
  wishlistStore.removeFromWishlist(product.id);
}
</script>

<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    location="right"
    temporary
    width="380"
  >
    <!-- Header -->
    <div class="pa-4 d-flex align-center justify-space-between border-b">
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-heart" color="error" size="22" />
        <h3 class="text-subtitle-1 font-weight-bold">Lista de Deseos</h3>
        <v-chip size="x-small" color="error" variant="flat">
          {{ wishlistStore.count }}
        </v-chip>
      </div>

      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        density="comfortable"
        @click="close"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="wishlistStore.items.length === 0"
      class="pa-8 text-center d-flex flex-column align-center justify-center fill-height"
    >
      <v-avatar color="error" variant="tonal" size="70" class="mb-3">
        <v-icon icon="mdi-heart-outline" size="36" color="error" />
      </v-avatar>
      <h4 class="text-subtitle-1 font-weight-bold mb-1">Sin favoritos guardados</h4>
      <p class="text-caption text-medium-emphasis mb-4">
        Haz clic en el icono de corazón en cualquier producto para guardarlo aquí y revisarlo más tarde.
      </p>
      <v-btn
        color="primary"
        variant="tonal"
        size="small"
        rounded="lg"
        @click="close"
      >
        Seguir Explorando
      </v-btn>
    </div>

    <!-- Items List -->
    <div v-else class="pa-3">
      <div class="d-flex justify-end mb-2">
        <v-btn
          variant="text"
          color="error"
          size="x-small"
          prepend-icon="mdi-trash-can-outline"
          @click="wishlistStore.clearWishlist()"
        >
          Vaciar lista
        </v-btn>
      </div>

      <v-card
        v-for="item in wishlistStore.items"
        :key="item.id"
        class="pa-3 mb-3 rounded-lg border"
        variant="flat"
      >
        <div class="d-flex align-center mb-2">
          <v-avatar rounded="lg" size="50" class="mr-3 border bg-surface-variant flex-shrink-0">
            <v-img :src="item.image" cover />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <h5 class="text-body-2 font-weight-bold text-truncate" :title="item.name">
              {{ item.name }}
            </h5>
            <div class="text-caption font-weight-bold text-primary">
              ${{ item.price }} MXN
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="x-small"
            color="medium-emphasis"
            @click="wishlistStore.removeFromWishlist(item.id)"
          />
        </div>

        <v-btn
          color="primary"
          variant="flat"
          size="small"
          block
          rounded="lg"
          prepend-icon="mdi-cart-plus"
          class="text-none font-weight-medium"
          @click="moveToCart(item)"
        >
          Mover al Carrito
        </v-btn>
      </v-card>
    </div>
  </v-navigation-drawer>
</template>
