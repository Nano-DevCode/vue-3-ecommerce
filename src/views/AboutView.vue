<script setup lang="ts">
import { ref } from 'vue';
import NoEmailModal from '@/components/NoEmailModal.vue';

const showNoEmailModal = ref(false);
</script>

<template>
  <div style="max-width: 1000px; margin: 0 auto;" class="py-2">
    <!-- Header Banner -->
    <v-card
      class="rounded-2xl overflow-hidden mb-8 elevation-3 text-center pa-8 pa-md-12 text-white"
      style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);"
    >
      <v-avatar color="white" size="64" class="mb-4 elevation-2">
        <v-icon icon="mdi-storefront" size="36" color="primary" />
      </v-avatar>
      <h1 class="text-h4 text-md-h3 font-weight-black mb-3">
        Acerca de TechStore
      </h1>
      <p class="text-body-1 opacity-90 mx-auto" style="max-width: 620px;">
        Somos líderes en tecnología y equipamiento de espacios de trabajo y gaming. Nuestro compromiso es acercarte lo mejor en innovación con una experiencia de compra fluida, segura y transparente.
      </p>
    </v-card>

    <!-- Value Cards -->
    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-2xl border h-100 text-center hover-card-elevated" elevation="1">
          <v-avatar color="primary" variant="tonal" size="56" class="mb-4">
            <v-icon icon="mdi-shield-check-outline" size="28" color="primary" />
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Garantía de Calidad</h3>
          <p class="text-body-2 text-medium-emphasis">
            Todos nuestros productos cuentan con garantía directa de 1 año y son 100% originales de las mejores marcas.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-2xl border h-100 text-center hover-card-elevated" elevation="1">
          <v-avatar color="secondary" variant="tonal" size="56" class="mb-4">
            <v-icon icon="mdi-truck-fast-outline" size="28" color="secondary" />
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Envíos a Todo el País</h3>
          <p class="text-body-2 text-medium-emphasis">
            Empaquetado especializado con protección de impacto y entrega rápida a cualquier código postal.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-2xl border h-100 text-center hover-card-elevated" elevation="1">
          <v-avatar color="info" variant="tonal" size="56" class="mb-4">
            <v-icon icon="mdi-headset" size="28" color="info" />
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Soporte Especializado</h3>
          <p class="text-body-2 text-medium-emphasis">
            Asesoría personalizada por profesionales para resolver dudas de compatibilidad y especificaciones técnicas.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contact & FAQ Section -->
    <v-card class="rounded-2xl border pa-6 pa-md-8 elevation-1 mb-6">
      <v-row align="center">
        <v-col cols="12" md="7">
          <div class="d-flex align-center ga-2 mb-2">
            <v-icon icon="mdi-help-circle-outline" color="primary" size="24" />
            <h2 class="text-h6 font-weight-bold">¿Tienes alguna pregunta o requieres una cotización?</h2>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Estamos disponibles para asesorarte en la selección de tu equipo perfecto o pedidos por volumen.
          </p>
          <div class="d-flex flex-column ga-2 text-body-2 text-medium-emphasis">
            <div
              class="d-flex align-center ga-2 cursor-pointer"
              @click="showNoEmailModal = true"
              title="Información de contacto"
            >
              <v-icon icon="mdi-email-outline" size="18" color="primary" />
              <span class="text-decoration-underline text-primary font-weight-medium">contacto@techstore.demo</span>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-clock-outline" size="18" color="primary" />
              <span>Lunes a Sábado: 9:00 AM - 7:00 PM</span>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-map-marker-outline" size="18" color="primary" />
              <span>Ciudad de México, México (Envíos a toda la República)</span>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="5" class="text-center text-md-right">
          <v-btn
            color="primary"
            size="large"
            rounded="lg"
            prepend-icon="mdi-email-send-outline"
            class="font-weight-bold text-none elevation-2"
            @click="showNoEmailModal = true"
          >
            Enviar Correo
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Modal Informativo de Correo -->
    <NoEmailModal v-model="showNoEmailModal" />
  </div>
</template>
