<template>
  <div class="app-content">
    <Navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Navbar from "./components/Navbar.vue";

@Options({
  components: {
    Navbar,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "./assets/scss/bootstrap";

html,
body,
#app,
.app-content {
  height: 100%;
}
</style>
