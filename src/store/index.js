import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import router from '../router';

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
    tokenRemainingSeconds: null,
    currentUser: {
      nome: null,
      role: null,
      email: null,
      token: null,
    },
    materiaisList: [],
    pedidos: [],
    allUsers: [],
    currentPedido: null,
    snackbar: {
      state: false,
      message: "",
      color: "success"
    },
    allRoles: ["admin", "fiscal", "assistente", "almoxarife", "regular"],
    rolesThatCanDownload: ["admin", "fiscal", "assistente"],
    approvalsForRoles: {
      2: ["admin", "assistente"],
      3: ["admin", "fiscal"],
      4: ["admin", "almoxarife"],
      5: ["admin", "fiscal", "assistente", "regular"]
    },
    showingForRoles: { // Regular não aparece pois ele pode ver tudo porém apenas dele
      2: ["admin", "fiscal", "assistente"],
      3: ["admin", "fiscal"],
      4: ["admin", "almoxarife"],
      5: ["admin", "fiscal"],
      6: ["admin", "fiscal", "assistente"]
    },
    permissionsPerRole: {
      "admin": ["admin", "fiscal", "assistente", "almoxarife", "regular"],
      "fiscal": ["fiscal", "assistente", "almoxarife", "regular"],
      "assistente": ["regular"],
      "almoxarife": [],
      "regular": []
    }
  },
  mutations: {
    ENGAGE_TOKEN_COUNTDOWN(state) {
      const originalTokenTime = localStorage.getItem('tokenOriginalTime');
      state.tokenRemainingSeconds = 24*60*60 - Math.trunc((new Date().getTime() - originalTokenTime)/1000); // 24*60 minutos menos o tempo passado
      setInterval(function () {
        if (state.tokenRemainingSeconds)
          state.tokenRemainingSeconds--;
      }, 1000)
    },
    SET_AUTHENTICATION_DATA(state, userData) {
      state.currentUser.nome = userData.nome_completo;
      state.currentUser.role = userData.role;
      state.currentUser.email = userData.username;
      state.currentUser.token = userData.access_token;
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
      localStorage.setItem('user', JSON.stringify(userData));
      if (!localStorage.getItem('tokenOriginalTime'))
        localStorage.setItem('tokenOriginalTime', JSON.stringify(new Date().getTime()));
    },
    SET_ALL_USERS(state, users) {
      state.allUsers = users;
    },
    SET_MATERIAIS(state, materiais) {
      state.materiaisList = materiais;
    },
    SET_TODOS_OS_PEDIDOS(state, pedidos){
      if (pedidos)
        state.pedidos = pedidos.reverse();
    },
    USER_CLEAR_DATA() {
      localStorage.removeItem('user');
      localStorage.removeItem('tokenOriginalTime');
      location.reload(); // Força um refresh da página, destruindo o estado do vuex
    },
    SET_SNACKBAR(state, snackbarData) {
      state.snackbar.state = true;
      state.snackbar.message = snackbarData.message;
      state.snackbar.color = snackbarData.color;
    },
    UNSET_SNACKBAR(state) {
      state.snackbar.state = false;
      state.snackbar.message = "";
      state.snackbar.color = "";
    },
    SET_CURRENT_PEDIDO(state, pedido) {
      state.currentPedido = pedido;
    },
    UNSET_CURRENT_PEDIDO(state) {
      state.currentPedido = null;
    }
  },
  actions: {
    authenticate({ commit }, credentials) {
      return apiClient.post('/auth/token', credentials)
      .then(response => {
        commit('SET_AUTHENTICATION_DATA', response.data)
        commit('ENGAGE_TOKEN_COUNTDOWN')
        router.push({name: 'andamentos'});
        return response
      })
    },
    logout({ commit }) {
      commit('USER_CLEAR_DATA')
    },
    requestNewPassword(_, username) {
      return apiClient.get(`/auth/users/password/request?username=${username}`)
      .then(response => response)
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
    deleteUser(_, username) {
      return apiClient.delete(`/auth/users/delete/?username=${username}`)
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
    updateCurrentPedido({ state, getters, commit, dispatch }) {
      let {_id, ...pedido} = state.currentPedido;
      const now = new Date().toLocaleString('pt-BR');

      if (pedido.statusStep === 2) {
        pedido.assistente = getters.getCompleteName;
        pedido.emailAssistente = getters.getEmail;
        pedido.dataAprovacaoAssistente = now.split(' ')[0];
        pedido.horarioAprovacaoAssistente = now.split(' ')[1];
        pedido.status = "Aguardando confirmação do(a) fiscal";
        for (let i=0; i < pedido.items.length; i++){
          pedido.items[i].aprovadoFiscal = pedido.items[i].aprovadoAssistente
          pedido.items[i].motivoFiscal = pedido.items[i].motivoAssistente
        }
        let valorDaSolicitacao = 0;
        for (let idx = 0; idx < pedido.items.length; idx++){
          if (pedido.items[idx].valorTotal !== null && pedido.items[idx].aprovadoAssistente) // Tem que ter valor diferente de 0 e estar aprovado pelo assistente
            valorDaSolicitacao += pedido.items[idx].valorTotal;
        }
        pedido.valorDaSolicitacao = valorDaSolicitacao; // Atualizamos o valor total da proposta
      }
      else if (pedido.statusStep === 3) {
        console.log("step 3")
      }
      else if (pedido.statusStep === 4) {
        console.log("step 4")
      }
      else if (pedido.statusStep === 5) {
        console.log("step 5")
      }
      pedido.statusStep += 1;

      apiClient.put(`/crud/pedidos/${_id}`, pedido)
      .then(() => {
        commit('SET_SNACKBAR', {message: "Pedido atualizado com sucesso", color: "success"})
        dispatch('getTodosOsPedidos')
      })
      .catch(error => {
        console.log(error);
        if (error?.response?.status === 401) {
          commit('SET_SNACKBAR', {message: "Usuário não autenticado ou não possui permissão", color: "error"})
          dispatch('logout')
        }
        else if (error?.response)
          commit('SET_SNACKBAR', {message: error.response, color: "error"})
        else
          commit('SET_SNACKBAR', {message: "Erro de comunicação com o servidor", color: "error"})
      });
    },
    cancelCurrentPedido() {
      console.log("Cancelamento...")
    },
    collectData(_, rota) {
      return apiClient.get(`/collect-data/${rota}`, {responseType: 'arraybuffer'})
      .then(response => {
        return response
      })
    }
  },
  getters: {
    getSessaoRestante: state => state.tokenRemainingSeconds,
    getIsAuthenticated: state => state.currentUser.token !== null,
    getPermissions: state => state.permissionsPerRole[state.currentUser.role],
    getCompleteName: state => state.currentUser.nome,
    getCurrentPedido: state => state.currentPedido,
    getApprovalsForRoles: state => state.approvalsForRoles,
    getFirstLastName: state => `${state.currentUser.nome.split(' ')[0]} ${state.currentUser.nome.split(' ').slice(-1)[0]}`,
    getEmail: state => state.currentUser.email,
    getRole: state => state.currentUser.role,
    getAllRoles: state => state.allRoles,
    getAllUsers: (state, getters) => state.allUsers.length === 0 ? [] : 
    state.allUsers.filter(obj => state.permissionsPerRole[getters.getRole].includes(obj.role) && obj.username !== getters.getEmail),
    getSnackbar: state => state.snackbar,
    getMateriais: state => state.materiaisList,
    getMateriaisList: state => state.materiaisList.length === 0 ? [] : [...state.materiaisList.map(item => item["descricao"])],
    getCanUserDownload: (state, getters) => state.rolesThatCanDownload.includes(getters.getRole),
    getPedidosForCurrentUser: state => state.pedidos.filter(obj => obj['email'] === state.currentUser.email),
    getPedidosAtivos: (state, getters) => state.currentUser.role === "regular" ? 
    getters.getPedidosForCurrentUser.filter(obj => obj['active'] && obj['statusStep'] !== 6) : 
    state.pedidos.filter(
      obj => obj['active'] && 
      obj['statusStep'] !== 6 && 
      state.showingForRoles[obj['statusStep']].includes(state.currentUser.role)
      ),
    getPedidosCancelados: (state, getters) => state.currentUser.role === "regular" ? 
    getters.getPedidosForCurrentUser.filter(obj => !obj['active']) : 
    state.pedidos.filter(
      obj => !obj['active']
      ),
    getPedidosConcluidos: (state, getters) => state.currentUser.role === "regular" ? 
    getters.getPedidosForCurrentUser.filter(obj => obj['statusStep'] === 6) : 
    state.pedidos.filter(
      obj => obj['statusStep'] === 6
      ),
  }
});
