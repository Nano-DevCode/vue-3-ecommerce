<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import NoEmailModal from '@/components/NoEmailModal.vue';

defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const cartStore = useCartStore();
const router = useRouter();

const showNoEmailModal = ref(false);
const currentStep = ref(1);
const isProcessing = ref(false);
const orderNumber = ref('');

// Form fields
const customer = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: ''
});

const paymentMethod = ref<'card' | 'spei' | 'oxxo'>('card');

// Card fields
const card = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: ''
});

// Validation rules
const rules = {
  required: (v: string) => !!v?.trim() || 'Este campo es obligatorio',
  name: (v: string) => {
    if (!v?.trim()) return 'Este campo es obligatorio';
    if (v.trim().length < 3) return 'Mínimo 3 caracteres';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v)) return 'Solo se permiten letras';
    return true;
  },
  email: (v: string) => {
    if (!v?.trim()) return 'El correo es obligatorio';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(v) || 'Ingresa un correo electrónico válido';
  },
  phone: (v: string) => {
    if (!v?.trim()) return 'El teléfono es obligatorio';
    const clean = v.replace(/\D/g, '');
    return clean.length === 10 || 'Debe contener exactamente 10 dígitos';
  },
  address: (v: string) => {
    if (!v?.trim()) return 'La dirección es obligatoria';
    return v.trim().length >= 5 || 'Ingresa una dirección completa';
  },
  city: (v: string) => {
    if (!v?.trim()) return 'La ciudad es obligatoria';
    return v.trim().length >= 3 || 'Ingresa una ciudad válida';
  },
  postalCode: (v: string) => {
    if (!v?.trim()) return 'El código postal es obligatorio';
    return /^[0-9]{5}$/.test(v.trim()) || '5 dígitos requeridos';
  },
  cardNumber: (v: string) => {
    if (!v?.trim()) return 'Número requerido';
    const clean = v.replace(/\s/g, '');
    return clean.length === 16 || '16 dígitos requeridos';
  },
  cardExpiry: (v: string) => {
    if (!v?.trim()) return 'Vencimiento requerido';
    return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(v) || 'Formato MM/AA';
  },
  cardCvv: (v: string) => {
    if (!v?.trim()) return 'CVV requerido';
    return /^[0-9]{3,4}$/.test(v) || '3 o 4 dígitos';
  }
};

const isStep1Valid = computed(() => {
  return (
    rules.name(customer.value.fullName) === true &&
    rules.email(customer.value.email) === true &&
    rules.phone(customer.value.phone) === true &&
    rules.address(customer.value.address) === true &&
    rules.city(customer.value.city) === true &&
    rules.postalCode(customer.value.postalCode) === true
  );
});

const isStep2Valid = computed(() => {
  if (paymentMethod.value === 'spei' || paymentMethod.value === 'oxxo') return true;
  return (
    rules.cardNumber(card.value.number) === true &&
    rules.name(card.value.name) === true &&
    rules.cardExpiry(card.value.expiry) === true &&
    rules.cardCvv(card.value.cvv) === true
  );
});

function onCardNumberInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '').substring(0, 16);
  card.value.number = digits.match(/.{1,4}/g)?.join(' ') || digits;
}

function onCardExpiryInput(e: Event) {
  const input = e.target as HTMLInputElement;
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 3) {
    val = `${val.substring(0, 2)}/${val.substring(2)}`;
  }
  card.value.expiry = val;
}

function close() {
  emit('update:modelValue', false);
  if (currentStep.value === 3) {
    currentStep.value = 1;
  }
}

function nextStep() {
  if (currentStep.value === 1 && isStep1Valid.value) {
    currentStep.value = 2;
  }
}

function processPayment() {
  if (!isStep2Valid.value) return;

  isProcessing.value = true;
  setTimeout(() => {
    isProcessing.value = false;
    orderNumber.value = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    currentStep.value = 3;
    cartStore.clearCart();
  }, 1400);
}

function copyClabe() {
  navigator.clipboard.writeText('646180123456789012');
  cartStore.notify('CLABE copiada al portapapeles', 'info');
}

function finishOrder() {
  close();
  router.push({ name: 'home' });
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="640"
    persistent
  >
    <v-card class="rounded-xl overflow-hidden" elevation="10">
      <!-- Header -->
      <div class="pa-4 pa-md-5 d-flex align-center justify-space-between border-b bg-surface">
        <div class="d-flex align-center ga-2">
          <v-avatar color="primary" size="32">
            <v-icon icon="mdi-shield-check" color="white" size="18" />
          </v-avatar>
          <span class="text-subtitle-1 font-weight-bold">
            {{ currentStep === 3 ? '¡Pedido Confirmado!' : 'Checkout Seguro (Simulador)' }}
          </span>
        </div>

        <v-btn
          v-if="currentStep !== 3"
          icon="mdi-close"
          variant="text"
          size="small"
          density="comfortable"
          @click="close"
        />
      </div>

      <!-- Step Indicator -->
      <div v-if="currentStep < 3" class="px-6 pt-4 pb-2 bg-surface-variant">
        <v-row no-gutters align="center">
          <v-col cols="6" class="d-flex align-center ga-2">
            <v-avatar size="24" :color="currentStep >= 1 ? 'primary' : 'grey-darken-1'" class="text-caption font-weight-bold text-white">
              1
            </v-avatar>
            <span class="text-caption font-weight-bold" :class="currentStep === 1 ? 'text-primary' : 'text-medium-emphasis'">
              Datos de Envío
            </span>
          </v-col>
          <v-col cols="6" class="d-flex align-center justify-end ga-2">
            <v-avatar size="24" :color="currentStep === 2 ? 'primary' : 'grey-darken-1'" class="text-caption font-weight-bold text-white">
              2
            </v-avatar>
            <span class="text-caption font-weight-bold" :class="currentStep === 2 ? 'text-primary' : 'text-medium-emphasis'">
              Pago &amp; Confirmación
            </span>
          </v-col>
        </v-row>
      </div>

      <v-card-text class="pa-6">
        <!-- STEP 1: Shipping Details -->
        <div v-if="currentStep === 1">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">Dirección de Entrega</h3>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="customer.fullName"
                label="Nombre y Apellidos *"
                placeholder="Ej. Juan Pérez González"
                :rules="[rules.name]"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-account-outline"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="customer.email"
                label="Correo Electrónico *"
                type="email"
                placeholder="juan@ejemplo.com"
                :rules="[rules.email]"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-email-outline"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="customer.phone"
                label="Teléfono Móvil (10 dígitos) *"
                placeholder="5512345678"
                :rules="[rules.phone]"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-phone-outline"
                maxlength="10"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="customer.address"
                label="Calle, Número y Colonia *"
                placeholder="Av. Juárez 100, Col. Centro"
                :rules="[rules.address]"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-map-marker-outline"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="customer.city"
                label="Ciudad *"
                placeholder="Ciudad de México"
                :rules="[rules.city]"
                variant="outlined"
                density="comfortable"
                rounded="lg"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="customer.postalCode"
                label="Código Postal (5 dígitos) *"
                placeholder="06000"
                :rules="[rules.postalCode]"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                maxlength="5"
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-end mt-4">
            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              size="large"
              :disabled="!isStep1Valid"
              append-icon="mdi-arrow-right"
              class="text-none font-weight-bold"
              @click="nextStep"
            >
              Continuar al Pago
            </v-btn>
          </div>
        </div>

        <!-- STEP 2: Payment Method -->
        <div v-else-if="currentStep === 2">
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 class="text-subtitle-1 font-weight-bold">Método de Pago</h3>
            <span class="text-body-2 font-weight-bold text-primary">
              Total: ${{ cartStore.totalAmount }} MXN
            </span>
          </div>

          <!-- Payment Options Toggle -->
          <v-btn-toggle
            v-model="paymentMethod"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100 mb-5 d-flex"
            rounded="lg"
          >
            <v-btn value="card" class="flex-grow-1 text-none" prepend-icon="mdi-credit-card-outline">
              Tarjeta
            </v-btn>
            <v-btn value="spei" class="flex-grow-1 text-none" prepend-icon="mdi-bank-transfer">
              SPEI
            </v-btn>
            <v-btn value="oxxo" class="flex-grow-1 text-none" prepend-icon="mdi-storefront-outline">
              OXXO
            </v-btn>
          </v-btn-toggle>

          <!-- Card Form -->
          <div v-if="paymentMethod === 'card'" class="pa-4 rounded-xl border bg-surface-variant mb-4">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon icon="mdi-credit-card" color="primary" />
              <span class="text-caption font-weight-bold text-uppercase">Tarjeta de Crédito o Débito</span>
            </div>

            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="card.number"
                  label="Número de Tarjeta (16 dígitos) *"
                  placeholder="4532 8912 3456 7890"
                  :rules="[rules.cardNumber]"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  prepend-inner-icon="mdi-credit-card-chip"
                  maxlength="19"
                  @input="onCardNumberInput"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="card.name"
                  label="Nombre en la Tarjeta *"
                  placeholder="JUAN PEREZ GONZALEZ"
                  :rules="[rules.name]"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="text-uppercase"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="card.expiry"
                  label="Expira (MM/AA) *"
                  placeholder="12/28"
                  :rules="[rules.cardExpiry]"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  maxlength="5"
                  @input="onCardExpiryInput"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="card.cvv"
                  label="CVV *"
                  placeholder="123"
                  type="password"
                  maxlength="4"
                  :rules="[rules.cardCvv]"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
            </v-row>
          </div>

          <!-- SPEI Details -->
          <div v-else-if="paymentMethod === 'spei'" class="pa-4 rounded-xl border bg-surface-variant mb-4">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon icon="mdi-bank" color="primary" />
              <span class="text-caption font-weight-bold text-uppercase">Datos de Transferencia Bancaria (SPEI)</span>
            </div>
            <div class="text-body-2 mb-1"><strong>Banco:</strong> BBVA México</div>
            <div class="text-body-2 mb-2"><strong>Beneficiario:</strong> TechStore S.A. de C.V.</div>
            <div class="d-flex align-center justify-space-between pa-2 rounded-lg border bg-surface mb-2">
              <div>
                <span class="text-caption text-medium-emphasis d-block">CLABE:</span>
                <span class="font-weight-black text-body-1">646180123456789012</span>
              </div>
              <v-btn variant="tonal" size="small" color="primary" prepend-icon="mdi-content-copy" @click="copyClabe">
                Copiar
              </v-btn>
            </div>
          </div>

          <!-- OXXO Details -->
          <div v-else class="pa-4 rounded-xl border bg-surface-variant mb-4 text-center">
            <v-icon icon="mdi-barcode-scan" color="primary" size="36" class="mb-1" />
            <div class="text-body-2 mb-1"><strong>Referencia OXXO:</strong></div>
            <div class="text-h6 font-weight-black text-primary mb-2">9384 1029 3847 12</div>
          </div>

          <div class="d-flex justify-space-between align-center mt-5">
            <v-btn variant="text" prepend-icon="mdi-arrow-left" class="text-none" @click="currentStep = 1">
              Volver
            </v-btn>

            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              size="large"
              :loading="isProcessing"
              :disabled="!isStep2Valid"
              append-icon="mdi-lock-check"
              class="text-none font-weight-bold"
              @click="processPayment"
            >
              Pagar ${{ cartStore.totalAmount }} MXN
            </v-btn>
          </div>
        </div>

        <!-- STEP 3: Order Success Screen -->
        <div v-else-if="currentStep === 3" class="text-center py-6">
          <v-avatar color="success" size="84" class="mb-4 elevation-4">
            <v-icon icon="mdi-check-bold" size="44" color="white" />
          </v-avatar>

          <h3 class="text-h5 font-weight-black text-success mb-1">
            ¡Pago Aprobado y Pedido Registrado!
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Tu orden ha sido procesada con éxito en el simulador de comercio electrónico.
          </p>

          <v-card class="pa-4 mb-6 rounded-xl border bg-surface-variant text-left" variant="flat">
            <div class="d-flex justify-space-between align-center pb-2 border-b mb-2">
              <span class="text-caption text-medium-emphasis">Número de Orden:</span>
              <span class="font-weight-black text-primary">{{ orderNumber }}</span>
            </div>
            <div class="d-flex justify-space-between align-center pb-2 border-b mb-2">
              <span class="text-caption text-medium-emphasis">Destinatario:</span>
              <span class="font-weight-medium text-body-2">{{ customer.fullName }}</span>
            </div>
            <div class="d-flex justify-space-between align-center pb-2 border-b mb-2">
              <span class="text-caption text-medium-emphasis">Dirección de Envío:</span>
              <span class="font-weight-medium text-body-2 text-right">{{ customer.address }}, {{ customer.city }}</span>
            </div>
            <div class="d-flex justify-space-between align-center">
              <span class="text-caption text-medium-emphasis">Estado del Envío:</span>
              <v-chip size="x-small" color="primary" variant="flat">Preparando Paquete</v-chip>
            </div>
          </v-card>

          <div class="d-flex flex-column flex-sm-row ga-2">
            <v-btn
              variant="tonal"
              color="secondary"
              rounded="lg"
              size="large"
              prepend-icon="mdi-email-send-outline"
              class="text-none font-weight-bold flex-grow-1"
              @click="showNoEmailModal = true"
            >
              Enviar por Correo
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              size="large"
              class="text-none font-weight-bold flex-grow-1"
              @click="finishOrder"
            >
              Volver a la Tienda
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Modal Informativo de Correo -->
    <NoEmailModal v-model="showNoEmailModal" />
  </v-dialog>
</template>
