import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import type { Product } from '@/model/types';
import { useCartStore } from './cart';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: useLocalStorage<Product[]>('wishlistProducts', [])
  }),
  getters: {
    count: (state) => state.items.length,
    isInWishlist: (state) => (productId: number) => {
      return state.items.some(p => p.id === productId);
    }
  },
  actions: {
    toggleWishlist(product: Product) {
      const cartStore = useCartStore();
      const index = this.items.findIndex(p => p.id === product.id);

      if (index !== -1) {
        this.items.splice(index, 1);
        cartStore.notify(`"${product.name}" eliminado de favoritos`, 'info');
      } else {
        this.items.push(product);
        cartStore.notify(`"${product.name}" guardado en favoritos`, 'success');
      }
    },
    removeFromWishlist(productId: number) {
      const index = this.items.findIndex(p => p.id === productId);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    clearWishlist() {
      this.items = [];
    }
  }
});
