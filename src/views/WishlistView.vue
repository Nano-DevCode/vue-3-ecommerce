<script setup lang="ts">
import { useWishlistStore } from '@/stores/wishlist';
import { useCartStore } from '@/stores/cart';
import ProductCard from '@/components/ProductCard.vue';
import ProductDetailModal from '@/components/ProductDetailModal.vue';

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

function addAllToCart() {
  wishlistStore.items.forEach(item => {
    cartStore.addProduct(item);
  });
  wishlistStore.clearWishlist();
  cartStore.notify('Todos los productos favoritos fueron transferidos al carrito', 'success');
}
</script>

<template>
  <div class="py-2">
    <!-- Header -->
    <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-6">
      <div>
        <v-breadcrumbs class="pa-0 mb-1 text-body-2">
          <v-breadcrumbs-item to="/">Inicio</v-breadcrumbs-item>
          <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
          <v-breadcrumbs-item disabled class="font-weight-medium text-high-emphasis">
            Lista de Deseos
          </v-breadcrumbs-item>
        </v-breadcrumbs>

        <div class="d-flex align-center ga-2">
          <v-icon icon="mdi-heart" color="error" size="28" />
          <h1 class="text-h4 font-weight-black">Mis Productos Favoritos</h1>
          <v-chip v-if="wishlistStore.count > 0" color="error" size="small" variant="flat">
            {{ wishlistStore.count }}
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis">
          Artículos guardados que deseas adquirir más adelante.
        </p>
      </div>

      <div v-if="wishlistStore.count > 0" class="d-flex ga-2">
        <v-btn
          variant="outlined"
          color="error"
          rounded="lg"
          prepend-icon="mdi-trash-can-outline"
          class="text-none"
          @click="wishlistStore.clearWishlist()"
        >
          Vaciar Favoritos
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          prepend-icon="mdi-cart-arrow-down"
          class="text-none font-weight-bold"
          @click="addAllToCart"
        >
          Mover Todo al Carrito
        </v-btn>
      </div>
    </div>

    <!-- Empty State -->
    <v-card
      v-if="wishlistStore.count === 0"
      class="rounded-2xl border pa-12 text-center my-6"
      elevation="1"
    >
      <v-avatar color="error" variant="tonal" size="90" class="mb-4">
        <v-icon icon="mdi-heart-outline" size="48" color="error" />
      </v-avatar>
      <h2 class="text-h5 font-weight-bold mb-2">Tu lista de deseos está vacía</h2>
      <p class="text-body-1 text-medium-emphasis mb-6" style="max-width: 480px; margin: 0 auto;">
        No has guardado ningún producto aún. Explora nuestro catálogo y presiona el ícono del corazón para no perder tus artículos favoritos.
      </p>
      <v-btn
        to="/products"
        color="primary"
        variant="flat"
        rounded="lg"
        size="large"
        prepend-icon="mdi-shopping-outline"
        class="text-none font-weight-bold"
      >
        Ir al Catálogo
      </v-btn>
    </v-card>

    <!-- Wishlist Grid -->
    <v-row v-else class="my-2">
      <v-col
        v-for="item in wishlistStore.items"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard :product="item" />
      </v-col>
    </v-row>

    <!-- Quick View Modal -->
    <ProductDetailModal />
  </div>
</template>
