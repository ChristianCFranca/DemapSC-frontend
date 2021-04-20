import Vue from 'vue'
import VueRouter from 'vue-router'
import NovoPedido from '../views/NovoPedido.vue'
import ConferirAndamentos from '../views/ConferirAndamentos.vue'
import TelaDeLogin from '../views/TelaDeLogin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: 'home'
  },
  {
    path: '/login',
    name: 'login',
    component: TelaDeLogin
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
