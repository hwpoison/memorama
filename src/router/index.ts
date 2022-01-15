import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Game from '../views/Game.vue'
import OpeningScreen from '../views/OpeningScreen.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/',
    name: 'OpeningScreen',
    component: OpeningScreen
  }
]

const router = createRouter({
  history:createWebHistory(),
  routes
})

export default router
