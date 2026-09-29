<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const props = withDefaults(defineProps<{
  modelValue?: boolean
}>(), {
  modelValue: undefined
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const cartStore = useCartStore();
const router = useRouter();

const isOpen = computed({
  get: () => {
    if (props.modelValue !== undefined) {
      return props.modelValue;
    }
    return cartStore.noEmailModalOpen;
  },
  set: (val: boolean) => {
    emit('update:modelValue', val);
    cartStore.noEmailModalOpen = val;
  }
});

function handleClose() {
  isOpen.value = false;
  emit('update:modelValue', false);
  cartStore.closeNoEmailModal();
}

function handleGoToCatalog() {
  handleClose();
  router.push('/products');
}
</script>

<template>
  <v-dialog
    :model-value="isOpen"
    @update:model-value="val => { if (!val) handleClose(); else isOpen = true; }"
    max-width="500"
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-2xl overflow-hidden pa-2" elevation="10">
      <div class="pa-6 text-center">
        <!-- Warning / Info Icon -->
        <v-avatar color="warning" variant="tonal" size="72" class="mb-4">
          <v-icon icon="mdi-email-alert-outline" size="38" color="warning" />
        </v-avatar>

        <!-- Title requested by user -->
        <h2 class="text-h5 font-weight-black mb-2 text-high-emphasis">
          No hay un correo para mandar
        </h2>

        <!-- Subtitle -->
        <p class="text-body-2 text-medium-emphasis mb-4">
          Actualmente no hay una casilla ni un servidor de correo electrónico asociado o configurado para enviar o recibir mensajes en esta aplicación.
        </p>

        <!-- Info Box -->
        <v-card
          class="pa-4 rounded-xl border text-left mb-6"
          variant="flat"
          style="background: rgba(var(--v-theme-warning), 0.08); border-color: rgba(var(--v-theme-warning), 0.3) !important;"
        >
          <div class="d-flex align-start ga-3">
            <v-icon icon="mdi-shield-lock-outline" color="warning" size="22" class="mt-1" />
            <div class="text-caption text-medium-emphasis">
              <strong class="text-high-emphasis d-block mb-1">Entorno de Demostración Seguro</strong>
              Este proyecto es una plataforma interactiva de portafolio técnico. Para proteger la privacidad y evitar exponer datos personales, todas las operaciones se simulan localmente en tu navegador sin enviar correos a servicios externos.
            </div>
          </div>
        </v-card>

        <!-- Actions -->
        <div class="d-flex flex-column flex-sm-row justify-center ga-3">
          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            size="large"
            class="text-none font-weight-bold px-6 flex-grow-1"
            @click="handleClose"
          >
            Entendido
          </v-btn>
          <v-btn
            variant="tonal"
            color="primary"
            rounded="lg"
            size="large"
            prepend-icon="mdi-shopping-outline"
            class="text-none font-weight-medium px-4"
            @click="handleGoToCatalog"
          >
            Ver Productos
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
