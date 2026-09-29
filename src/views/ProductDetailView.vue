<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useCategoriesStore } from '@/stores/categories';
import ProductCard from '@/components/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const categoriesStore = useCategoriesStore();

const quantity = ref(1);

onMounted(() => {
  if (productsStore._products.length === 0) {
    productsStore.fetchProducts();
  }
  if (categoriesStore.categories.length === 0) {
    categoriesStore.fetchCategories();
  }
});

const productId = computed(() => Number(route.params.id));

const product = computed(() => {
  return productsStore._products.find(p => p.id === productId.value);
});

// Reset quantity when product changes
watch(productId, () => {
  quantity.value = 1;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const category = computed(() => {
  if (!product.value) return null;
  return categoriesStore.categories.find(c => c.id === product.value?.categoryId);
});

const isWishlisted = computed(() => {
  return product.value ? wishlistStore.isInWishlist(product.value.id) : false;
});

const relatedProducts = computed(() => {
  if (!product.value) return [];
  return productsStore._products
    .filter(p => p.categoryId === product.value?.categoryId && p.id !== product.value?.id)
    .slice(0, 3);
});

function handleAddToCart() {
  if (!product.value) return;
  cartStore.addProduct(product.value, quantity.value);
}

function handleBuyNow() {
  if (!product.value) return;
  cartStore.addProduct(product.value, quantity.value);
  router.push({ name: 'checkout' });
}

function handleToggleWishlist() {
  if (!product.value) return;
  wishlistStore.toggleWishlist(product.value);
}
</script>

<template>
  <div v-if="product" class="py-4">
    <!-- Breadcrumb -->
    <v-breadcrumbs class="pa-0 mb-6 text-body-2">
      <v-breadcrumbs-item to="/">Inicio</v-breadcrumbs-item>
      <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
      <v-breadcrumbs-item to="/products">Catálogo</v-breadcrumbs-item>
      <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
      <v-breadcrumbs-item v-if="category" :to="`/categories/${category.id}`">
        {{ category.name }}
      </v-breadcrumbs-item>
      <v-breadcrumbs-divider v-if="category">/</v-breadcrumbs-divider>
      <v-breadcrumbs-item disabled class="font-weight-medium text-high-emphasis">
        {{ product.name }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <!-- Product Main Section -->
    <v-card rounded="2xl" elevation="1" class="border pa-6 pa-md-10 mb-10">
      <v-row align="center" justify="center">
        <!-- Left: Large Image Container -->
        <v-col cols="12" md="6" class="text-center">
          <div class="pa-6 rounded-2xl border bg-surface-variant position-relative overflow-hidden">
            <v-img
              :src="product.image || 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'"
              max-height="420"
              contain
              class="mx-auto product-detail-image"
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
              class="position-absolute font-weight-bold"
              style="top: 16px; left: 16px;"
            >
              {{ product.badge }}
            </v-chip>
          </div>
        </v-col>

        <!-- Right: Information & Actions -->
        <v-col cols="12" md="6" class="pl-md-8">
          <div class="d-flex align-center justify-space-between mb-2">
            <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold">
              {{ category ? category.name : 'Tecnología' }}
            </v-chip>
            <span class="text-caption text-medium-emphasis">SKU: #TS-00{{ product.id }}</span>
          </div>

          <h1 class="text-h4 text-md-h3 font-weight-black mb-3">
            {{ product.name }}
          </h1>

          <!-- Reviews & Stock -->
          <div class="d-flex align-center flex-wrap ga-2 mb-4">
            <div class="d-flex align-center ga-1">
              <v-icon icon="mdi-star" color="amber-darken-1" size="20" />
              <span class="font-weight-bold text-body-1">{{ product.rating ?? 4.9 }}</span>
            </div>
            <span class="text-body-2 text-medium-emphasis">
              ({{ product.reviewsCount ?? 45 }} opiniones de clientes verificados)
            </span>
            <v-chip size="small" color="success" variant="flat" prepend-icon="mdi-check-circle" class="ml-2 font-weight-bold">
              En Stock
            </v-chip>
          </div>

          <!-- Price Section -->
          <div class="d-flex align-baseline ga-3 mb-6 pa-4 rounded-xl border bg-surface-variant">
            <div>
              <span class="text-caption text-medium-emphasis d-block">Precio Final</span>
              <div class="d-flex align-baseline">
                <span class="text-h3 font-weight-black text-primary mr-1">
                  ${{ product.price }}
                </span>
                <span class="text-body-1 font-weight-bold text-medium-emphasis">MXN</span>
              </div>
            </div>

            <div v-if="product.originalPrice && product.originalPrice > product.price" class="ml-4">
              <span class="text-caption text-medium-emphasis d-block">Antes</span>
              <span class="text-h6 text-decoration-line-through text-medium-emphasis">
                ${{ product.originalPrice }} MXN
              </span>
              <v-chip size="x-small" color="error" variant="flat" class="ml-2 font-weight-bold">
                AHORRA ${{ product.originalPrice - product.price }} MXN
              </v-chip>
            </div>
          </div>

          <!-- Description -->
          <p class="text-body-1 text-medium-emphasis mb-6">
            {{ product.description || 'Producto tecnológico de alta calidad, diseñado para máxima comodidad, rendimiento y durabilidad garantizada.' }}
          </p>

          <!-- Quantity Stepper & Buttons -->
          <div class="mb-6">
            <span class="text-caption font-weight-bold d-block text-uppercase text-medium-emphasis mb-2">
              Cantidad:
            </span>
            <div class="d-flex flex-wrap align-center ga-3">
              <div class="d-inline-flex align-center bg-surface-variant rounded-pill pa-1 border">
                <v-btn
                  icon="mdi-minus"
                  size="small"
                  variant="text"
                  :disabled="quantity <= 1"
                  @click="quantity > 1 ? quantity-- : null"
                />
                <span class="px-4 font-weight-bold text-body-1">{{ quantity }}</span>
                <v-btn
                  icon="mdi-plus"
                  size="small"
                  variant="text"
                  @click="quantity++"
                />
              </div>

              <!-- Wishlist toggle -->
              <v-btn
                icon
                size="large"
                variant="tonal"
                rounded="lg"
                :color="isWishlisted ? 'error' : undefined"
                :title="isWishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'"
                @click="handleToggleWishlist"
              >
                <v-icon :icon="isWishlisted ? 'mdi-heart' : 'mdi-heart-outline'" />
              </v-btn>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex flex-column flex-sm-row ga-3 mb-6">
            <v-btn
              color="primary"
              variant="flat"
              size="x-large"
              rounded="lg"
              prepend-icon="mdi-cart-plus"
              class="flex-grow-1 font-weight-bold text-none"
              @click="handleAddToCart"
            >
              Agregar al Carrito
            </v-btn>

            <v-btn
              color="success"
              variant="tonal"
              size="x-large"
              rounded="lg"
              prepend-icon="mdi-flash"
              class="flex-grow-1 font-weight-bold text-none"
              @click="handleBuyNow"
            >
              Comprar Ahora
            </v-btn>
          </div>

          <!-- Trust highlights -->
          <div class="pt-4 border-t text-caption text-medium-emphasis">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon icon="mdi-truck-fast-outline" color="primary" size="20" />
              <span>Envío Gratis a todo México (Entrega estimada en 24 a 48 hrs)</span>
            </div>
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon icon="mdi-shield-check-outline" color="success" size="20" />
              <span>Garantía de 1 año con cambio directo de fábrica</span>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-headset" color="primary" size="20" />
              <span>Atención técnica directa ante cualquier duda</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Technical Specs Section -->
    <v-card v-if="product.features && product.features.length > 0" rounded="2xl" elevation="1" class="border pa-6 pa-md-8 mb-12">
      <div class="d-flex align-center ga-2 mb-4">
        <v-icon icon="mdi-format-list-checks" color="primary" size="24" />
        <h2 class="text-h6 font-weight-bold">Especificaciones y Características Técnicas</h2>
      </div>

      <v-row>
        <v-col v-for="(feat, index) in product.features" :key="index" cols="12" sm="6">
          <div class="pa-3 rounded-xl border bg-surface-variant d-flex align-center ga-3">
            <v-icon icon="mdi-check-circle" color="success" size="20" class="flex-shrink-0" />
            <span class="text-body-2 font-weight-medium">{{ feat }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Related Products Section -->
    <div v-if="relatedProducts.length > 0" class="mt-12">
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h2 class="text-h5 font-weight-bold">Productos Relacionados</h2>
          <p class="text-body-2 text-medium-emphasis">Otras opciones que complementan tu compra</p>
        </div>
        <v-btn to="/products" variant="text" color="primary" append-icon="mdi-arrow-right">
          Ver Catálogo Completo
        </v-btn>
      </div>

      <v-row>
        <v-col v-for="rel in relatedProducts" :key="rel.id" cols="12" sm="6" md="4">
          <ProductCard :product="rel" />
        </v-col>
      </v-row>
    </div>
  </div>

  <!-- Loading State if not ready -->
  <div v-else class="text-center py-16">
    <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
    <p class="text-body-1 text-medium-emphasis">Cargando detalles del producto...</p>
  </div>
</template>

<style scoped>
.product-detail-image {
  transition: transform 0.4s ease;
}

.product-detail-image:hover {
  transform: scale(1.05);
}
</style>
