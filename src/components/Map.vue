<template>
  <div class="map">
    <div v-for="line in map" v-bind:key="line" class="line">
      <div v-for="col in line" v-bind:key="col" class="col">
        {{ col }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from "vue-class-component";

export default class Map extends Vue {
  map: string[][] = [
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  display: grid;
  grid-template-columns: repeat(10, auto);
}

.line {
  display: contents;
}

.col {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: aquamarine;
  border: 1px solid black;
  content: "";
  padding-bottom: 100%;
}
</style>
