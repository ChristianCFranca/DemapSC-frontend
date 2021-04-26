import axios from 'axios'

const apiClient = axios.create({
    // baseURL: '//localhost:8000',
    baseURL: '//demapsm-backend.herokuapp.com',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    authenticate(userData) {
        return apiClient.post('//localhost:8000/auth/token', userData)
    },
    postNovoUsuario(newUserData) {
        return apiClient.post('//localhost:8000/auth/users/create/', newUserData)
    },
    postNovoPedido(novoPedido) {
        return apiClient.post('/crud/pedidos/', novoPedido)
    },
    getTodosPedidos() {
        return apiClient.get('/crud/pedidos/')
    },
    putPedidoExistente(_id, pedidoExistente) {
        return apiClient.put(`/crud/pedidos/${_id}`, pedidoExistente)
    },
    getMateriais() {
        return apiClient.get('/crud/materiais/')
    },
    keyCheck(key, cargo) {
        return apiClient.get(`/cargos/keycheck/?key=${key}&cargo=${cargo}`)
    },
    checkKeyBoth(key) {
        return apiClient.get(`/cargos/keycheck_both/?key=${key}`)
    },
    collectData() {
        return apiClient.get(`/collect_data/`, {responseType: 'arraybuffer'})
    }
}