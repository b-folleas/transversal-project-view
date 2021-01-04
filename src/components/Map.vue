<template>
  <div class="map-container">
    <pacman-loader v-if="isLoading" :loading="isLoading"></pacman-loader>

    <div class="map" v-if="!isLoading">
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
        <div class="square" v-if="(info = isAssetOnSquare(mapItem))">
          <img
            :style="{
              width: info.size,
            }"
            :src="info.url"
            alt="error"
          />
          <span>{{ info.number }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { MapItem } from "../model/MapItem";
import { Truck } from "../model/Truck";
import MapItemsDataService from "../service/mapItemsDataService";
import TruckDataService from "../service/truckDataService";
import IncidentsDataService from "../service/incidentsDataService";
import { Incident } from "../model/Incident";
import PacmanLoader from "vue-spinner/src/PacmanLoader.vue";
import { EIncidentType } from "../model/EIncidentType";

@Options({
  components: {
    PacmanLoader,
  },
})
export default class Map extends Vue {
  public mapItems: MapItem[] = [];
  public trucks: Truck[] = [];
  public incidents: Incident[] = [];
  public squareSize = 0;
  public isLoading = false;
  public nbLines = 0;
  public nbColumns = 0;

  created() {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    Promise.all([
      MapItemsDataService.getAll(),
      TruckDataService.getAll(),
      IncidentsDataService.getAll(),
    ])
      .then((values) => {
        console.log(values);
        this.mapItems = values[0].data;
        this.trucks = values[1].data;
        this.incidents = values[2].data;

        this.nbLines = Math.max(...this.mapItems.map((m) => m?.posY || 0));
        this.nbColumns = Math.max(...this.mapItems.map((m) => m?.posX || 0));

        window.addEventListener("resize", this.resize);
        this.resize();

        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
      });
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

    const h = (vh * 0.85) / this.nbLines;
    const w = (vw * 0.9) / this.nbColumns;

    this.squareSize = Math.min(h, w);
  }

  isAssetOnSquare(mapItem: MapItem) {
    const truck = this.trucks?.find((p) => p?.mapItem?.id === mapItem.id);
    if (truck) {
      return {
        url: require("../assets/pictures/truck.png"),
        number: truck.matricule,
        size: this.squareSize + "px",
      };
    }

    const incident = this.incidents?.find((i) => i?.mapItem?.id === mapItem.id);
    if (incident) {
      const info = {
        url: "",
        number: incident?.intensity,
        size: ((incident.intensity || 10) / 10) * this.squareSize + "px",
      };

      switch (incident.incidentType) {
        case EIncidentType.FIRE:
          info.url = require("../assets/pictures/fire.png");
          break;
        case EIncidentType.FLOOD:
          info.url = require("../assets/pictures/flood.png");
          break;
        case EIncidentType.ACCIDENT:
          info.url = require("../assets/pictures/accident.png");
          break;
        case EIncidentType.TORNADO:
          info.url = require("../assets/pictures/tornado.png");
          break;
      }

      return info;
    }
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
        bottom: 0px;
        right: 0px;
        color: white;
        background: black;
        width: 15px;
        height: 15px;
        text-align: center;
        font-size: 10px;

        @include for-phone {
          display: none;
        }
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

  .v-spinner {
    position: absolute !important;
    bottom: 50%;
  }
}
</style>
