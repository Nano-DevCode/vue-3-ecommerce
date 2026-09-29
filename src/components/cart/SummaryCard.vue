<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

const couponInput = ref('');

function handleApplyCoupon() {
  if (!couponInput.value.trim()) return;
  cartStore.applyCoupon(couponInput.value);
  couponInput.value = '';
}

function applyQuickCoupon(code: string) {
  cartStore.applyCoupon(code);
}
</script>

<template>
  <v-card rounded="2xl" elevation="2" class="border summary-card">
    <div class="pa-5 border-b">
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-receipt-text-outline" color="primary" size="22" />
        <h2 class="text-subtitle-1 font-weight-bold">Resumen del Pedido</h2>
      </div>
    </div>

    <v-card-text class="pa-5">
      <!-- Subtotal row -->
      <div class="d-flex justify-space-between text-body-2 mb-3">
        <span class="text-medium-emphasis">Subtotal ({{ cartStore.cartItemCount }} artículos)</span>
        <span class="font-weight-medium">${{ cartStore.rawSubtotal }} MXN</span>
      </div>

      <!-- Discount row if applied -->
      <div v-if="cartStore.discountPercent > 0" class="d-flex justify-space-between align-center text-body-2 mb-3 pa-2 rounded-lg coupon-applied-banner">
        <div class="d-flex align-center ga-2">
          <v-icon icon="mdi-tag-check" size="18" color="success" />
          <span class="font-weight-bold text-success">
            {{ cartStore.couponCode }} (-{{ cartStore.discountPercent }}%)
          </span>
        </div>
        <div class="d-flex align-center ga-2">
          <span class="font-weight-black text-success">-${{ cartStore.discountAmount }} MXN</span>
          <v-btn
            icon="mdi-close-circle"
            size="x-small"
            variant="text"
            color="error"
            title="Quitar cupón"
            density="comfortable"
            @click="cartStore.removeCoupon()"
          />
        </div>
      </div>

      <!-- Shipping row -->
      <div class="d-flex justify-space-between align-center text-body-2 mb-3">
        <span class="text-medium-emphasis">Envío Nacional</span>
        <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">
          GRATIS
        </v-chip>
      </div>

      <!-- Guarantee row -->
      <div class="d-flex justify-space-between text-body-2 mb-4">
        <span class="text-medium-emphasis">Garantía Oficial</span>
        <span class="text-success font-weight-medium">1 Año Incluida</span>
      </div>

      <!-- Polished Coupon Input Box -->
      <div class="pa-4 mb-5 rounded-xl border coupon-box">
        <div class="d-flex align-center ga-2 mb-2">
          <v-icon icon="mdi-ticket-percent-outline" color="primary" size="18" />
          <span class="text-caption font-weight-bold text-uppercase">Cupón Promocional</span>
        </div>

        <div class="d-flex ga-2 mb-2">
          <v-text-field
            v-model="couponInput"
            placeholder="CÓDIGO DE CUPÓN"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details
            class="text-uppercase font-weight-bold coupon-input"
            @keyup.enter="handleApplyCoupon"
          />
          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            :disabled="!couponInput.trim()"
            class="font-weight-bold text-none px-4"
            @click="handleApplyCoupon"
          >
            Aplicar
          </v-btn>
        </div>

        <!-- Quick Demo Coupon Chips -->
        <div class="d-flex align-center flex-wrap ga-1 mt-2">
          <span class="text-caption text-medium-emphasis mr-1" style="font-size: 0.72rem !important;">
            Cupones disponibles:
          </span>
          <v-chip
            size="x-small"
            variant="tonal"
            color="primary"
            class="font-weight-bold cursor-pointer"
            @click="applyQuickCoupon('PORTAFOLIO20')"
          >
            PORTAFOLIO20 (-20%)
          </v-chip>
          <v-chip
            size="x-small"
            variant="tonal"
            color="secondary"
            class="font-weight-bold cursor-pointer"
            @click="applyQuickCoupon('PROMO10')"
          >
            PROMO10 (-10%)
          </v-chip>
        </div>
      </div>

      <v-divider class="my-4" />

      <!-- Total amount -->
      <div class="d-flex justify-space-between align-baseline mb-6">
        <div>
          <span class="text-body-1 font-weight-bold d-block">Total a Pagar</span>
          <span class="text-caption text-medium-emphasis">Impuestos incluidos</span>
        </div>
        <div class="text-right">
          <span class="text-h3 font-weight-black text-primary d-block">
            ${{ cartStore.totalAmount }}
          </span>
          <span class="text-caption text-medium-emphasis font-weight-medium">MXN</span>
        </div>
      </div>

      <!-- Action Button: Proceed to Dedicated Checkout Page -->
      <v-btn
        to="/checkout"
        color="primary"
        block
        size="x-large"
        rounded="lg"
        prepend-icon="mdi-credit-card-fast-outline"
        :disabled="cartStore.cartItemCount === 0"
        class="font-weight-bold text-none mb-4 elevation-2 checkout-btn"
      >
        Proceder al Pago Seguro
      </v-btn>

      <p v-if="cartStore.cartItemCount === 0" class="text-caption text-center text-medium-emphasis mb-0">
        Agrega al menos un producto al carrito para continuar.
      </p>

      <!-- Trust Badges -->
      <div class="pt-4 mt-2 border-t text-caption text-medium-emphasis">
        <div class="d-flex align-center ga-2 mb-2">
          <v-icon icon="mdi-shield-check-outline" color="success" size="18" />
          <span>Pago 100% seguro con encriptación SSL</span>
        </div>
        <div class="d-flex align-center ga-2 mb-2">
          <v-icon icon="mdi-truck-check-outline" color="primary" size="18" />
          <span>Envío nacional con número de guía</span>
        </div>
        <div class="d-flex align-center ga-2">
          <v-icon icon="mdi-undo-variant" color="secondary" size="18" />
          <span>Garantía de satisfacción y devolución fácil</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.coupon-box {
  background: rgba(var(--v-theme-surface-variant), 0.6);
  border: 1px dashed rgba(var(--v-theme-primary), 0.3) !important;
}

.coupon-applied-banner {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.checkout-btn {
  letter-spacing: 0.3px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.4) !important;
}

.cursor-pointer {
  cursor: pointer;
}

@media (min-width: 1280px) {
  .summary-card {
    position: sticky;
    top: 84px;
  }
}
</style>
