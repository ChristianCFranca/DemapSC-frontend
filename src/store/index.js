import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import router from '../router';

const apiClient = axios.create({
    //baseURL: 'http://127.0.0.1:8000',
    baseURL: 'https://demapsm-backend.herokuapp.com',
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
      empresa: null,
      email: null,
      token: null,
    },
    empresas: [],
    empresasNeedAssistant: {},
    materiaisList: [],
    pedidos: [],
    allUsers: [],
    quantitativos: null,
    currentPedido: null,
    snackbar: {
      state: false,
      message: "",
      color: "success"
    },
    allRoles: ["admin", "fiscal", "assistente", "almoxarife", "regular"],
    rolesThatCanDownload: ["admin", "fiscal", "assistente"],
    approvalsForRoles: {
      2: ["admin", "assistente", "fiscal"],
      3: ["admin", "fiscal"],
      4: ["admin", "almoxarife"],
      5: ["admin", "fiscal", "assistente", "regular"]
    },
    pseudoApprovalsForRoles: {
      2: ["admin", "assistente"],
      3: ["admin", "fiscal"],
      4: ["admin", "almoxarife"],
      5: ["admin", "fiscal", "regular"]
    },
    cancelForRoles: {
      2: ["admin", "assistente", "fiscal"],
      3: ["admin", "fiscal"],
      4: ["admin", "fiscal"],
      5: ["admin", "fiscal"]
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
      if (userData.empresa) {
        state.currentUser.empresa = userData.empresa;
      }
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
      // Ordenação por data
      if (pedidos)
        state.pedidos = pedidos.sort((a, b) => b.number - a.number);
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
    SET_EMPRESAS(state, empresas) {
      state.empresas = empresas;
      state.empresas.forEach(function (empresa) {
        state.empresasNeedAssistant[empresa.nome] = empresa.requer_assistente;
      })
    },
    SET_CURRENT_QUANTITATIVOS(state, quantitativos) {
      state.quantitativos = quantitativos;
    },
    UNSET_CURRENT_QUANTITATIVOS(state) {
      state.quantitativos = null;
    },  
    UNSET_CURRENT_PEDIDO(state) {
      state.currentPedido = null;
    },
    UPDATE_CURRENT_PEDIDO_BY_ID(state, data) {
      state.currentPedido = {_id: data._id, ...data.pedido};
      state.pedidos.map(pedido => {
        if (pedido._id === data._id)
          pedido.statusStep = state.currentPedido.statusStep;
      })
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
    getMateriais({ commit }, empresa) {
      return apiClient.get(`/crud/materiais/?empresa=${empresa}`)
      .then(response => {
        commit('SET_MATERIAIS', response.data)
      })
    },
    getEmpresas({ commit }) {
      return apiClient.get('/empresas/')
      .then(response => {
        commit('SET_EMPRESAS', response.data)
      })
    },
    getTodosOsPedidos({ commit, getters }) {
      return apiClient.get(`/crud/pedidos/${getters.getCurrentUserEmpresas ? `?empresa=${getters.getCurrentUserEmpresas}` : ``}`)
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
    getPedidoPDFs(_, pdfs_ids) {
      return apiClient.post('/collect-data/pdfs', pdfs_ids)
      .then(response => {
        return response
      })
    },
    getQuantitativosForEmpresa({ commit, dispatch }, dataForQuantitativo) {
      commit('UNSET_CURRENT_QUANTITATIVOS')
      return apiClient.get(`/collect-data/quantitativos?empresa=${dataForQuantitativo.empresa}&mes=${dataForQuantitativo.mes}&ano=${dataForQuantitativo.ano}`)
      .then(response => {
        commit('SET_SNACKBAR', {message: "Quantitativos obtidos com sucesso", color: "success"})
        commit('SET_CURRENT_QUANTITATIVOS', response.data)
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
    reupdatePedidoPDFs({ getters, dispatch }) {
      let pedido = getters.getCurrentPedido;
      return apiClient.put(`/collect-data/redo-pdfs/${pedido['_id']}`, pedido)
      .then(response => {
        console.log(response.data)
        dispatch('getTodosOsPedidos')
        return response
      });
    },
    updateCurrentPedidoDireto({ commit, getters }, temp_idx) {
      let quantidade_temp = temp_idx.temp;
      let idx = temp_idx.idx;
      let {_id, ...pedido} = getters.getCurrentPedido;

      pedido['items'][idx]['quantidade'] = quantidade_temp;
      if (pedido['items'][idx]['valorUnitario'] != null) {
          let valorUnitario = pedido['items'][idx]['valorUnitario'];
          let newValorTotal = valorUnitario * quantidade_temp;
          pedido['items'][idx]['valorTotal'] = newValorTotal;
      }

      return apiClient.put(`/crud/pedidos/direct/${_id}`, pedido)
      .then(() => {
        commit('UPDATE_CURRENT_PEDIDO_BY_ID', {_id: _id, pedido: pedido})
      });
    },
    updateCurrentPedido({ getters, commit, dispatch }) {
      let {_id, ...pedido} = getters.getCurrentPedido;
      const now = new Date().toLocaleString('pt-BR');
      if (pedido.statusStep === 2) {
        pedido.assistente = getters.getCompleteName;
        pedido.emailAssistente = getters.getEmail;
        pedido.dataAprovacaoAssistente = now.split(' ')[0];
        pedido.horarioAprovacaoAssistente = now.split(' ')[1];
        pedido.status = "Aguardando confirmação do(a) fiscal";
        for (let i=0; i < pedido.items.length; i++)
          pedido.items[i].aprovadoFiscal = pedido.items[i].aprovadoAssistente
        let valorDaSolicitacao = 0;
        for (let idx = 0; idx < pedido.items.length; idx++){
          if (pedido.items[idx].valorTotal !== null && pedido.items[idx].aprovadoAssistente) // Tem que ter valor diferente de 0 e estar aprovado pelo assistente
            valorDaSolicitacao += pedido.items[idx].valorTotal;
        }
        pedido.valorDaSolicitacao = valorDaSolicitacao; // Atualizamos o valor total da proposta
        if (pedido.items.every(item => !item.aprovadoAssistente || item.categoria === 'Fixo')) { // Corrige para itens fixos
          pedido.status = "Aguardando aquisição dos itens";
          pedido.statusStep = 4;
        }
      }
      else if (pedido.statusStep === 3) {
        pedido.fiscal = getters.getCompleteName;
        pedido.emailFiscal = getters.getEmail;
        pedido.dataAprovacaoFiscal = now.split(' ')[0];
        pedido.horarioAprovacaoFiscal = now.split(' ')[1];
        pedido.status = "Aguardando confirmação da DILOG";
        for (let i=0; i < pedido.items.length; i++){
            if (pedido.items[i].aprovadoFiscal){
                pedido.items[i].motivoFiscal = null;
            }
        }
        let valorDaSolicitacao = 0;
        for (let idx = 0; idx < pedido.items.length; idx++){
            if (pedido.items[idx].valorTotal !== null && pedido.items[idx].aprovadoFiscal) // Tem que ter valor diferente de 0 e estar aprovado pelo fiscal
                valorDaSolicitacao += pedido.items[idx].valorTotal;
        }
        pedido.valorDaSolicitacao = valorDaSolicitacao; // Atualizamos o valor total da proposta
        if (pedido.items.every(item => !item.aprovadoFiscal || item.categoria === 'Fixo')) { // Corrige para itens fixos
          pedido.status = "Aguardando aquisição dos itens";
          pedido.statusStep = 4;
        }
      }
      else if (pedido.statusStep === 4) {
        pedido.almoxarife = getters.getCompleteName;
        pedido.emailAlmoxarife = getters.getEmail;
        pedido.dataAprovacaoAlmoxarife = now.split(' ')[0];
        pedido.horarioAprovacaoAlmoxarife = now.split(' ')[1];
        pedido.status = "Aguardando aquisição dos itens";
      }
      pedido.statusStep += 1;
      return apiClient.put(`/crud/pedidos/${_id}`, pedido)
      .then(() => {
        commit('SET_SNACKBAR', {message: "Pedido atualizado com sucesso", color: "success"})
        commit('UPDATE_CURRENT_PEDIDO_BY_ID', {_id: _id, pedido: pedido})
      })
      .catch(error => {
        console.log(error);
        if (error?.response?.status === 401) {
          commit('SET_SNACKBAR', {message: "Usuário não autenticado ou não possui permissão", color: "error"})
          dispatch('logout')
        }
        else if (error?.response?.data?.detail)
          commit('SET_SNACKBAR', {message: error.response.data.detail, color: "error"})
        else if (error?.response?.data)
          commit('SET_SNACKBAR', {message: error.response.data, color: "error"})
        else
          commit('SET_SNACKBAR', {message: "Erro de comunicação com o servidor", color: "error"})
      });
    },
    finishCurrentPedido({ state, getters, commit, dispatch}, idx) {
      let currentPedido = JSON.parse(JSON.stringify(state.currentPedido)) // Deep copy
      let {_id, ...pedido} = currentPedido;
      let email = false;
      const now = new Date().toLocaleString('pt-BR');
      let message = "Aquisição registrada com sucesso"
      pedido.items[idx].recebido = true;
      pedido.items[idx].recebimento = getters.getCompleteName;
      pedido.items[idx].emailRecebimento = getters.getEmail;

      if (pedido.items.every(item => item.recebido || !item.aprovadoFiscal)) {
        email = true;
        pedido.dataFinalizacao = now.split(' ')[0];
        pedido.horarioFinalizacao = now.split(' ')[1];
        pedido.status = "Solicitação finalizada";
        let valorGastoTotal = 0; // O v-text-currency ja valida como um float
        for (let idx = 0; idx < pedido.items.length; idx++) {
            if (pedido.items[idx].valorGasto !== null && // Tem que ter valor diferente de null
                !pedido.items[idx].almoxarifadoPossui &&// Almoxarifado NÃO deve possuir
                pedido.items[idx].aprovadoFiscal)  // Fiscal deve ter aprovado
                valorGastoTotal += pedido.items[idx].valorGasto;
        }
        pedido.valorGastoTotal = valorGastoTotal; // Atualizamos o valor gasto total da proposta
        pedido.statusStep += 1;

        message = "Pedido finalizado com sucesso"
      }
      return apiClient.put(`/crud/pedidos/${_id}?email=${email}`, pedido)
      .then(() => {
        commit('SET_SNACKBAR', {message: message, color: "success"})
        commit('UPDATE_CURRENT_PEDIDO_BY_ID', {_id: _id, pedido: pedido})
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
    cancelCurrentPedido({ commit, dispatch, getters }) {
      let {_id, ...pedido} = getters.getCurrentPedido;
      const now = new Date().toLocaleString('pt-BR');

      pedido.active = false;
      pedido.status = `Solicitação cancelada`;
      for (let idx = 0; idx < pedido.items.length; idx++) {
          pedido.items[idx].aprovadoAssistente = false;
          pedido.items[idx].aprovadoFiscal = false;
      }
      pedido.canceladoPor = getters.getCompleteName;
      pedido.dataCancelamento = now.split(' ')[0];
      pedido.horarioCancelamento = now.split(' ')[1];

      return apiClient.put(`/crud/pedidos/${_id}`, pedido)
      .then(() => {
        commit('SET_SNACKBAR', {message: "Pedido cancelado com sucesso", color: "success"})
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
    collectData(_, rota) {
      return apiClient.get(`/collect-data/${rota}`, {responseType: 'arraybuffer'})
      .then(response => {
        return response
      })
    },
    getFaturamento(_, faturamentoInfo) {
      return apiClient.post(`/faturamentos`, faturamentoInfo)
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
    getCurrentUserEmpresas: state => state.currentUser.empresa,
    getAllEmpresas: state => state.empresas,
    getAllEmpresasNames: state => state.empresas.map(value => value.nome),
    getNeedAssistant: state => state.empresasNeedAssistant,
    getCurrentPedido: state => state.currentPedido,
    getApprovalsForRoles: state => state.approvalsForRoles,
    getPseudoApprovalsForRoles: state => state.pseudoApprovalsForRoles,
    getCancelForRoles: state => state.cancelForRoles,
    getFirstLastName: state => `${state.currentUser.nome.split(' ')[0]} ${state.currentUser.nome.split(' ').slice(-1)[0]}`,
    getEmail: state => state.currentUser.email,
    getRole: state => state.currentUser.role,
    getAllRoles: state => state.allRoles,
    getAllUsers: (state, getters) => state.allUsers.length === 0 ? [] : 
    state.allUsers.filter(obj => state.permissionsPerRole[getters.getRole].includes(obj.role) && obj.username !== getters.getEmail),
    getCurrentQuantitativos: state => state.quantitativos,
    getSnackbar: state => state.snackbar,
    getMateriais: state => state.materiaisList,
    getMateriaisList: state => state.materiaisList.length === 0 ? [] : [...state.materiaisList.map(item => item["descricao"])],
    getCanUserDownload: (state, getters) => state.rolesThatCanDownload.includes(getters.getRole),
    getPedidosForCurrentUser: state => state.pedidos.filter(obj => obj['email'] === state.currentUser.email),
    getPedidos: state => state.pedidos,
    getPedidosAtivos: state => state.pedidos.filter(obj => obj.active && obj.statusStep !== 6),
    getPedidosPendentes: (_, getters) => getters.getPedidosAtivos.filter(pedido => getters.getPseudoApprovalsForRoles[pedido.statusStep].includes(getters.getRole)),
    getPedidosPendentesSimiao: (_, getters) => getters.getPedidosAtivos.filter(pedido => pedido.statusStep === 5 && pedido.active && pedido.items.some(item => item.direcionamentoDeCompra === "Demap" && !item.almoxarifadoPossui && !item.recebido)),
    getPedidosCancelados: state => state.pedidos.filter(obj => !obj['active']),
    getPedidosConcluidos: state => state.pedidos.filter(obj => obj['statusStep'] === 6)
  }
});
