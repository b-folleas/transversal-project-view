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
            alt="Incident"
          />
          <div
            v-if="info.description"
            v-html="info.description"
            class="info-tooltip"
          ></div>
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
import { Emit } from "vue-property-decorator";
import BarracksDataService from "../service/barracksDataService";
import { Barrack } from "../model/Barrack";

@Options({
  components: {
    PacmanLoader,
  }
})
export default class Map extends Vue {
  public mapItems: MapItem[] = [];
  public incidents: Incident[] = [];
  public barracks: Barrack[] = [];
  public squareSize = 0;
  public isLoading = false;
  public nbLines = 0;
  public nbColumns = 0;

  public initInterval?: number;
  public dataInterval?: number;

  public refreshInitInterval = 10;
  public refreshDataInterval = 5;

  created() {
    this.initInterval = setInterval(this.init, this.refreshInitInterval * 1000);
    this.init();
  }

  destroyed() {
    clearInterval(this.dataInterval);
  }

  init() {
    this.isLoading = true;
    Promise.all([MapItemsDataService.getAll(), BarracksDataService.getAll()])
      .then((values) => {
        this.mapItems = values[0].data;
        this.barracks = values[1].data;

        if (this.mapItems.length && this.barracks.length) {
          this.dataInterval = setInterval(
            this.getData,
            this.refreshDataInterval * 1000
          );
          this.getData();

          clearInterval(this.initInterval);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getData() {
    Promise.all([IncidentsDataService.getAll()])
      .then((values) => {
        this.incidents = values[0].data;

        this.nbLines = Math.max(...this.mapItems.map((m) => m?.posY || 0));
        this.nbColumns = Math.max(...this.mapItems.map((m) => m?.posX || 0));

        window.addEventListener("resize", this.resize);
        this.resize();

        this.isLoading = false;

        this.$emit("updated", new Date());
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
    const barrack = this.barracks?.find((b) => b?.mapItem?.id === mapItem.id);
    if (barrack) {
      return {
        url: require("../assets/pictures/barrack.png"),
        size: this.squareSize + "px",
        description: "<p><strong>Name : </strong>" + barrack.name + "</p>",
      };
    }

    const incident = this.incidents?.find((i) => i?.mapItem?.id === mapItem.id);
    if (incident) {
      const info = {
        url: "",
        size: ((incident.intensity || 10) / 10) * this.squareSize + "px",
        description:
          "<p><strong>Type : </strong>" +
          incident.incidentType +
          "</p>" +
          "<p><strong>Intensité : </strong>" +
          incident.intensity +
          "</p>",
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
      .square {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        .info-tooltip {
          visibility: hidden;
          opacity: 0;
          background-color: white;
          color: #555;
          text-align: center;
          padding: 5px;
          border-radius: 5px;
          position: absolute;
          z-index: 1;
          top: 5px;
          left: 110%;
          transition: opacity 0.3s;

          p {
            white-space: nowrap;
            margin: 0px;
            text-align: initial;

            @media (max-width: 1200px) {
              font-size: 10px;
            }

            @include for-phone {
              font-size: 5px;
            }
          }

          &::after {
            content: "";
            position: absolute;
            right: 100%;
            bottom: 50%;
            margin-bottom: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent white transparent transparent;
          }
        }

        &:hover .info-tooltip {
          visibility: visible;
          opacity: 1;
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
