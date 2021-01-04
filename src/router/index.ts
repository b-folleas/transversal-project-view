import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/map",
  },
  {
    path: "/truck",
    name: "Truck",
    component: () => import("../components/Truck.vue")
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("../components/Map.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active"
});

export default router;
