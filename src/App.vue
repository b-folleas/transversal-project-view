<template>
  <div class="app-content">
    <Navbar :dateLastUpdate="dateLastUpdate"/>
    <router-view @updated="onUpdate" />
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
export default class App extends Vue {
  public dateLastUpdate? = "";

  onUpdate(date: Date) {
    this.dateLastUpdate = date.toString()
  }
}
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
