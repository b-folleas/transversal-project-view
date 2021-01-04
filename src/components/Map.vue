<template>
  <div class="map-container">
    <div class="map">
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
      >
        <div class="square" v-if="isTruckOnMapItem(mapItem)">
          <img
            :style="{
              width: squareSize + 'px',
            }"
            src="../assets/pictures/truck.png"
            alt="truck.jpg"
          />
          <span>{{ isTruckOnMapItem(mapItem) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { MapItem } from "../model/MapItem";
import { Truck } from "../model/Truck";
import MapItemsDataService from "../service/mapItemsDataService";
import TruckDataService from "../service/truckDataService";

export default class Map extends Vue {
  public mapItems: MapItem[] = [];
  public trucks: Truck[] = [];
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

    TruckDataService.getAll()
      .then((res) => {
        console.log("trucks : ", res.data);
        this.trucks = res.data;
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

    const h = (vh * 0.85) / 6;
    const w = (vw * 0.9) / 10;

    this.squareSize = Math.min(h, w);
  }

  isTruckOnMapItem(mapItem: MapItem) {
    return this.trucks?.find((p) => p?.mapItem?.id === mapItem.id)?.matricule;
  }
}
</script>

<style lang="scss">
@import "../assets/scss/variables";

.map-container {
  display: flex;
  justify-content: center;

  .map {
    display: grid;
    height: fit-content;
    margin-top: 20px;

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      span {
        position: absolute;
        bottom: -6px;
        right: 0px;
        color: white;
      }

      &.ROAD {
        background-color: $road;
      }
      &.BUILDING {
        background-color: $building;
      }
      &.GARDEN {
        background-color: $garden;
      }
    }

    @include for-tablet {
      margin-top: 100px;
    }

    @include for-phone {
      margin-top: calc(100vh / 4);
    }
  }
}
</style>
