import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Game from '../views/Game.vue'
import MainScreen from '../views/MainScreen.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/',
    name: 'MainScreen',
    component: MainScreen
  }
]

const router = createRouter({
  history:createWebHistory(),
  routes
})

export default router
