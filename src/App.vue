<script setup lang="ts">
import TopBar from '@/components/TopBar.vue'
import NoEmailModal from '@/components/NoEmailModal.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <v-app>
    <TopBar />

    <v-main>
      <v-container class="py-6 py-md-8 px-4 px-md-8" style="max-width: 1320px;">
        <RouterView />
      </v-container>
    </v-main>

    <!-- Global Toast / Snackbar Notification -->
    <v-snackbar
      v-model="cartStore.notification.show"
      :color="cartStore.notification.color"
      location="bottom right"
      :timeout="3000"
      rounded="lg"
      elevation="8"
    >
      <div class="d-flex align-center">
        <v-icon
          :icon="cartStore.notification.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-information-outline'"
          class="mr-2"
          size="22"
        />
        <span class="font-weight-medium">{{ cartStore.notification.message }}</span>
      </div>
      <template #actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          size="small"
          density="comfortable"
          @click="cartStore.hideNotification()"
        />
      </template>
    </v-snackbar>

    <!-- Global No Email Modal -->
    <NoEmailModal />

    <!-- Modern Footer -->
    <v-footer class="bg-surface border-t mt-12 py-10">
      <v-container style="max-width: 1320px;">
        <v-row>
          <v-col cols="12" md="4" class="mb-4 mb-md-0">
            <div class="d-flex align-center mb-3">
              <v-avatar color="primary" size="36" class="mr-3 elevation-2">
                <v-icon icon="mdi-shopping-outline" color="white" size="20" />
              </v-avatar>
              <span class="text-h6 font-weight-bold tracking-wide">TechStore</span>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Tu tienda especializada en tecnología, periféricos gamer y ergonomía para oficina. La mejor calidad y precios competitivos.
            </p>
            <div class="d-flex ga-2">
              <v-btn icon="mdi-facebook" variant="tonal" size="small" density="comfortable" color="primary" />
              <v-btn icon="mdi-instagram" variant="tonal" size="small" density="comfortable" color="primary" />
              <v-btn icon="mdi-twitter" variant="tonal" size="small" density="comfortable" color="primary" />
              <v-btn
                icon="mdi-email-outline"
                variant="tonal"
                size="small"
                density="comfortable"
                color="primary"
                title="Enviar correo"
                @click="cartStore.openNoEmailModal()"
              />
            </div>
          </v-col>

          <v-col cols="6" sm="4" md="2" class="mb-4 mb-md-0">
            <div class="text-subtitle-2 font-weight-bold mb-3">Navegación</div>
            <ul class="list-unstyled text-body-2 text-medium-emphasis">
              <li class="mb-2"><RouterLink to="/" class="text-decoration-none text-medium-emphasis">Inicio</RouterLink></li>
              <li class="mb-2"><RouterLink to="/products" class="text-decoration-none text-medium-emphasis">Catálogo</RouterLink></li>
              <li class="mb-2"><RouterLink to="/cart" class="text-decoration-none text-medium-emphasis">Carrito</RouterLink></li>
              <li class="mb-2"><RouterLink to="/about" class="text-decoration-none text-medium-emphasis">Nosotros</RouterLink></li>
            </ul>
          </v-col>

          <v-col cols="6" sm="4" md="2" class="mb-4 mb-md-0">
            <div class="text-subtitle-2 font-weight-bold mb-3">Atención</div>
            <ul class="list-unstyled text-body-2 text-medium-emphasis">
              <li class="mb-2">Garantía 100%</li>
              <li class="mb-2">Envíos Rápidos</li>
              <li class="mb-2">Soporte en Línea</li>
            </ul>
          </v-col>

          <v-col cols="12" sm="4" md="4">
            <div class="text-subtitle-2 font-weight-bold mb-3">Pagos & Seguridad</div>
            <p class="text-body-2 text-medium-emphasis mb-3">
              Pasarela de pago simulada segura con soporte para tarjetas de crédito/débito y transferencias electrónicas SPEI.
            </p>
            <div class="d-flex ga-3 align-center">
              <v-chip size="small" color="primary" variant="outlined" prepend-icon="mdi-shield-check">
                Compra Protegida
              </v-chip>
              <v-chip size="small" color="success" variant="outlined" prepend-icon="mdi-truck-fast">
                Envíos Seguros
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div class="d-flex flex-column flex-sm-row justify-space-between align-center ga-2 text-caption text-medium-emphasis">
          <span>&copy; {{ new Date().getFullYear() }} TechStore Inc. Todos los derechos reservados.</span>
          <span>Desarrollado con Vue 3 &amp; Vuetify</span>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.list-unstyled {
  list-style: none;
  padding-left: 0;
}
.list-unstyled a:hover {
  color: rgb(var(--v-theme-primary)) !important;
  text-decoration: underline !important;
}
</style>
