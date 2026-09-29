<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import NoEmailModal from '@/components/NoEmailModal.vue';

interface OrderSnapshot {
  orderNumber: string;
  orderDate: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  paymentMethod: 'card' | 'spei' | 'oxxo';
  cardLastDigits: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  discountAmount: number;
  couponCode: string;
  total: number;
}

const cartStore = useCartStore();
const router = useRouter();

const currentStep = ref(1);
const isProcessing = ref(false);
const orderNumber = ref('');
const orderDate = ref('');
const showNoEmailModal = ref(false);
const orderSnapshot = ref<OrderSnapshot | null>(null);

// Step 1: Form fields
const customer = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: ''
});

// Step 2: Payment method
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
    return v.trim().length >= 5 || 'Ingresa una dirección completa (calle y número)';
  },
  city: (v: string) => {
    if (!v?.trim()) return 'La ciudad es obligatoria';
    return v.trim().length >= 3 || 'Ingresa una ciudad válida';
  },
  postalCode: (v: string) => {
    if (!v?.trim()) return 'El código postal es obligatorio';
    return /^[0-9]{5}$/.test(v.trim()) || 'Debe ser un código postal de 5 dígitos';
  },
  cardNumber: (v: string) => {
    if (!v?.trim()) return 'El número de tarjeta es obligatorio';
    const clean = v.replace(/\s/g, '');
    return clean.length === 16 || 'La tarjeta debe tener 16 dígitos';
  },
  cardExpiry: (v: string) => {
    if (!v?.trim()) return 'Fecha requerida';
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(v)) return 'Formato MM/AA';
    const [month, yearStr] = v.split('/');
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(`20${yearStr}`, 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'Tarjeta vencida';
    }
    return true;
  },
  cardCvv: (v: string) => {
    if (!v?.trim()) return 'CVV requerido';
    return /^[0-9]{3,4}$/.test(v) || '3 o 4 dígitos';
  }
};

// Form validity checks
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
  if (paymentMethod.value === 'spei' || paymentMethod.value === 'oxxo') {
    return true;
  }
  return (
    rules.cardNumber(card.value.number) === true &&
    rules.name(card.value.name) === true &&
    rules.cardExpiry(card.value.expiry) === true &&
    rules.cardCvv(card.value.cvv) === true
  );
});

// Card inputs formatters
function onCardNumberInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '').substring(0, 16);
  const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
  card.value.number = formatted;
}

function onCardExpiryInput(e: Event) {
  const input = e.target as HTMLInputElement;
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 3) {
    val = `${val.substring(0, 2)}/${val.substring(2)}`;
  }
  card.value.expiry = val;
}

function onPhoneInput(e: Event) {
  const input = e.target as HTMLInputElement;
  customer.value.phone = input.value.replace(/\D/g, '').substring(0, 10);
}

function onPostalCodeInput(e: Event) {
  const input = e.target as HTMLInputElement;
  customer.value.postalCode = input.value.replace(/\D/g, '').substring(0, 5);
}

// Navigation between steps
function nextStep() {
  if (isStep1Valid.value) {
    currentStep.value = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function processPayment() {
  if (!isStep2Valid.value) return;

  isProcessing.value = true;
  setTimeout(() => {
    isProcessing.value = false;
    const num = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const snapshot: OrderSnapshot = {
      orderNumber: num,
      orderDate: dateFormatted,
      customer: { ...customer.value },
      paymentMethod: paymentMethod.value,
      cardLastDigits: card.value.number.replace(/\s/g, '').slice(-4) || '4242',
      items: cartStore.details.map(d => ({
        id: d.product.id,
        name: d.product.name,
        price: d.product.price,
        quantity: d.quantity,
        subtotal: d.product.price * d.quantity
      })),
      subtotal: cartStore.rawSubtotal,
      discountAmount: cartStore.discountAmount,
      couponCode: cartStore.couponCode || 'Sin cupón',
      total: cartStore.totalAmount
    };

    orderSnapshot.value = snapshot;
    orderNumber.value = num;
    orderDate.value = dateFormatted;
    currentStep.value = 3;
    cartStore.clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1600);
}

function copyClabe() {
  navigator.clipboard.writeText('646180123456789012');
  cartStore.notify('CLABE interbancaria copiada al portapapeles', 'info');
}

function copyOxxoRef() {
  navigator.clipboard.writeText('9384 1029 3847 12');
  cartStore.notify('Referencia OXXO copiada al portapapeles', 'info');
}

function printReceipt() {
  window.print();
}

function finishOrder() {
  router.push({ name: 'home' });
}
</script>

<template>
  <div class="py-2" style="max-width: 1040px; margin: 0 auto;">
    <!-- Breadcrumb -->
    <v-breadcrumbs class="pa-0 mb-4 text-body-2">
      <v-breadcrumbs-item to="/">Inicio</v-breadcrumbs-item>
      <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
      <v-breadcrumbs-item to="/cart">Carrito</v-breadcrumbs-item>
      <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
      <v-breadcrumbs-item disabled class="font-weight-medium text-high-emphasis">
        Finalizar Pedido
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-6">
      <h1 class="text-h4 font-weight-black">
        Pasarela de Pago Segura
      </h1>

      <!-- Step Badges -->
      <div v-if="currentStep < 3" class="d-flex align-center ga-3">
        <v-chip :color="currentStep === 1 ? 'primary' : 'surface-variant'" variant="flat" size="small" class="font-weight-bold">
          1. Envío
        </v-chip>
        <v-icon icon="mdi-chevron-right" size="18" color="medium-emphasis" />
        <v-chip :color="currentStep === 2 ? 'primary' : 'surface-variant'" variant="flat" size="small" class="font-weight-bold">
          2. Método de Pago
        </v-chip>
      </div>
    </div>

    <!-- STEP 3: Order Success & Printable Invoice -->
    <div v-if="currentStep === 3" class="mb-12">
      <!-- On-Screen Success Banner (hidden on print) -->
      <div class="text-center mb-8 no-print">
        <v-avatar color="success" size="84" class="mb-3 elevation-3">
          <v-icon icon="mdi-check-bold" size="44" color="white" />
        </v-avatar>
        <h2 class="text-h4 font-weight-black text-success mb-2">
          ¡Pago Aprobado y Pedido Confirmado!
        </h2>
        <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 580px;">
          Tu pago ha sido validado exitosamente por nuestro simulador. A continuación tienes tu <strong>comprobante oficial de compra</strong> listo para guardar o imprimir.
        </p>
      </div>

      <!-- Printable Invoice Container -->
      <div id="printable-receipt" class="printable-invoice pa-6 pa-md-10 rounded-2xl border bg-surface mx-auto" style="max-width: 760px;">
        <!-- Invoice Header -->
        <div class="d-flex justify-space-between align-start border-b pb-6 mb-6 flex-wrap ga-4">
          <div>
            <div class="d-flex align-center ga-2 mb-1">
              <v-avatar color="primary" size="36">
                <v-icon icon="mdi-storefront" color="white" size="20" />
              </v-avatar>
              <span class="text-h5 font-weight-black">Tech<span class="text-primary">Store</span></span>
            </div>
            <p class="text-caption text-medium-emphasis mb-0 font-weight-medium">E-Commerce & Equipamiento Tecnológico</p>
            <p class="text-caption text-medium-emphasis mb-0">RFC: TST-260928-VUE &bull; techstore.demo</p>
          </div>

          <div class="text-left text-sm-right">
            <span class="text-overline font-weight-bold text-medium-emphasis d-block">COMPROBANTE DE COMPRA</span>
            <div class="text-h5 font-weight-black text-primary">{{ orderSnapshot?.orderNumber }}</div>
            <span class="text-caption text-medium-emphasis">{{ orderSnapshot?.orderDate }}</span>
          </div>
        </div>

        <!-- 2 Columns: Shipping / Customer & Payment info -->
        <v-row class="border-b pb-6 mb-6">
          <v-col cols="12" sm="6">
            <div class="text-caption font-weight-black text-uppercase text-medium-emphasis mb-2">
              Datos del Destinatario
            </div>
            <div class="text-body-2 font-weight-bold text-high-emphasis">{{ orderSnapshot?.customer.fullName }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ orderSnapshot?.customer.address }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ orderSnapshot?.customer.city }}, C.P. {{ orderSnapshot?.customer.postalCode }}</div>
            <div class="text-body-2 text-medium-emphasis">Tel: {{ orderSnapshot?.customer.phone }}</div>
            <div class="text-body-2 text-medium-emphasis">Email: {{ orderSnapshot?.customer.email }}</div>
          </v-col>

          <v-col cols="12" sm="6" class="text-sm-right">
            <div class="text-caption font-weight-black text-uppercase text-medium-emphasis mb-2">
              Información de Pago
            </div>
            <div class="text-body-2 font-weight-bold text-high-emphasis mb-1">
              <span v-if="orderSnapshot?.paymentMethod === 'card'">
                Tarjeta de Crédito / Débito (•••• {{ orderSnapshot?.cardLastDigits }})
              </span>
              <span v-else-if="orderSnapshot?.paymentMethod === 'spei'">
                Transferencia SPEI (CLABE 646180123456789012)
              </span>
              <span v-else>
                Pago en Efectivo OXXO Pay
              </span>
            </div>
            <div class="mb-2">
              <v-chip color="success" size="small" variant="flat" class="font-weight-bold">
                ✓ PAGO APROBADO
              </v-chip>
            </div>
            <div class="text-caption text-medium-emphasis">
              Estado de Envío: <strong class="text-high-emphasis">Preparando Paquete</strong>
            </div>
          </v-col>
        </v-row>

        <!-- Purchased Items Table -->
        <div class="mb-6">
          <div class="text-caption font-weight-black text-uppercase text-medium-emphasis mb-3">
            Desglose de Artículos
          </div>
          <div class="table-responsive">
            <table class="w-100 receipt-table">
              <thead>
                <tr class="border-b text-caption text-medium-emphasis">
                  <th class="text-left py-2">Artículo</th>
                  <th class="text-center py-2">Cant.</th>
                  <th class="text-right py-2">Precio Unit.</th>
                  <th class="text-right py-2">Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in orderSnapshot?.items" :key="item.id" class="border-b text-body-2">
                  <td class="py-3 font-weight-medium text-high-emphasis">{{ item.name }}</td>
                  <td class="py-3 text-center text-medium-emphasis">{{ item.quantity }}</td>
                  <td class="py-3 text-right text-medium-emphasis">${{ item.price.toLocaleString('es-MX') }} MXN</td>
                  <td class="py-3 text-right font-weight-bold text-high-emphasis">${{ item.subtotal.toLocaleString('es-MX') }} MXN</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals Section -->
        <div class="d-flex justify-end mb-6">
          <div style="min-width: 270px;">
            <div class="d-flex justify-space-between text-body-2 py-1">
              <span class="text-medium-emphasis">Subtotal:</span>
              <span class="font-weight-medium text-high-emphasis">${{ orderSnapshot?.subtotal.toLocaleString('es-MX') }} MXN</span>
            </div>
            <div v-if="(orderSnapshot?.discountAmount || 0) > 0" class="d-flex justify-space-between text-body-2 py-1 text-success">
              <span>Descuento ({{ orderSnapshot?.couponCode }}):</span>
              <span class="font-weight-bold">-${{ orderSnapshot?.discountAmount.toLocaleString('es-MX') }} MXN</span>
            </div>
            <div class="d-flex justify-space-between text-body-2 py-1">
              <span class="text-medium-emphasis">Costo de Envío:</span>
              <span class="text-success font-weight-bold">GRATIS</span>
            </div>
            <v-divider class="my-2" />
            <div class="d-flex justify-space-between align-baseline py-1">
              <span class="text-subtitle-1 font-weight-bold text-high-emphasis">Total Pagado:</span>
              <span class="text-h5 font-weight-black text-primary">${{ orderSnapshot?.total.toLocaleString('es-MX') }} MXN</span>
            </div>
          </div>
        </div>

        <!-- Invoice Footer / Guarantee -->
        <div class="border-t pt-4 text-center text-caption text-medium-emphasis">
          <p class="mb-1">
            Garantía oficial de 1 año con <strong>TechStore</strong>. Conserve este comprobante para cualquier aclaración o seguimiento.
          </p>
          <p class="mb-0 text-disabled">
            Comprobante fiscal digital simulado generado por la plataforma de portafolio Vue 3.
          </p>
        </div>
      </div>

      <!-- Action Buttons Below Invoice (hidden when printing) -->
      <div class="d-flex justify-center flex-wrap ga-3 mt-8 no-print">
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          size="large"
          prepend-icon="mdi-printer"
          class="font-weight-bold text-none px-6 elevation-2"
          @click="printReceipt"
        >
          Imprimir Comprobante
        </v-btn>
        <v-btn
          variant="tonal"
          color="warning"
          rounded="lg"
          size="large"
          prepend-icon="mdi-email-alert-outline"
          class="font-weight-bold text-none px-6"
          @click="showNoEmailModal = true"
        >
          Enviar por Correo
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          rounded="lg"
          size="large"
          class="font-weight-bold text-none px-6"
          @click="finishOrder"
        >
          Volver a la Tienda
        </v-btn>
      </div>
    </div>

    <!-- STEPS 1 & 2: Form & Summary -->
    <v-row v-else>
      <!-- Left Column: Step Forms -->
      <v-col cols="12" md="7">
        <v-card rounded="2xl" elevation="1" class="border pa-6 pa-md-8">
          <!-- STEP 1: Shipping Information Form -->
          <div v-if="currentStep === 1">
            <div class="d-flex align-center ga-2 mb-4">
              <v-avatar color="primary" size="30" class="text-caption font-weight-bold text-white">1</v-avatar>
              <div>
                <h2 class="text-h6 font-weight-bold">Datos de Envío y Destinatario</h2>
                <span class="text-caption text-medium-emphasis">Ingresa los datos para la entrega del paquete</span>
              </div>
            </div>

            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="customer.fullName"
                  label="Nombre y Apellidos *"
                  placeholder="Ej. Juan Pérez González"
                  :rules="[rules.name]"
                  variant="outlined"
                  rounded="lg"
                  density="comfortable"
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
                  rounded="lg"
                  density="comfortable"
                  prepend-inner-icon="mdi-email-outline"
                  append-inner-icon="mdi-help-circle-outline"
                  hint="Dato demostrativo; no se enviarán correos reales"
                  persistent-hint
                  @click:append-inner="showNoEmailModal = true"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="customer.phone"
                  label="Teléfono Móvil (10 dígitos) *"
                  placeholder="5512345678"
                  :rules="[rules.phone]"
                  variant="outlined"
                  rounded="lg"
                  density="comfortable"
                  prepend-inner-icon="mdi-phone-outline"
                  maxlength="10"
                  @input="onPhoneInput"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="customer.address"
                  label="Calle, Número exterior e interior, Colonia *"
                  placeholder="Av. Juárez 100, Depto 4B, Col. Centro"
                  :rules="[rules.address]"
                  variant="outlined"
                  rounded="lg"
                  density="comfortable"
                  prepend-inner-icon="mdi-map-marker-outline"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="customer.city"
                  label="Ciudad / Municipio *"
                  placeholder="Ciudad de México"
                  :rules="[rules.city]"
                  variant="outlined"
                  rounded="lg"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="customer.postalCode"
                  label="Código Postal (5 dígitos) *"
                  placeholder="06000"
                  :rules="[rules.postalCode]"
                  variant="outlined"
                  rounded="lg"
                  density="comfortable"
                  maxlength="5"
                  @input="onPostalCodeInput"
                />
              </v-col>
            </v-row>

            <div class="d-flex justify-end mt-4">
              <v-btn
                color="primary"
                variant="flat"
                size="large"
                rounded="lg"
                :disabled="!isStep1Valid"
                append-icon="mdi-arrow-right"
                class="text-none font-weight-bold px-6"
                @click="nextStep"
              >
                Continuar al Pago
              </v-btn>
            </div>
          </div>

          <!-- STEP 2: Payment Method & Validations -->
          <div v-else-if="currentStep === 2">
            <div class="d-flex align-center ga-2 mb-4">
              <v-avatar color="primary" size="30" class="text-caption font-weight-bold text-white">2</v-avatar>
              <div>
                <h2 class="text-h6 font-weight-bold">Método de Pago</h2>
                <span class="text-caption text-medium-emphasis">Selecciona la forma de pago preferida</span>
              </div>
            </div>

            <!-- Payment Toggle -->
            <v-btn-toggle
              v-model="paymentMethod"
              mandatory
              color="primary"
              variant="outlined"
              divided
              class="w-100 mb-6 d-flex"
              rounded="lg"
            >
              <v-btn value="card" class="flex-grow-1 text-none" prepend-icon="mdi-credit-card-outline">
                Tarjeta
              </v-btn>
              <v-btn value="spei" class="flex-grow-1 text-none" prepend-icon="mdi-bank-transfer">
                SPEI
              </v-btn>
              <v-btn value="oxxo" class="flex-grow-1 text-none" prepend-icon="mdi-storefront-outline">
                OXXO Pay
              </v-btn>
            </v-btn-toggle>

            <!-- Card Payment with Interactive Preview -->
            <div v-if="paymentMethod === 'card'">
              <!-- Interactive Visual Credit Card Preview -->
              <div class="virtual-card pa-5 rounded-2xl mb-6 elevation-4 text-white position-relative overflow-hidden">
                <div class="d-flex justify-space-between align-center mb-6">
                  <v-icon icon="mdi-credit-card-chip" size="36" color="amber-lighten-2" />
                  <span class="text-subtitle-2 font-weight-black tracking-widest">VISA / MASTERCARD</span>
                </div>
                <div class="text-h6 font-weight-black tracking-widest mb-4">
                  {{ card.number || '•••• •••• •••• ••••' }}
                </div>
                <div class="d-flex justify-space-between align-end">
                  <div>
                    <span class="text-caption opacity-80 d-block" style="font-size: 0.65rem !important;">TITULAR</span>
                    <span class="text-body-2 font-weight-bold text-uppercase">{{ card.name || 'NOMBRE DEL CLIENTE' }}</span>
                  </div>
                  <div>
                    <span class="text-caption opacity-80 d-block" style="font-size: 0.65rem !important;">EXPIRA</span>
                    <span class="text-body-2 font-weight-bold">{{ card.expiry || 'MM/AA' }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Inputs with Rules -->
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="card.number"
                    label="Número de Tarjeta (16 dígitos) *"
                    placeholder="4532 8912 3456 7890"
                    :rules="[rules.cardNumber]"
                    variant="outlined"
                    rounded="lg"
                    density="comfortable"
                    prepend-inner-icon="mdi-credit-card-outline"
                    maxlength="19"
                    @input="onCardNumberInput"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="card.name"
                    label="Nombre Completo en la Tarjeta *"
                    placeholder="JUAN PEREZ GONZALEZ"
                    :rules="[rules.name]"
                    variant="outlined"
                    rounded="lg"
                    density="comfortable"
                    class="text-uppercase"
                  />
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="card.expiry"
                    label="Vencimiento (MM/AA) *"
                    placeholder="08/29"
                    :rules="[rules.cardExpiry]"
                    variant="outlined"
                    rounded="lg"
                    density="comfortable"
                    maxlength="5"
                    @input="onCardExpiryInput"
                  />
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="card.cvv"
                    label="Código de Seguridad (CVV) *"
                    placeholder="123"
                    type="password"
                    :rules="[rules.cardCvv]"
                    variant="outlined"
                    rounded="lg"
                    density="comfortable"
                    maxlength="4"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- SPEI Payment Option -->
            <div v-else-if="paymentMethod === 'spei'" class="pa-5 rounded-2xl border bg-surface-variant mb-6">
              <div class="d-flex align-center ga-2 mb-3">
                <v-icon icon="mdi-bank" color="primary" />
                <span class="text-subtitle-2 font-weight-bold">Transferencia Interbancaria (SPEI)</span>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-3">
                Realiza tu transferencia desde tu aplicación bancaria móvil con los siguientes datos oficiales:
              </p>
              <div class="pa-4 rounded-xl border bg-surface mb-3">
                <div class="text-body-2 mb-1"><strong>Banco Destino:</strong> BBVA México</div>
                <div class="text-body-2 mb-2"><strong>Beneficiario:</strong> TechStore S.A. de C.V.</div>
                <div class="d-flex align-center justify-space-between pt-2 border-t">
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">CLABE Interbancaria:</span>
                    <span class="text-body-1 font-weight-black">646180123456789012</span>
                  </div>
                  <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-content-copy" @click="copyClabe">
                    Copiar
                  </v-btn>
                </div>
              </div>
              <p class="text-caption text-medium-emphasis mb-0">
                La validación de la transferencia se realiza automáticamente en nuestro sistema en cuestión de minutos.
              </p>
            </div>

            <!-- OXXO Pay Option -->
            <div v-else class="pa-5 rounded-2xl border bg-surface-variant mb-6">
              <div class="d-flex align-center ga-2 mb-3">
                <v-icon icon="mdi-barcode-scan" color="primary" />
                <span class="text-subtitle-2 font-weight-bold">Pago en Efectivo (OXXO Pay)</span>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-3">
                Acude a cualquier tienda OXXO del país y proporciona la siguiente referencia al cajero:
              </p>
              <div class="pa-4 rounded-xl border bg-surface text-center mb-3">
                <span class="text-caption text-medium-emphasis d-block mb-1">Número de Referencia OXXO:</span>
                <div class="text-h6 font-weight-black tracking-widest text-primary mb-2">
                  9384 1029 3847 12
                </div>
                <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-content-copy" @click="copyOxxoRef">
                  Copiar Referencia
                </v-btn>
              </div>
              <p class="text-caption text-medium-emphasis mb-0">
                Dispones de 24 horas para realizar el pago antes de que se cancele la reserva del inventario.
              </p>
            </div>

            <!-- Navigation Buttons -->
            <div class="d-flex justify-space-between align-center pt-2">
              <v-btn
                variant="text"
                prepend-icon="mdi-arrow-left"
                class="text-none"
                @click="currentStep = 1"
              >
                Volver a Datos de Envío
              </v-btn>

              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                size="large"
                :loading="isProcessing"
                :disabled="!isStep2Valid"
                append-icon="mdi-lock-check"
                class="font-weight-bold text-none px-8"
                @click="processPayment"
              >
                Pagar ${{ cartStore.totalAmount }} MXN
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Right Column: Order Summary Preview -->
      <v-col cols="12" md="5">
        <v-card rounded="2xl" elevation="1" class="border pa-6">
          <h3 class="text-subtitle-1 font-weight-bold mb-4">Resumen del Pedido</h3>

          <!-- Items list -->
          <div class="mb-4">
            <div
              v-for="item in cartStore.details"
              :key="item.product.id"
              class="d-flex align-center justify-space-between py-2 border-b"
            >
              <div class="d-flex align-center">
                <v-avatar size="40" rounded="lg" class="mr-3 border bg-surface-variant flex-shrink-0">
                  <v-img :src="item.product.image" cover />
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-bold text-truncate" style="max-width: 170px;">
                    {{ item.product.name }}
                  </div>
                  <span class="text-caption text-medium-emphasis">Cant: {{ item.quantity }}</span>
                </div>
              </div>
              <span class="text-body-2 font-weight-bold">
                ${{ item.quantity * item.product.price }} MXN
              </span>
            </div>
          </div>

          <div class="d-flex justify-space-between text-body-2 mb-2">
            <span class="text-medium-emphasis">Subtotal</span>
            <span>${{ cartStore.rawSubtotal }} MXN</span>
          </div>

          <div v-if="cartStore.discountPercent > 0" class="d-flex justify-space-between text-body-2 mb-2 text-success">
            <span>Descuento ({{ cartStore.couponCode }})</span>
            <span class="font-weight-bold">-${{ cartStore.discountAmount }} MXN</span>
          </div>

          <div class="d-flex justify-space-between text-body-2 mb-4">
            <span class="text-medium-emphasis">Envío</span>
            <span class="text-success font-weight-bold">GRATIS</span>
          </div>

          <v-divider class="my-4" />

          <div class="d-flex justify-space-between align-baseline mb-5">
            <span class="text-body-1 font-weight-bold">Total a Pagar:</span>
            <span class="text-h4 font-weight-black text-primary">${{ cartStore.totalAmount }} MXN</span>
          </div>

          <div class="pa-3 rounded-xl bg-surface-variant text-caption text-medium-emphasis">
            <v-icon icon="mdi-shield-lock" color="success" size="16" class="mr-1" />
            Transacción 100% segura con validación instantánea y encriptación de datos.
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Informativo de Correo -->
    <NoEmailModal v-model="showNoEmailModal" />
  </div>
</template>

<style scoped>
.virtual-card {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 30px -10px rgba(49, 46, 129, 0.5) !important;
}

.printable-invoice {
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1) !important;
}

.receipt-table {
  width: 100%;
  border-collapse: collapse;
}

.receipt-table th,
.receipt-table td {
  padding: 10px 8px;
}

/* HIGH-FIDELITY PRINT STYLES */
@media print {
  /* Hide all website chrome and non-printable elements */
  nav,
  header,
  footer,
  .v-app-bar,
  .v-navigation-drawer,
  .v-footer,
  .v-breadcrumbs,
  .v-snackbar,
  .no-print,
  .no-print * {
    display: none !important;
  }

  /* Reset document for clean paper print */
  html,
  body,
  #app,
  .v-application,
  .v-application__wrap,
  .v-main,
  .v-container {
    background: #ffffff !important;
    color: #111827 !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
  }

  .printable-invoice {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 24px !important;
    background: #ffffff !important;
    color: #111827 !important;
    border: 2px solid #111827 !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    page-break-inside: avoid;
  }

  .receipt-table {
    width: 100% !important;
    border-collapse: collapse !important;
  }

  .receipt-table th {
    background-color: #f3f4f6 !important;
    color: #111827 !important;
    font-weight: 700 !important;
    border-bottom: 2px solid #d1d5db !important;
    padding: 8px !important;
  }

  .receipt-table td {
    color: #111827 !important;
    border-bottom: 1px solid #e5e7eb !important;
    padding: 8px !important;
  }

  .text-medium-emphasis,
  .text-disabled {
    color: #4b5563 !important;
  }

  .text-high-emphasis {
    color: #111827 !important;
  }

  .text-primary {
    color: #1e40af !important;
  }

  .text-success {
    color: #065f46 !important;
  }

  @page {
    margin: 1.2cm;
    size: auto;
  }
}
</style>
