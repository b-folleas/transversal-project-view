<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Projet-Scientifique</router-link>
      <button
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        class="navbar-toggler"
        data-bs-target="#navbarNav"
        data-bs-toggle="collapse"
        type="button"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/map">Map</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/truck">Truck</router-link>
          </li>
        </ul>
        <p class="timestamp">{{ content }}</p>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Prop, Component } from "vue-property-decorator";

@Options({
  props: {
    dateLastUpdate: ''
  }
})
export default class Navbar extends Vue {
  dateLastUpdate = '';
  content = "";

  created() {
    console.log("updated!");
    setInterval(() => {
      const time = new Date().getTime() / 1000 - new Date(this.dateLastUpdate).getTime() / 1000;
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time - minutes * 60);

      this.content = "Last updated ";
      if (minutes > 0) {
        this.content += minutes + " minutes and ";
      }
      if (seconds > 0) {
        this.content += seconds + " seconds ago.";
      } else {
        this.content = "";
      }
    }, 1000);
  }
}
</script>

<style lang="scss">
@import "../assets/scss/variables";

a.nav-link {
  font-size: 15pt;
  color: lighten($secondary, 20%) !important;
}

a.nav-link:hover {
  color: $secondary !important;
}

.nav-link.active {
  color: $secondary !important;
}

a.navbar-brand {
  color: $secondary !important;
}

.timestamp {
  margin-left: auto;
  margin-bottom: 0px;;
}
</style>
