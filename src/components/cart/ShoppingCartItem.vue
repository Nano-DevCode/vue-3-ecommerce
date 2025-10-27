<script lang="ts">
import type { CartDetail } from '@/model/types';
import { useCartStore } from '@/stores/cart';
import { mapActions } from 'pinia';
import type { PropType } from 'vue';


export default {
    props: {
        detail: {
            type: Object as PropType<CartDetail>,
            required: true
        }
    },
    methods: {
        ...mapActions(useCartStore,{
            decrementQuantity: 'decrement',
            incrementQuantity: 'increment',
            deleteProduct : 'deleteProduct'
        }),

    },
    computed: {
        productImageUrl(){
            return this.detail.product.image ?? 
            'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
        },
        subTotal(){
            return (this.detail.product.price * this.detail.quantity);
        },
    },
}
</script>

<template>
    <tr>
        <td>
            <v-avatar class="mr-3">
                <v-img :src="productImageUrl" height="40px"/>
            </v-avatar>
            {{ detail.product.name }} 
        </td>
        <td class="text-center">
            <v-btn class="ml-2" 
                icon="mdi-minus" size="x-small" 
                @click="decrementQuantity(detail.product.id)">
            </v-btn>
            {{ detail.quantity }}
            <v-btn 
                icon="mdi-plus" size="x-small" 
                @click="incrementQuantity(detail.product.id)">
            </v-btn>
        </td>
        <td class="text-center">
            ${{ detail.product.price }}
        </td>
        <td>
            ${{ subTotal }}
        </td>
        <td>
            <v-btn 
                class="ml-2" prepend-icon="mdi-delete" size="small" 
                @click="deleteProduct(detail.product.id)">
                Eliminar
            </v-btn>
        </td>
    </tr>
</template>