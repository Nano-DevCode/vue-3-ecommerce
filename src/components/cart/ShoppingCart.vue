<script lang="ts">
import { mapState } from 'pinia';
import { useCartStore } from '../../stores/cart.ts'
import ShoppingCartItem from './ShoppingCartItem.vue';

export default{
    components:{
        ShoppingCartItem
    },
    computed: {
        ...mapState(useCartStore, ['details'])
    }
}

</script>

<template>
    <v-card c>
        <v-card-title>
                Productos agregados al carrito:
        </v-card-title>

        <v-card-text>
            <v-table v-if="details.length > 0">
                <thead>
                    <tr>
                        <th class="text-left">
                            Producto
                        </th>
                        <th class="text-center">
                            Cantidad
                        </th>
                        <th class="text-center">
                            Precio
                        </th>
                        <th class="text-left">
                            SubTotal
                        </th>
                        <th class="text-left">
                            <span class="d-sr-only">
                                Eliminar
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <ShoppingCartItem 
                        v-for="detail in details"
                        :key="detail.product.id"
                        :detail="detail"
                    />  
            </tbody>
            </v-table>
            <p v-else>
                Aún no has agregado items a tu carrito de compas.
                Haz <RouterLink to="/">click aquí</RouterLink> para ve los productos
                disponibles.
            </p>
        </v-card-text>
    </v-card>
</template>