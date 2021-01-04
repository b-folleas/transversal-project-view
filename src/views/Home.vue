<template>
  <div class="d-flex flex-column align-items-center">
    <Map></Map>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import Map from "../components/Map.vue";

@Options({
  components: {
    Map
  }
})
export default class Home extends Vue {}
</script>
