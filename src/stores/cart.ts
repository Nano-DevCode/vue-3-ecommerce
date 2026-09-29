import { defineStore } from 'pinia'
import type { CartDetail, Product } from '@/model/types';
import { useLocalStorage } from '@vueuse/core';

export const useCartStore = defineStore('cart', {
  state: () => ({
    details: useLocalStorage<CartDetail[]>('cartDetails', []),
    couponCode: useLocalStorage<string>('cartCouponCode', ''),
    discountPercent: useLocalStorage<number>('cartDiscountPercent', 0),
    notification: {
      show: false,
      message: '',
      color: 'success'
    },
    noEmailModalOpen: false
  }),
  getters: {
    cartItemCount: (state) => {
      let count = 0;
      state.details.forEach(detail => {
        count += detail.quantity;
      });
      return count;
    },
    rawSubtotal: (state) => {
      let total = 0;
      state.details.forEach(d => {
        total += d.product.price * d.quantity;
      });
      return total;
    },
    discountAmount: (state) => {
      if (state.discountPercent <= 0) return 0;
      let total = 0;
      state.details.forEach(d => {
        total += d.product.price * d.quantity;
      });
      return Math.round((total * state.discountPercent) / 100);
    },
    totalAmount(): number {
      return Math.max(0, this.rawSubtotal - this.discountAmount);
    }
  },
  actions: {
    notify(message: string, color = 'success') {
      this.notification = {
        show: true,
        message,
        color
      };
    },
    hideNotification() {
      this.notification.show = false;
    },
    openNoEmailModal() {
      this.noEmailModalOpen = true;
    },
    closeNoEmailModal() {
      this.noEmailModalOpen = false;
    },
    applyCoupon(code: string): { success: boolean, message: string } {
      const clean = code.trim().toUpperCase();
      if (clean === 'PORTAFOLIO20') {
        this.couponCode = clean;
        this.discountPercent = 20;
        this.notify('¡Cupón PORTAFOLIO20 aplicado: 20% de descuento!', 'success');
        return { success: true, message: '¡20% de descuento aplicado con éxito!' };
      } else if (clean === 'PROMO10') {
        this.couponCode = clean;
        this.discountPercent = 10;
        this.notify('¡Cupón PROMO10 aplicado: 10% de descuento!', 'success');
        return { success: true, message: '¡10% de descuento aplicado con éxito!' };
      } else {
        this.notify('El cupón ingresado no es válido. Prueba: PORTAFOLIO20 o PROMO10', 'error');
        return { success: false, message: 'Cupón no válido' };
      }
    },
    removeCoupon() {
      this.couponCode = '';
      this.discountPercent = 0;
      this.notify('Cupón de descuento removido', 'info');
    },
    addProduct(product: Product, quantity = 1) {
      const detailFound = this.details.find(d => d.product.id === product.id);

      if(detailFound){
        detailFound.quantity += quantity;
      }else{
        this.details.push({
          product,
          quantity
        });
      }
      this.notify(`¡"${product.name}" agregado al carrito!`, 'success');
    },
    deleteProduct(productId: number){
      const index = this.details.findIndex(d => d.product.id === productId);
      if (index !== -1) {
        const item = this.details[index];
        this.details.splice(index , 1);
        this.notify(`"${item.product.name}" eliminado del carrito`, 'info');
      }
    },
    increment(productId: number){
      const detailFound = this.details.find(d => d.product.id === productId);
      if(detailFound){
        detailFound.quantity += 1;
      }
    },
    decrement(productId: number){
      const detailFound = this.details.find(d => d.product.id === productId);
      if(detailFound){
        detailFound.quantity --;

        if(detailFound.quantity === 0){
          this.deleteProduct(productId);
        }
      }
    },
    clearCart(){
      this.details = [];
      this.couponCode = '';
      this.discountPercent = 0;
      this.notify('Carrito vaciado exitosamente', 'info');
    }
  },
})
