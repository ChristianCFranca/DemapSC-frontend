import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import NovoPedido from '../views/NovoPedido.vue'
import Andamentos from '../views/Andamentos.vue'
import Login from '../views/Login.vue'
import CriarConta from '../views/CriarConta.vue'
import CriarUsuario from '../views/CriarUsuario.vue'
import Usuarios from '../views/Usuarios.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/andamentos',
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
    path: '/andamentos',
    name: 'andamentos',
    component: Andamentos
  },
  {
    path: '/criarconta',
    name: 'criar-conta',
    component: CriarConta
  },
  {
    path: '/criarusuario',
    name: 'criar-usuario',
    component: CriarUsuario
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: Usuarios
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
    else if (store.getters.getIsAuthenticated && to.name === 'login') {
      next({name: 'andamentos'})
    }
    else next()
  }, 1)
});

export default router
