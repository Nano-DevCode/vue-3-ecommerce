<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const techStack = [
  { name: 'Vue 3', version: 'v3.5', icon: 'mdi-vuejs', color: '#42b883', desc: 'Composition API, SFC, script setup y reactividad moderna' },
  { name: 'TypeScript', version: 'v5.8', icon: 'mdi-language-typescript', color: '#3178c6', desc: 'Tipado estricto en modelos, props y stores' },
  { name: 'Pinia', version: 'v3.0', icon: 'mdi-fruit-pineapple', color: '#ffd04b', desc: 'Manejo de estado global reactivo con persistencia LocalStorage' },
  { name: 'Vuetify 3', version: 'v3.13', icon: 'mdi-vuetify', color: '#2196f3', desc: 'Diseño UI con Material Design 3 y temas Dark/Light' },
  { name: 'Vite', version: 'v7.3', icon: 'mdi-lightning-bolt', color: '#646cff', desc: 'Empaquetado ultrarrápido y optimización de assets' },
  { name: 'Vue Router 4', version: 'v4.6', icon: 'mdi-routes', color: '#e02424', desc: 'Enrutamiento dinámico, lazy loading y parámetros de ruta' }
];

const keyFeatures = [
  'Filtrado reactivo en tiempo real (categorías, texto, rango de precio y ofertas)',
  'Persistencia de carrito y lista de deseos (Wishlist) en LocalStorage con VueUse',
  'Modal de vista rápida de producto con especificaciones y zoom de imagen',
  'Simulador de pasarela de pago completa con formulario validado, tarjeta de crédito interactiva, SPEI y OXXO Pay',
  'Motor interactivo de cupones de descuento (ej. "PORTAFOLIO20")',
  'Soporte responsivo fluido en dispositivos móviles y de escritorio',
  'Conmutador de tema claro y oscuro en tiempo real'
];
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="720"
    scrollable
  >
    <v-card class="rounded-xl overflow-hidden" elevation="10">
      <!-- Modal Header -->
      <div class="pa-5 border-b bg-surface d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-3">
          <v-avatar color="primary" size="36" class="elevation-2">
            <v-icon icon="mdi-code-braces" color="white" size="20" />
          </v-avatar>
          <div>
            <h3 class="text-subtitle-1 font-weight-bold">Stack Tecnológico &amp; Arquitectura</h3>
            <span class="text-caption text-medium-emphasis">Información del Proyecto para Portafolio</span>
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          density="comfortable"
          @click="emit('update:modelValue', false)"
        />
      </div>

      <v-card-text class="pa-6">
        <!-- Overview Paragraph -->
        <p class="text-body-2 text-medium-emphasis mb-5">
          Esta aplicación es una plataforma de comercio electrónico de alto rendimiento desarrollada con las mejores prácticas del ecosistema moderno de Vue.js. Demuestra dominio en gestión de estado, diseño de componentes modulares, tipado estricto y microinteracciones de usuario.
        </p>

        <!-- Tech Stack Grid -->
        <h4 class="text-subtitle-2 font-weight-bold text-uppercase text-primary mb-3">
          Tecnologías Principales
        </h4>
        <v-row dense class="mb-5">
          <v-col v-for="tech in techStack" :key="tech.name" cols="12" sm="6">
            <v-card class="pa-3 rounded-lg border bg-surface-variant h-100" variant="flat">
              <div class="d-flex align-center mb-1">
                <v-icon :icon="tech.icon" :color="tech.color" class="mr-2" size="22" />
                <span class="font-weight-bold text-body-2">{{ tech.name }}</span>
                <v-chip size="x-small" variant="tonal" class="ml-auto font-weight-bold">
                  {{ tech.version }}
                </v-chip>
              </div>
              <p class="text-caption text-medium-emphasis mb-0">
                {{ tech.desc }}
              </p>
            </v-card>
          </v-col>
        </v-row>

        <!-- Highlights List -->
        <h4 class="text-subtitle-2 font-weight-bold text-uppercase text-primary mb-3">
          Funcionalidades Destacadas
        </h4>
        <ul class="text-body-2 text-medium-emphasis pl-0 mb-6" style="list-style: none;">
          <li v-for="(feat, i) in keyFeatures" :key="i" class="d-flex align-center mb-2">
            <v-icon icon="mdi-check-decagram" color="success" size="18" class="mr-2 flex-shrink-0" />
            <span>{{ feat }}</span>
          </li>
        </ul>

        <!-- GitHub / Contact Box -->
        <div class="pa-4 rounded-xl border bg-surface-variant d-flex flex-column flex-sm-row align-center justify-space-between ga-3">
          <div>
            <div class="font-weight-bold text-body-2">Código Fuente &amp; Repositorio</div>
            <div class="text-caption text-medium-emphasis">Disponible en GitHub para revisión técnica</div>
          </div>
          <v-btn
            href="https://github.com/Nano-DevCode/vue-3-ecommerce"
            target="_blank"
            color="primary"
            variant="flat"
            rounded="lg"
            prepend-icon="mdi-github"
            class="text-none font-weight-bold"
          >
            Ver en GitHub
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
