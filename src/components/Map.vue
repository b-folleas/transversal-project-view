<template>
  <div class="map-container">
    <div class="map">
      <!-- <div v-for="line in map" v-bind:key="line" class="line">
      <div v-for="col in line" v-bind:key="col" class="col">
        {{ col }}
      </div>
    </div> -->

      <div
        v-for="mapItem in mapItems"
        v-bind:key="mapItem"
        :style="{
          'grid-column': mapItem.posX,
          'grid-row': mapItem.posY,
          width: squareSize + 'px',
          height: squareSize + 'px',
        }"
        :class="mapItem.ground"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { MapItem } from "../model/MapItem";
import { Truck } from "../model/Truck";
import MapItemsDataService from "../service/mapItemsDataService";

export default class Map extends Vue {
  public map: string[][] = [
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ];
  public mapItems: MapItem[] = [];
  public squareSize = 0;

  created() {
    MapItemsDataService.getAll()
      .then((res) => {
        console.log("mapItems : ", res.data);
        this.mapItems = res.data;
      })
      .catch((error) => {
        console.error(error);
      });

    window.addEventListener("resize", this.resize);
    this.resize();
  }

  resize() {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

    const h = vh * 0.85 / 6;
    const w = vw * 0.9 / 10;

    this.squareSize = Math.min(h, w);
  }
}
</script>

<style lang="scss">
@import "../assets/scss/variables";

.map-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .map {
    display: grid;
    grid-template-columns: repeat(10, auto);

    > div {

      &.ROAD {
        background-color: grey;
      }
      &.BUILDING {
        background-color: brown;
      }
      &.GARDEN {
        background-color: green;
      }
    }

    .line {
      display: contents;

      .col {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: aquamarine;
        border: 1px solid black;
        content: "";
        padding-bottom: 100%;
      }
    }
  }
}
</style>
