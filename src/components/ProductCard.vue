<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/model/types';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useProductsStore } from '@/stores/products';
import { useCategoriesStore } from '@/stores/categories';

import { useRouter } from 'vue-router';

const props = defineProps<{
  product: Product
}>();

const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

const categoryName = computed(() => {
  const cat = categoriesStore.categories.find(c => c.id === props.product.categoryId);
  return cat ? cat.name : 'Tecnología';
});

const productImageUrl = computed(() => {
  return props.product.image || 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg';
});

const isWishlisted = computed(() => {
  return wishlistStore.isInWishlist(props.product.id);
});

function handleAddToCart(e: Event) {
  e.stopPropagation();
  cartStore.addProduct(props.product);
}

function handleToggleWishlist(e: Event) {
  e.stopPropagation();
  wishlistStore.toggleWishlist(props.product);
}

function goToDetail() {
  router.push({ name: 'product-detail', params: { id: props.product.id } });
}

function openQuickView(e: Event) {
  e.stopPropagation();
  productsStore.openQuickView(props.product);
}
</script>

<template>
  <v-card
    class="rounded-xl border hover-card-elevated d-flex flex-column h-100 overflow-hidden cursor-pointer"
    elevation="1"
    @click="goToDetail"
  >
    <!-- Image Box with Badges & Wishlist Button -->
    <div class="product-image-container position-relative overflow-hidden bg-surface-variant">
      <v-img
        :src="productImageUrl"
        height="220"
        cover
        class="product-image"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary" size="32" />
          </div>
        </template>
      </v-img>

      <!-- Category / Custom Badge -->
      <v-chip
        size="x-small"
        color="surface"
        variant="flat"
        class="position-absolute font-weight-bold elevation-2"
        style="top: 12px; left: 12px; z-index: 2;"
      >
        {{ product.badge || categoryName }}
      </v-chip>

      <!-- Wishlist Heart Button -->
      <v-btn
        icon
        size="small"
        variant="flat"
        color="surface"
        class="position-absolute elevation-2"
        style="top: 12px; right: 12px; z-index: 2;"
        :title="isWishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'"
        @click="handleToggleWishlist"
      >
        <v-icon
          :icon="isWishlisted ? 'mdi-heart' : 'mdi-heart-outline'"
          :color="isWishlisted ? 'error' : 'medium-emphasis'"
          size="18"
        />
      </v-btn>

      <!-- Quick View Hover Button -->
      <div class="quick-view-overlay d-flex align-center justify-center">
        <v-btn
          color="white"
          variant="flat"
          size="small"
          rounded="pill"
          prepend-icon="mdi-eye-outline"
          class="font-weight-bold text-primary elevation-3 text-none"
          @click="openQuickView"
        >
          Vista Rápida
        </v-btn>
      </div>
    </div>

    <!-- Product Details -->
    <v-card-text class="pa-4 d-flex flex-column flex-grow-1">
      <div class="d-flex align-center mb-1 ga-1">
        <v-icon icon="mdi-star" size="14" color="amber-darken-1" />
        <span class="text-caption font-weight-bold text-medium-emphasis">{{ product.rating ?? 4.9 }}</span>
        <span class="text-caption text-disabled">({{ product.reviewsCount ?? 28 }})</span>
      </div>

      <h3 class="text-subtitle-1 font-weight-bold line-clamp-1 mb-1" :title="product.name">
        {{ product.name }}
      </h3>

      <p class="text-caption text-medium-emphasis mb-3 line-clamp-2">
        {{ product.description || 'Producto garantizado de alta durabilidad, diseñado con materiales de calidad superior.' }}
      </p>

      <v-spacer />

      <!-- Price Box -->
      <div class="d-flex align-baseline justify-space-between pt-2 border-t">
        <div>
          <span class="text-caption text-medium-emphasis d-block">Precio</span>
          <div class="d-flex align-baseline ga-1">
            <span class="text-h6 font-weight-black text-primary">
              ${{ product.price }}
            </span>
            <span class="text-caption text-medium-emphasis font-weight-medium">MXN</span>

            <span
              v-if="product.originalPrice && product.originalPrice > product.price"
              class="text-caption text-decoration-line-through text-medium-emphasis ml-1"
            >
              ${{ product.originalPrice }}
            </span>
          </div>
        </div>

        <v-chip size="x-small" color="success" variant="tonal" class="font-weight-bold">
          En stock
        </v-chip>
      </div>
    </v-card-text>

    <!-- Card Actions -->
    <v-card-actions class="px-4 pb-4 pt-0">
      <v-btn
        color="primary"
        variant="flat"
        block
        rounded="lg"
        prepend-icon="mdi-cart-plus"
        class="font-weight-bold py-2 text-none"
        @click="handleAddToCart"
      >
        Agregar al carrito
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.product-image-container {
  overflow: hidden;
}

.product-image {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-card-elevated:hover .product-image {
  transform: scale(1.08);
}

.quick-view-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 1;
}

.hover-card-elevated:hover .quick-view-overlay {
  opacity: 1;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
