import { defineStore } from 'pinia'
import type { CartDetail, Product } from '@/model/types';
import { useLocalStorage } from '@vueuse/core';

export const useCartStore = defineStore('cart', {
  state: () => ({
    details: useLocalStorage<CartDetail[]>('cartDetails', [])
  }),
  getters: {
    cartItemCount: (state) => {
      let count = 0;
      state.details.forEach(detail => {
        count += detail.quantity;
      });
      return count;
    },
    totalAmount: (state) => {
      let total = 0;
      state.details.forEach(d => {
        total += d.product.price * d.quantity;
      })
      return total;
    },
    whatsAppMessage(state) {
      let message = 'Hola, quiero realizar la siguiente compra: \n\n';
      state.details.forEach(d => {
        message += `\nProducto: ${d.product.name}\n`;
        message += `Cantidad: ${d.quantity}\n`;
        message += `SubTotal: ${d.quantity * d.product.price}\n`;
        message += '---------------------------'
      });
      message += `\nTotal a pagar ${this.totalAmount}\n`
      message += 'Muchas gracias por comprar con nosotros';
      return encodeURI(message);
    },
    whatsAppLink(){
      return 'http://wa.me/529512129524?text=' + this.whatsAppMessage;
    }
  },
  actions: {
    addProduct(product : Product) {
      const detailFound =this.details.find(d => d.product.id === product.id);

      if(detailFound){
          detailFound.quantity += 1;
      }else{
        this.details.push({
          product,
          quantity:1
        });
      }
    },
    deleteProduct(productId : number){
      const index = this.details.findIndex(d => d.product.id === productId);
      this.details.splice(index , 1);
    },
    increment(productId : number){
      const detailFound =this.details.find(d => d.product.id === productId);
      if(detailFound ){
        detailFound.quantity += 1;
      }
    },
    decrement(productId : number){
      const detailFound =this.details.find(d => d.product.id === productId);
      if(detailFound){
        detailFound.quantity --;

        if(detailFound.quantity === 0){
          this.deleteProduct(productId);
        }
      }
    },

  },
})
