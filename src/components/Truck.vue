<template>
  <div class="truck">
    <h1 class="text-center">Trucks</h1>
    <div class="d-flex justify-content-center mt-3">
      <ul class="list-group">
        <li v-for="truck in trucks" :key="truck.id" class="list-group-item list-group-item-primary">
          Truck numero : {{ truck.matricule }} de la barrack : {{ truck?.barrack?.name }} à la position : x =
          {{ truck?.mapItem?.posX }}, y = {{ truck?.mapItem?.posY }}
        </li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts">
import {Vue} from "vue-class-component";
import TruckDataService from "@/service/truckDataService";
import {Truck} from "@/model/Truck";

export default class TruckComponent extends Vue {

  public trucks: Truck[] = [];

  created() {
    TruckDataService.getAll()
        .then(trucks => {
          console.log(trucks);
          this.trucks = trucks.data;
        }).catch((error) => {
      console.error(error);
    });
  }
}
</script>
