import type { Product } from "@/model/types";
import { defineStore } from "pinia";

export const useProductsStore = defineStore('product', {
  state: () : {
    _products: Product[],
    categoryId: number | null,
    order: string,
    loading: boolean,
    searchQuery: string,
    maxPrice: number | null,
    onlyOffers: boolean,
    selectedProduct: Product | null,
    quickViewOpen: boolean
  } => ({
    order: 'price',
    categoryId: null,
    _products: [],
    loading: true,
    searchQuery: '',
    maxPrice: null,
    onlyOffers: false,
    selectedProduct: null,
    quickViewOpen: false
  }),
  getters: {
    products(state): Product[] {
      let list = [...state._products];

      // Filter by category
      if (state.categoryId !== null && state.categoryId !== undefined) {
        list = list.filter(p => p.categoryId === state.categoryId);
      }

      // Filter by search query
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase().trim();
        list = list.filter(p =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
        );
      }

      // Filter by max price
      if (state.maxPrice !== null && state.maxPrice !== undefined) {
        list = list.filter(p => p.price <= (state.maxPrice as number));
      }

      // Filter by only offers
      if (state.onlyOffers) {
        list = list.filter(p => !!p.originalPrice && p.originalPrice > p.price);
      }

      // Order
      if (state.order === 'price') {
        return list.sort((a, b) => a.price - b.price);
      }
      if (state.order === 'priceDesc') {
        return list.sort((a, b) => b.price - a.price);
      }
      if (state.order === 'name') {
        return list.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (state.order === 'nameDesc') {
        return list.sort((a, b) => b.name.localeCompare(a.name));
      }

      return list;
    },
    highestPrice(state): number {
      if (state._products.length === 0) return 500;
      return Math.max(...state._products.map(p => p.price));
    }
  },
  actions: {
    fetchProducts(){
      fetch('/data/products.json')
        .then(response => response.json())
        .then((data: Product[]) => {
          this._products = data;
          this.loading = false;
        });
    },
    selectCategory(categoryId: number | null){
      this.categoryId = categoryId;
    },
    setSearchQuery(query: string){
      this.searchQuery = query;
    },
    setMaxPrice(price: number | null){
      this.maxPrice = price;
    },
    setOnlyOffers(only: boolean){
      this.onlyOffers = only;
    },
    orderByPrice(){
      this.order = 'price';
    },
    orderByName(){
      this.order = 'name';
    },
    orderByPriceDesc(){
      this.order = 'priceDesc';
    },
    orderByNameDesc(){
      this.order = 'nameDesc';
    },
    openQuickView(product: Product) {
      this.selectedProduct = product;
      this.quickViewOpen = true;
    },
    closeQuickView() {
      this.quickViewOpen = false;
      this.selectedProduct = null;
    },
    resetFilters(){
      this.categoryId = null;
      this.searchQuery = '';
      this.order = 'price';
      this.maxPrice = null;
      this.onlyOffers = false;
    }
  }
});
