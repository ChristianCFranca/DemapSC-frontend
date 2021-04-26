import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import NovoPedido from '../views/NovoPedido.vue'
import AndamentosAtivos from '../views/AndamentosAtivos.vue'
import AndamentosCancelados from '../views/AndamentosCancelados.vue'
import AndamentosConcluidos from '../views/AndamentosConcluidos.vue'
import Login from '../views/Login.vue'
import CriarConta from '../views/CriarConta.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/novo-pedido',
    name: 'home'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/novo-pedido',
    name: 'novo-pedido',
    component: NovoPedido
  },
  {
    path: '/andamentos-ativos',
    name: 'andamentos-ativos',
    component: AndamentosAtivos
  },
  {
    path: '/andamentos-concluidos',
    name: 'andamentos-concluidos',
    component: AndamentosConcluidos
  },
  {
    path: '/andamentos-cancelados',
    name: 'andamentos-cancelados',
    component: AndamentosCancelados
  },
  {
    path: '/criarconta',
    name: 'criar-conta',
    component: CriarConta
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    if (to.name !== 'login' && !store.getters.getIsAuthenticated){
      if (to.name !== 'criar-conta') next({name: 'login'})
      else next()
    }
    else next()
  }, 1)
});

export default router
