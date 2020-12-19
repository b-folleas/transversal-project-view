<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light mb-5">
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
            <router-link class="nav-link" to="/truck">Truck</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/map">Map</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

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
</style>
