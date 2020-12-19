<template>
  <div class="d-flex flex-column align-items-center">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <img alt="Vue logo" class="w-25" src="../assets/logo.png"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Options({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {}
</script>
