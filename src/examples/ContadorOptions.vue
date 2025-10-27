<script lang="ts">
export default {
  data() {
    return {
      count: 0,
      name: "Contador",
      description: "Un simple contador en Vue.js",
    };
  },
  methods: {
    increase() {
      this.count++;
    },
    decrease() {
      this.count--;
    }
  },
  mounted(){
    console.log("El valor inicial del contador es:", this.count);
  }
};
</script>

<template>
  <p>Óbjetivo: Tienes que llegar a 100 clicks</p>

  <h1>Contador: {{ count }}</h1>
  <button @click="increase">Aumenta Contador</button>
  <button @click="decrease">Reduce Contador</button>
  <p>{{ name }} - {{ description }}</p>

  <p v-if="count <= 10">Vamos tú puedes!</p>
  <p v-else>Ya te falta muy poco...</p>
</template>
