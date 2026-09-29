<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useProductsStore } from '@/stores/products';
import { useCategoriesStore } from '@/stores/categories';
import ProductCard from '@/components/ProductCard.vue';
import ProductDetailModal from '@/components/ProductDetailModal.vue';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

onMounted(() => {
  productsStore.fetchProducts();
  categoriesStore.fetchCategories();
});

const featuredProducts = computed(() => {
  return productsStore._products.slice(0, 4);
});

const testimonials = [
  {
    name: 'Carlos Ruiz',
    role: 'Desarrollador Full Stack',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    comment: 'Compré el monitor UltraWide y los audífonos. Llegaron en 48 horas en perfecto estado. El proceso de compra y el soporte en línea fueron inmediatos y muy profesionales.',
    rating: 5
  },
  {
    name: 'Mariana Valenzuela',
    role: 'Diseñadora UI/UX',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    comment: 'La silla ergonómica Pro cambió por completo mi postura de trabajo. Los acabados son de primera y el armado fue facilísimo.',
    rating: 5
  },
  {
    name: 'David Lara',
    role: 'Streamer & Creador de Contenido',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    comment: 'Excelente catálogo tecnológico. El micrófono de estudio superó mis expectativas de claridad sonora. 100% recomendado.',
    rating: 5
  }
];

const stats = [
  { number: '+1,800', label: 'Clientes Satisfechos', icon: 'mdi-account-group-outline' },
  { number: '4.9 ★', label: 'Calificación Promedio', icon: 'mdi-star-face' },
  { number: '24-48h', label: 'Tiempo de Entrega', icon: 'mdi-truck-fast-outline' },
  { number: '100%', label: 'Garantía en Productos', icon: 'mdi-shield-check-outline' }
];

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('oficina')) return 'mdi-desk';
  if (lower.includes('computadora')) return 'mdi-laptop';
  return 'mdi-devices';
}
</script>

<template>
  <div class="home-wrapper">
    <!-- SECTION 1: Hero Banner -->
    <v-card
      class="mb-14 overflow-hidden rounded-2xl hero-card elevation-4"
      color="primary"
      variant="flat"
    >
      <div class="hero-overlay pa-8 pa-md-14">
        <v-row align="center">
          <v-col cols="12" md="8">
            <v-chip
              color="white"
              variant="flat"
              size="small"
              class="mb-4 font-weight-bold text-primary"
              prepend-icon="mdi-fire"
            >
              Novedades y Mejores Precios 2026
            </v-chip>
            <h1 class="text-h4 text-md-h2 font-weight-black text-white mb-4 line-height-tight">
              Tecnología &amp; Setup de Alto Rendimiento
            </h1>
            <p class="text-body-1 text-white opacity-90 mb-8" style="max-width: 620px; font-size: 1.1rem !important;">
              Encuentra los mejores periféricos gamer, monitores y mobiliario ergonómico para trabajar y jugar al máximo nivel con envío garantizado a todo el país.
            </p>

            <div class="d-flex flex-wrap ga-3 mb-6">
              <v-btn
                to="/products"
                color="white"
                variant="flat"
                size="x-large"
                rounded="lg"
                prepend-icon="mdi-shopping-outline"
                class="font-weight-black text-primary text-none"
              >
                Explorar Catálogo
              </v-btn>
              <v-btn
                to="/about"
                color="white"
                variant="outlined"
                size="x-large"
                rounded="lg"
                class="font-weight-bold text-white text-none"
              >
                Conocer Más
              </v-btn>
            </div>

            <div class="d-flex flex-wrap ga-3">
              <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-truck-fast">
                Envíos a todo México
              </v-chip>
              <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-shield-check">
                Garantía 1 año
              </v-chip>
              <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-headset">
                Atención personalizada
              </v-chip>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="d-none d-md-flex justify-center">
            <v-icon icon="mdi-devices" size="200" color="white" class="hero-icon-glow" />
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- SECTION 2: Explore by Categories -->
    <section class="mb-16">
      <div class="d-flex flex-wrap justify-space-between align-end mb-6">
        <div>
          <v-chip color="primary" variant="tonal" size="small" class="mb-2 font-weight-bold">
            Departamentos
          </v-chip>
          <h2 class="text-h4 font-weight-bold">Explora por Categoría</h2>
          <p class="text-body-2 text-medium-emphasis">Selecciona una categoría para filtrar tu búsqueda</p>
        </div>
        <v-btn to="/products" variant="text" color="primary" append-icon="mdi-arrow-right">
          Ver Todas
        </v-btn>
      </div>

      <v-row>
        <v-col
          v-for="cat in categoriesStore.categories"
          :key="cat.id"
          cols="12"
          sm="6"
        >
          <v-card
            :to="`/categories/${cat.id}`"
            class="pa-6 rounded-2xl border hover-card-elevated d-flex align-center justify-space-between cursor-pointer"
            elevation="1"
          >
            <div class="d-flex align-center ga-4">
              <v-avatar color="primary" variant="tonal" size="64" class="rounded-xl">
                <v-icon :icon="getCategoryIcon(cat.name)" size="34" color="primary" />
              </v-avatar>
              <div>
                <h3 class="text-h6 font-weight-bold mb-1">{{ cat.name }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">{{ cat.description }}</p>
              </div>
            </div>
            <v-icon icon="mdi-chevron-right" color="primary" size="28" />
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- SECTION 3: Featured Products -->
    <section class="mb-16">
      <div class="d-flex flex-wrap justify-space-between align-end mb-8">
        <div>
          <v-chip color="secondary" variant="tonal" size="small" class="mb-2 font-weight-bold">
            Lo Más Destacado
          </v-chip>
          <h2 class="text-h4 font-weight-bold">Productos Populares</h2>
          <p class="text-body-2 text-medium-emphasis">Los periféricos y mobiliario preferidos por nuestros clientes</p>
        </div>
        <v-btn
          to="/products"
          color="primary"
          variant="flat"
          rounded="lg"
          size="large"
          append-icon="mdi-arrow-right"
          class="font-weight-bold text-none mt-2 mt-sm-0"
        >
          Ir al Catálogo Completo
        </v-btn>
      </div>

      <v-row>
        <v-col
          v-for="p in featuredProducts"
          :key="p.id"
          cols="12"
          sm="6"
          lg="3"
        >
          <ProductCard :product="p" />
        </v-col>
      </v-row>
    </section>

    <!-- SECTION 4: Trust Metrics -->
    <section class="mb-16 pa-8 pa-md-12 rounded-2xl border bg-surface-variant">
      <v-row>
        <v-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
          <div class="text-center">
            <v-avatar color="primary" variant="tonal" size="52" class="mb-3">
              <v-icon :icon="stat.icon" color="primary" size="26" />
            </v-avatar>
            <div class="text-h4 font-weight-black text-primary mb-1">{{ stat.number }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ stat.label }}</div>
          </div>
        </v-col>
      </v-row>
    </section>

    <!-- SECTION 5: Customer Reviews / Testimonials -->
    <section class="mb-16">
      <div class="text-center mb-10">
        <v-chip color="primary" variant="tonal" size="small" class="mb-2 font-weight-bold">
          Experiencias de Compra
        </v-chip>
        <h2 class="text-h4 font-weight-bold">Lo que Dicen Nuestros Clientes</h2>
        <p class="text-body-2 text-medium-emphasis">Opiniones reales de usuarios en todo el país</p>
      </div>

      <v-row>
        <v-col v-for="(review, idx) in testimonials" :key="idx" cols="12" md="4">
          <v-card class="pa-6 rounded-2xl border h-100 d-flex flex-column hover-card-elevated" elevation="1">
            <div class="d-flex align-center ga-1 mb-4">
              <v-icon v-for="s in review.rating" :key="s" icon="mdi-star" color="amber-darken-1" size="18" />
            </div>
            <p class="text-body-1 text-medium-emphasis mb-6 flex-grow-1 font-italic">
              "{{ review.comment }}"
            </p>
            <div class="d-flex align-center ga-3 pt-4 border-t">
              <v-avatar size="44">
                <v-img :src="review.avatar" />
              </v-avatar>
              <div>
                <div class="font-weight-bold text-body-1">{{ review.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ review.role }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- SECTION 6: Call To Action Banner -->
    <v-card
      class="rounded-2xl pa-8 pa-md-12 text-center border overflow-hidden position-relative mb-6"
      style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%);"
    >
      <v-avatar color="primary" size="64" class="mb-4">
        <v-icon icon="mdi-rocket-launch" color="white" size="32" />
      </v-avatar>
      <h2 class="text-h4 font-weight-black mb-3">¿Listo para Llevar tu Espacio al Siguiente Nivel?</h2>
      <p class="text-body-1 text-medium-emphasis mb-6 mx-auto" style="max-width: 580px;">
        Descubre nuestros productos con entrega rápida garantizada, múltiples formas de pago y asesoría personalizada.
      </p>
      <v-btn
        to="/products"
        color="primary"
        variant="flat"
        size="x-large"
        rounded="lg"
        prepend-icon="mdi-shopping-outline"
        class="font-weight-bold text-none px-8"
      >
        Ver Catálogo Completo
      </v-btn>
    </v-card>

    <!-- Quick View Product Detail Modal -->
    <ProductDetailModal />
  </div>
</template>

<style scoped>
.hero-card {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%) !important;
  position: relative;
}

.hero-overlay {
  position: relative;
  z-index: 1;
}

.line-height-tight {
  line-height: 1.15;
}

.hero-icon-glow {
  opacity: 0.25;
  filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.5));
  transform: rotate(-10deg);
  transition: transform 0.4s ease;
}

.hero-card:hover .hero-icon-glow {
  transform: rotate(0deg) scale(1.05);
  opacity: 0.35;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
