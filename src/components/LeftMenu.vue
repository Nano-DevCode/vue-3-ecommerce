<script lang="ts">
import OrderOptions from './left/OrderOptions.vue';
import CategoryOptions from './left/CategoryOptions.vue';

export default {
    components:{
      OrderOptions,
      CategoryOptions
    },
}
</script>

<template>
    <v-sheet rounded="lg">
        <v-list rounded="lg">
          <CategoryOptions/>

          <v-divider class="my-2" />

          <OrderOptions/>
        </v-list>
    </v-sheet>
</template>
