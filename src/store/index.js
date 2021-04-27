import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';

const apiClient = axios.create({
    baseURL: '//localhost:8000',
    // baseURL: 'https://demapsm-backend.herokuapp.com',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: {
      nome: null,
      role: null,
      email: null,
      token: null
    },
    materiaisList: [],
    pedidos: [],
    allRoles: ["admin", "fiscal", "assistente", "almoxarife", "regular"],
    rolesThatCanDownload: ["admin", "fiscar", "assistente"],
    stepsForRoles: {
      2: ["admin", "assistente", "regular"],
      3: ["admin", "fiscal", "regular"],
      4: ["admin", "almoxarife", "regular"],
      5: ["admin", "assistente", "regular"],
      6: ["admin", "fiscal", "assistente", "regular"]
    },
    permissionsPerRole: {
      "admin": ["admin", "fiscal", "assistente", "almoxarife", "regular"],
      "fiscal": ["fiscal", "assistente", "almoxarife", "regular"],
      "assistente": ["regular"],
      "almoxarife": [],
      "regular": []
    },
    allUsers: []
  },
  mutations: {
    SET_AUTHENTICATION_DATA(state, userData) {
      state.currentUser.nome = userData.nome_completo;
      state.currentUser.role = userData.role;
      state.currentUser.email = userData.username;
      state.currentUser.token = userData.access_token;
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    SET_ALL_USERS(state, users) {
      state.allUsers = users;
    },
    SET_MATERIAIS(state, materiais) {
      state.materiaisList = materiais;
    },
    SET_TODOS_OS_PEDIDOS(state, pedidos){
      state.pedidos = pedidos;
    },
    USER_CLEAR_DATA() {
      localStorage.removeItem('user');
      location.reload(); // Força um refresh da página, destruindo o estado do vuex
    }
  },
  actions: {
    authenticate({ commit }, credentials) {
      return apiClient.post('/auth/token', credentials)
      .then(response => {
        commit('SET_AUTHENTICATION_DATA', response.data)
        return response
      })
    },
    logout({ commit }) {
      commit('USER_CLEAR_DATA')
    },
    register(_, newUserData) {
      return apiClient.post('/auth/users/create/', newUserData)
      .then(response => response)
    },
    changePassword({ getters }, userDataJSON) {
      userDataJSON.username = getters.getEmail;
      return apiClient.put('/auth/users/update/password', userDataJSON)
      .then(response => response)
    },
    updateUser(_, userDataJSON) {
      return apiClient.put('/auth/users/update/general', userDataJSON)
      .then(response => response)
    },
    getUsers({ commit }) {
      return apiClient.get('/auth/users/')
      .then(response => {
        commit('SET_ALL_USERS', response.data)
      })
    },
    getMateriais({ commit }) {
      return apiClient.get('/crud/materiais/')
      .then(response => {
        commit('SET_MATERIAIS', response.data)
      })
    },
    getTodosOsPedidos({ commit }) {
      return apiClient.get('/crud/pedidos/')
      .then(response => {
        commit('SET_TODOS_OS_PEDIDOS', response.data)
        return response
      })
    },
    postNovoPedido(_, novoPedido) {
      return apiClient.post('/crud/pedidos/', novoPedido)
      .then(response => {
        return response
      })
    },
    putPedidoExistente(_, {_id, pedidoExistente}) {
      return apiClient.put(`/crud/pedidos/${_id}`, pedidoExistente)
      .then(response => {
        return response
      })
    },
    keyCheck(_, {key, cargo}) {
      return apiClient.get(`/cargos/keycheck/?key=${key}&cargo=${cargo}`)
      .then(response => {
        return response
      })
    },
    checkKeyBoth(_, key) {
      return apiClient.get(`/cargos/keycheck_both/?key=${key}`)
      .then(response => {
        return response
      })
    },
    collectData() {
      return apiClient.get(`/collect_data/`, {responseType: 'arraybuffer'})
      .then(response => {
        return response
      })
    }
  },
  getters: {
    getIsAuthenticated: state => state.currentUser.token !== null,
    getPermissions: state => state.permissionsPerRole[state.currentUser.role],
    getCompleteName: state => state.currentUser.nome,
    getFirstLastName: state => `${state.currentUser.nome.split(' ')[0]} ${state.currentUser.nome.split(' ').slice(-1)[0]}`,
    getEmail: state => state.currentUser.email,
    getRole: state => state.currentUser.role,
    getAllRoles: state => state.allRoles,
    getAllUsers: (state, getters) => state.allUsers.length === 0 ? [] : 
    state.allUsers.filter(obj => state.permissionsPerRole[getters.getRole].includes(obj.role) && obj.username !== getters.getEmail),
    getMateriais: state => state.materiaisList,
    getMateriaisList: state => state.materiaisList.length === 0 ? [] : [...state.materiaisList.map(item => item["descricao"])],
    getCanUserDownload: (state, getters) => state.rolesThatCanDownload.includes(getters.getRole),
    getPedidosCurrentUser: state => state.pedidos.filter(obj => obj['email'] === state.currentUser.email),
    getPedidosAtivos: (state, getters) => state.currentUser.role === "regular" ? 
    getters.getPedidosCurrentUser.filter(obj => obj['active'] && obj['statusStep'] !== 6) : 
    state.pedidos.filter(
      obj => obj['active'] && 
      obj['statusStep'] !== 6 && 
      state.stepsForRoles[obj['statusStep']].includes(state.currentUser.role)
      ),
    getPedidosCancelados: (state, getters) => state.currentUser.role === "regular" ? 
    getters.getPedidosCurrentUser.filter(obj => !obj['active']) : 
    state.pedidos.filter(
      obj => !obj['active']
      ),
    getPedidosConcluidos: (state, getters) => state.currentUser.role === "regular" ? 
    getters.getPedidosCurrentUser.filter(obj => obj['statusStep'] === 6) : 
    state.pedidos.filter(
      obj => obj['statusStep'] === 6
      ),
  }
});
