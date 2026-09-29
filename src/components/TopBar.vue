<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { useWishlistStore } from '@/stores/wishlist'
import WishlistDrawer from '@/components/WishlistDrawer.vue'
import PortfolioTechModal from '@/components/PortfolioTechModal.vue'

const router = useRouter()
const route = useRoute()
const theme = useTheme()
const cartStore = useCartStore()
const productsStore = useProductsStore()
const wishlistStore = useWishlistStore()

const drawer = ref(false)
const wishlistDrawerOpen = ref(false)
const techModalOpen = ref(false)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function handleSearch(val: string) {
  productsStore.setSearchQuery(val ?? '')
  if (val && route.name !== 'catalog' && route.name !== 'category') {
    router.push({ name: 'catalog' })
  }
}
</script>

<template>
  <v-app-bar flat class="glass-effect" elevation="1">
    <v-container class="mx-auto d-flex align-center py-1" style="max-width: 1320px;">
      <!-- Mobile hamburger button -->
      <v-app-bar-nav-icon
        class="d-flex d-md-none mr-2"
        @click="drawer = !drawer"
        aria-label="Abrir menú"
      />

      <!-- Brand Logo & Name -->
      <RouterLink to="/" class="d-flex align-center text-decoration-none mr-3 mr-lg-6">
        <v-avatar color="primary" size="38" class="mr-2 elevation-2">
          <v-icon icon="mdi-storefront" color="white" size="22" />
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-black tracking-wide text-high-emphasis line-height-1">
            Tech<span class="text-primary">Store</span>
          </span>
          <span class="text-caption text-medium-emphasis d-none d-sm-block" style="font-size: 0.65rem !important;">
            ECOMMERCE VUE 3
          </span>
        </div>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <div class="d-none d-md-flex align-center ga-1 mr-4">
        <v-btn
          :to="{ name: 'home' }"
          :active="$route.name === 'home'"
          variant="text"
          rounded="lg"
          prepend-icon="mdi-home-outline"
        >
          Inicio
        </v-btn>

        <v-btn
          to="/products"
          :active="$route.name === 'catalog' || $route.name === 'category' || $route.name === 'product-detail'"
          variant="text"
          rounded="lg"
          prepend-icon="mdi-shopping-outline"
        >
          Catálogo
        </v-btn>

        <v-btn
          to="/wishlist"
          :active="$route.name === 'wishlist'"
          variant="text"
          rounded="lg"
          prepend-icon="mdi-heart-outline"
        >
          Favoritos
        </v-btn>

        <v-btn
          :to="{ name: 'about' }"
          :active="$route.name === 'about'"
          variant="text"
          rounded="lg"
          prepend-icon="mdi-information-outline"
        >
          Nosotros
        </v-btn>

        <!-- Tech Stack Portfolio Button -->
        <v-btn
          variant="tonal"
          color="primary"
          rounded="lg"
          size="small"
          prepend-icon="mdi-code-tags"
          class="text-none font-weight-bold ml-1"
          @click="techModalOpen = true"
        >
          Tech Stack
        </v-btn>
      </div>

      <!-- Real-time Search Field -->
      <div class="flex-grow-1 mx-2" style="max-width: 420px;">
        <v-text-field
          :model-value="productsStore.searchQuery"
          @update:model-value="handleSearch"
          density="compact"
          placeholder="Buscar periféricos, sillas..."
          prepend-inner-icon="mdi-magnify"
          clearable
          rounded="pill"
          variant="solo-filled"
          flat
          hide-details
          single-line
        />
      </div>

      <v-spacer class="d-none d-sm-flex" />

      <!-- Action Buttons: Wishlist, Theme Toggle & Cart -->
      <div class="d-flex align-center ga-2">
        <!-- Wishlist Button -->
        <v-badge
          :content="wishlistStore.count"
          :model-value="wishlistStore.count > 0"
          color="error"
          offset-x="4"
          offset-y="4"
        >
          <v-btn
            icon
            variant="tonal"
            size="small"
            title="Lista de Deseos"
            @click="wishlistDrawerOpen = true"
          >
            <v-icon icon="mdi-heart-outline" color="error" />
          </v-btn>
        </v-badge>

        <!-- Theme Toggle -->
        <v-btn
          icon
          variant="tonal"
          size="small"
          @click="toggleTheme"
          :title="theme.global.current.value.dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <v-icon
            :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            color="amber"
          />
        </v-btn>

        <!-- Cart Button -->
        <RouterLink to="/cart" custom v-slot="{ navigate }">
          <v-badge
            :content="cartStore.cartItemCount"
            :model-value="cartStore.cartItemCount > 0"
            color="primary"
            offset-x="4"
            offset-y="4"
          >
            <v-btn
              :active="$route.name === 'cart'"
              variant="flat"
              color="primary"
              rounded="lg"
              class="px-3"
              @click="navigate"
            >
              <v-icon icon="mdi-cart-outline" class="mr-1" />
              <span class="d-none d-sm-inline font-weight-medium">Carrito</span>
            </v-btn>
          </v-badge>
        </RouterLink>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="left">
    <div class="pa-4 d-flex align-center border-b">
      <v-avatar color="primary" size="32" class="mr-2">
        <v-icon icon="mdi-storefront" color="white" size="18" />
      </v-avatar>
      <span class="text-subtitle-1 font-weight-bold">Tech<span class="text-primary">Store</span></span>
    </div>

    <v-list density="comfortable" nav class="pa-3">
      <v-list-item
        to="/"
        prepend-icon="mdi-home-outline"
        title="Inicio"
        rounded="lg"
        @click="drawer = false"
      />
      <v-list-item
        to="/products"
        prepend-icon="mdi-shopping-outline"
        title="Catálogo de Productos"
        rounded="lg"
        @click="drawer = false"
      />
      <v-list-item
        to="/cart"
        prepend-icon="mdi-cart-outline"
        title="Carrito de Compras"
        rounded="lg"
        @click="drawer = false"
      >
        <template #append v-if="cartStore.cartItemCount > 0">
          <v-chip size="x-small" color="primary">{{ cartStore.cartItemCount }}</v-chip>
        </template>
      </v-list-item>
      <v-list-item
        to="/wishlist"
        prepend-icon="mdi-heart-outline"
        title="Lista de Deseos"
        rounded="lg"
        @click="drawer = false"
      >
        <template #append v-if="wishlistStore.count > 0">
          <v-chip size="x-small" color="error">{{ wishlistStore.count }}</v-chip>
        </template>
      </v-list-item>
      <v-list-item
        to="/about"
        prepend-icon="mdi-information-outline"
        title="Acerca de Nosotros"
        rounded="lg"
        @click="drawer = false"
      />
      <v-list-item
        prepend-icon="mdi-code-tags"
        title="Stack del Proyecto"
        rounded="lg"
        @click="drawer = false; techModalOpen = true"
      />

      <v-divider class="my-3" />

      <v-list-item
        prepend-icon="mdi-theme-light-dark"
        :title="theme.global.current.value.dark ? 'Modo Claro' : 'Modo Oscuro'"
        rounded="lg"
        @click="toggleTheme"
      />
    </v-list>
  </v-navigation-drawer>

  <!-- Wishlist Drawer Component -->
  <WishlistDrawer v-model="wishlistDrawerOpen" />

  <!-- Portfolio Tech Stack Modal -->
  <PortfolioTechModal v-model="techModalOpen" />
</template>

<style scoped>
.line-height-1 {
  line-height: 1.1;
}
</style>
