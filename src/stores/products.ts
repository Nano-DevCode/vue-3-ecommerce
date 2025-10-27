import type { Product } from "@/model/types";
import { defineStore } from "pinia";

export const useProductsStore = defineStore('product', {
  state: () : {_products : Product[], categoryId : number | null, order: string, loading : boolean} => ({
    order: 'price',
    categoryId: null,
    _products: [],
    loading : true
  }),
  getters: {
    products(state){
      let products = null;
      //Filter
      if(state.categoryId){
        products =  state._products.filter(p => p.categoryId === state.categoryId);
      }else{
        products = state._products;
      }
      //Order
      if(state.order === ''){
        return products;
      }

      if(state.order === 'price'){
        return products.sort((a,b) => a.price - b.price);
      }

      if(state.order === 'priceDesc'){
        return products.sort((a,b) => b.price - a.price);
      }

      if(state.order === 'name'){
        return products.sort((a, b) => a.name.localeCompare(b.name));
      }

      if(state.order === 'nameDesc'){
        return products.sort((a, b) => b.name.localeCompare(a.name));
      }
    }
  },
  actions: {
    fetchProducts(){
      fetch('/data/products.json')
        .then(response => response.json())
        .then((data) => {
          this._products = data;
          this.loading = false;
        });
    },
    selectCategory(categoryId: number){
      this.categoryId = categoryId;
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
    }
  }
})
