<template>
  <div class="map-container">
    <pacman-loader
      v-if="isLoading"
      :color="'#195cd6'"
      :loading="isLoading"
    ></pacman-loader>

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
        <div
          class="square"
          v-if="(assets = getAssetsOnSquare(mapItem))"
          :class="'n-' + assets.data.length.toString()"
        >
          <img
            v-for="asset in assets.data"
            v-bind:key="asset"
            :class="asset.name"
            :style="{
              width: asset.size,
            }"
            :src="asset.url"
            alt="asset.name"
          />
          <div
            v-if="assets.description"
            v-html="assets.description"
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
import BarracksDataService from "../service/barracksDataService";
import { Incident } from "../model/Incident";
import PacmanLoader from "vue-spinner/src/PacmanLoader.vue";
import { EIncidentType } from "../model/EIncidentType";
import { Emit } from "vue-property-decorator";
import { Barrack } from "../model/Barrack";

@Options({
  components: {
    PacmanLoader,
  },
})
export default class Map extends Vue {
  public mapItems: MapItem[] = [];
  public trucks: Truck[] = [];
  public incidents: Incident[] = [];
  public barracks: Barrack[] = [];
  public squareSize = 0;
  public isLoading = false;
  public nbLines = 0;
  public nbColumns = 0;

  public initInterval?: number;
  public dataInterval?: number;

  public refreshInitInterval = 60;
  public refreshDataInterval = 5;

  created() {
    this.getBaseData();
    window.addEventListener("resize", this.resize);
  }

  destroyed() {
    clearInterval(this.initInterval);
    clearInterval(this.dataInterval);
  }

  getBaseData() {
    console.log("Get barracks and mapItems");

    if (!this.initInterval) {
      this.initInterval = setInterval(
        this.getBaseData,
        this.refreshInitInterval * 1000
      );
    }

    this.isLoading = true;
    Promise.all([MapItemsDataService.getAll(), BarracksDataService.getAll()])
      .then((values) => {
        this.mapItems = values[0].data;
        this.barracks = values[1].data;

        this.nbLines = Math.max(...this.mapItems.map((m) => m?.posY || 0));
        this.nbColumns = Math.max(...this.mapItems.map((m) => m?.posX || 0));

        this.resize();

        this.isLoading = false;

        // only first time, to ensure basic data are already present
        if (!this.trucks.length && !this.incidents.length) {
          this.getData();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getData() {
    console.log("Get trucks and incidents");

    if (!this.dataInterval) {
      this.dataInterval = setInterval(
        this.getData,
        this.refreshDataInterval * 1000
      );
    }

    Promise.all([TruckDataService.getAll(), IncidentsDataService.getAll()])
      .then((values) => {
        this.trucks = values[0].data;
        this.incidents = values[1].data;

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

  getAssetsOnSquare(mapItem: MapItem) {
    const barracks = this.barracks?.filter(
      (b) => b?.mapItem?.id === mapItem.id
    );
    const trucks = this.trucks?.filter((p) => p?.mapItem?.id === mapItem.id);
    const incidents = this.incidents?.filter(
      (i) => i?.mapItem?.id === mapItem.id
    );

    const dataInfos: any[] = [];
    let description = "";

    barracks.forEach((b) => {
      dataInfos.push({
        name: "barrack",
        url: require("../assets/pictures/barrack.png"),
      });

      description +=
        (description.length ? "<br>" : "") +
        "<p><strong>Caserne</strong></p>" +
        "<p><strong>Name : </strong>" +
        b.name +
        "</p>";
    });

    trucks.forEach((t) => {
      dataInfos.push({
        name: "truck",
        url: require("../assets/pictures/truck.png"),
      });

      description +=
        (description.length ? "<br>" : "") +
        "<p><strong>Camion</strong></p>" +
        "<p><strong>Matricule : </strong>" +
        t.matricule +
        "</p>" +
        "<p><strong>Caserne : </strong>" +
        t.barrack?.name +
        "</p>" +
        "<p><strong>Disponibilité : </strong>" +
        (t.availability ? "Oui" : "Non") +
        "</p>";
    });

    incidents.forEach((i) => {
      const info = {
        name: "incident",
        url: "",
        size: (i.intensity || 0) * 10 + "%",
      };

      switch (i.incidentType) {
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

      dataInfos.push(info);

      description +=
        (description.length ? "<br>" : "") +
        "<p><strong>Incident</strong></p>" +
        "<p><strong>Type : </strong>" +
        i.incidentType?.toLowerCase() +
        "</p>" +
        "<p><strong>Intensité : </strong>" +
        i.intensity +
        "</p>";
    });

    return {
      data: dataInfos,
      description: description,
    };
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
        display: grid;
        grid-gap: 2%;
        height: 100%;
        position: relative;

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
          border: 1px solid black;

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
            border-right: 1px solid black;
            content: "";
            position: absolute;
            right: 100%;
            top: 5%;
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

        img {
          object-fit: contain;
          width: 100%;
          max-height: 100%;
          display: flex;
          align-self: center;
          justify-self: center;
        }

        &.n-2 {
          grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
          grid-template-columns: minmax(0, 1fr);
          grid-template-areas:
            "top"
            "bottom";

          .barrack {
            grid-area: top;
          }

          .truck,
          .incident {
            grid-area: bottom;
          }
        }

        &.n-3 {
          grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          grid-template-areas:
            "top top"
            "bottom-left bottom-right";

          .barrack {
            grid-area: top;
          }

          .truck {
            grid-area: bottom-left;
          }

          .incident {
            grid-area: bottom-right;
          }
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
