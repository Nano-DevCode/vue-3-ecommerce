<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useCategoriesStore } from '@/stores/categories';

const productsStore = useProductsStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const categoriesStore = useCategoriesStore();

const quantity = ref(1);

const product = computed(() => productsStore.selectedProduct);

const categoryName = computed(() => {
  if (!product.value) return 'Tecnología';
  const cat = categoriesStore.categories.find(c => c.id === product.value?.categoryId);
  return cat ? cat.name : 'Tecnología';
});

const isFav = computed(() => {
  return product.value ? wishlistStore.isInWishlist(product.value.id) : false;
});

function handleAddToCart() {
  if (!product.value) return;
  cartStore.addProduct(product.value, quantity.value);
  productsStore.closeQuickView();
  quantity.value = 1;
}

function handleToggleWishlist() {
  if (!product.value) return;
  wishlistStore.toggleWishlist(product.value);
}
</script>

<template>
  <v-dialog
    v-model="productsStore.quickViewOpen"
    max-width="840"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card v-if="product" class="rounded-xl overflow-hidden" elevation="10">
      <!-- Close button -->
      <div class="position-absolute" style="top: 12px; right: 12px; z-index: 10;">
        <v-btn
          icon="mdi-close"
          variant="tonal"
          size="small"
          density="comfortable"
          @click="productsStore.closeQuickView()"
          aria-label="Cerrar modal"
        />
      </div>

      <v-card-text class="pa-0">
        <v-row no-gutters>
          <!-- Left: Image column -->
          <v-col cols="12" md="5" class="bg-surface-variant d-flex align-center justify-center pa-6 position-relative">
            <v-img
              :src="product.image || 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'"
              max-height="340"
              contain
              class="rounded-lg"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="primary" />
                </div>
              </template>
            </v-img>

            <v-chip
              v-if="product.badge"
              color="primary"
              variant="flat"
              size="small"
              class="position-absolute font-weight-bold"
              style="top: 16px; left: 16px;"
            >
              {{ product.badge }}
            </v-chip>
          </v-col>

          <!-- Right: Details column -->
          <v-col cols="12" md="7" class="pa-6 pa-md-8 d-flex flex-column">
            <!-- Category & SKU -->
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-caption font-weight-bold text-uppercase text-primary">
                {{ categoryName }}
              </span>
              <span class="text-caption text-medium-emphasis">
                SKU: #00{{ product.id }}
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-h5 font-weight-black mb-2">
              {{ product.name }}
            </h2>

            <!-- Rating & Reviews -->
            <div class="d-flex align-center ga-1 mb-4">
              <v-icon icon="mdi-star" color="amber-darken-1" size="18" />
              <span class="text-body-2 font-weight-bold">{{ product.rating ?? 4.9 }}</span>
              <span class="text-caption text-medium-emphasis">
                ({{ product.reviewsCount ?? 32 }} opiniones verificadas)
              </span>
              <v-chip size="x-small" color="success" variant="tonal" class="ml-2">
                En Stock
              </v-chip>
            </div>

            <!-- Price with discount badge -->
            <div class="d-flex align-baseline ga-3 mb-4">
              <span class="text-h4 font-weight-black text-primary">
                ${{ product.price }} <span class="text-caption font-weight-bold">MXN</span>
              </span>
              <span
                v-if="product.originalPrice && product.originalPrice > product.price"
                class="text-body-1 text-decoration-line-through text-medium-emphasis"
              >
                ${{ product.originalPrice }} MXN
              </span>
              <v-chip
                v-if="product.originalPrice && product.originalPrice > product.price"
                size="x-small"
                color="error"
                variant="flat"
                class="font-weight-bold"
              >
                AHORRA ${{ product.originalPrice - product.price }} MXN
              </v-chip>
            </div>

            <!-- Description -->
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ product.description || 'Diseñado para brindar el máximo desempeño, durabilidad y comodidad en tu día a día.' }}
            </p>

            <!-- Features -->
            <div v-if="product.features && product.features.length > 0" class="mb-5">
              <span class="text-caption font-weight-bold d-block text-uppercase text-medium-emphasis mb-2">
                Características Destacadas:
              </span>
              <ul class="features-list text-body-2 text-medium-emphasis pl-0">
                <li v-for="(feat, index) in product.features" :key="index" class="d-flex align-center mb-1">
                  <v-icon icon="mdi-check-circle" color="success" size="16" class="mr-2 flex-shrink-0" />
                  <span>{{ feat }}</span>
                </li>
              </ul>
            </div>

            <v-spacer />

            <!-- Quantity & Actions -->
            <div class="pt-4 border-t">
              <div class="d-flex align-center ga-3 mb-3">
                <div class="d-inline-flex align-center bg-surface-variant rounded-pill pa-1 border">
                  <v-btn
                    icon="mdi-minus"
                    size="x-small"
                    variant="text"
                    :disabled="quantity <= 1"
                    @click="quantity > 1 ? quantity-- : null"
                  />
                  <span class="px-3 font-weight-bold text-body-2">{{ quantity }}</span>
                  <v-btn
                    icon="mdi-plus"
                    size="x-small"
                    variant="text"
                    @click="quantity++"
                  />
                </div>

                <!-- Add to cart -->
                <v-btn
                  color="primary"
                  variant="flat"
                  rounded="lg"
                  size="large"
                  prepend-icon="mdi-cart-plus"
                  class="flex-grow-1 font-weight-bold text-none"
                  @click="handleAddToCart"
                >
                  Agregar {{ quantity > 1 ? `(${quantity})` : '' }} al Carrito
                </v-btn>

                <!-- Wishlist toggle -->
                <v-btn
                  icon
                  variant="tonal"
                  size="large"
                  rounded="lg"
                  :color="isFav ? 'error' : undefined"
                  @click="handleToggleWishlist"
                  :title="isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'"
                >
                  <v-icon :icon="isFav ? 'mdi-heart' : 'mdi-heart-outline'" />
                </v-btn>
              </div>

              <div class="d-flex align-center justify-center ga-4 text-caption text-medium-emphasis mt-3 pt-2 border-t">
                <span class="d-flex align-center"><v-icon icon="mdi-shield-check" color="success" size="16" class="mr-1" /> Garantía 1 año</span>
                <span class="d-flex align-center"><v-icon icon="mdi-truck-fast" color="primary" size="16" class="mr-1" /> Envío gratis</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.features-list {
  list-style: none;
}
</style>
