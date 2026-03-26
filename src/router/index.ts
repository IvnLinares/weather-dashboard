import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CityView from '@/views/CityView.vue'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/city/:name', component: CityView },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
