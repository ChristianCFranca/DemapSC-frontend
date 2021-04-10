import Vue from 'vue'
import VueRouter from 'vue-router'
import NovoPedido from '../views/NovoPedido.vue'
import ConferirAndamentos from '../views/ConferirAndamentos.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/novo-pedido',
    name: 'home',
  },
  {
    path: '/novo-pedido',
    name: 'novo-pedido',
    component: NovoPedido
  },
  {
    path: '/andamentos',
    name: 'andamentos',
    component: ConferirAndamentos
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
