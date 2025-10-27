<script lang="ts">
import type { PropType } from 'vue';
import type { Product } from '../model/types.ts';
import { useCartStore } from '../stores/cart.ts';

export default{
    props:{
        product:{
            type: Object as PropType<Product>,
            required: true
        }
    },
    methods:{
        onAddBunttonClick(){
            const cartStore = useCartStore();
            cartStore.addProduct(this.product);
        }
    },
    computed :{
        productImageUrl(){
            return this.product.image ??
            'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'
        }
    },
}
</script>

<template>
    <v-card>
        <v-img
            height="200px"
            :src="productImageUrl"
            cover>
        </v-img>
        <v-card-title>
            {{ product.name }}
        </v-card-title>
        <v-card-text>
            <p class="mb-4">
                Esta es una descripción de ejemplo
            </p>
            <v-chip>
                $ {{ product.price }} MX
            </v-chip>
        </v-card-text>
        
        <v-card-actions>
            <v-btn color="orange-lighten-2"
            @click="onAddBunttonClick">
                Agregar al carrito
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
