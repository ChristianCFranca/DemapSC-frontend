<template>
        <v-container fluid>

        <v-card class="my-4">
            <v-card-title>
                Solicitações de Material
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    outlined
                    append-icon="mdi-magnify"
                    label="Pesquisar por nome do item"
                    clearable
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-card-subtitle v-if="!$vuetify.breakpoint.xs" >
                Use o botão FILTRAR para filtrar os pedidos pendentes, ativos, concluídos e cancelados.
            </v-card-subtitle>

            <v-data-table
            :headers="headers"
            :items="pedidos"
            :items-per-page="15"
            :expanded="expanded"
            item-key="_id"
            class="elevation-1"
            multi-sort
            show-expand
            :loading="loading"
            single-expand
            loading-text="Carregando... Por favor aguarde"
            >
                <template v-slot:[`body.prepend`] v-if="!$vuetify.breakpoint.xs">
                    <tr>
                        <td>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                    color="blue"
                                    v-bind="attrs"
                                    v-on="on"
                                    text
                                    >
                                        <v-icon left>
                                            mdi-filter-menu-outline
                                        </v-icon>
                                        Filtrar
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item link @click="pendentes=false;liberadosAlmoxarife=false;pendentesSimiao=false;ativos=false;concluidos=false;cancelados=false;todos=true">
                                        <v-list-item-title>Todos</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="todos=false;liberadosAlmoxarife=false;ativos=false;concluidos=false;cancelados=false;pendentes=false;pendentesSimiao=true">
                                        <v-list-item-title>Pendentes Cartão Corporativo</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="todos=false;liberadosAlmoxarife=false;pendentesSimiao=false;ativos=false;concluidos=false;cancelados=false;pendentes=true">
                                        <v-list-item-title>Pendentes</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="todos=false;pendentesSimiao=false;ativos=false;concluidos=false;cancelados=false;pendentes=false;liberadosAlmoxarife=true">
                                        <v-list-item-title>Liberados Almoxarifado</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="todos=false;liberadosAlmoxarife=false;pendentesSimiao=false;pendentes=false;concluidos=false;cancelados=false;ativos=true">
                                        <v-list-item-title>Ativos</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="todos=false;liberadosAlmoxarife=false;pendentesSimiao=false;ativos=false;pendentes=false;cancelados=false;concluidos=true">
                                        <v-list-item-title>Concluídos</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="todos=false;liberadosAlmoxarife=false;pendentesSimiao=false;ativos=false;concluidos=false;pendentes=false;cancelados=true">
                                        <v-list-item-title>Cancelados</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c2" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c3" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c4" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c5" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c6" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c7" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c8" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c9" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                        <td>
                            <v-text-field v-model="searches.c10" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                        </td>
                    </tr>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                        <ItemStepper :inputItem="item"/>
                    </td>
                </template>

                <template v-slot:no-data>
                    <h1 class="font-weight-light"> 
                        {{ solicitacaoMessage }} 
                        <v-icon large class="mb-2"> {{ iconMessage }}</v-icon>
                    </h1> 
                </template>

                <template v-slot:[`item._id`]="{ item }">
                    {{ `**${item._id.slice(-4)}` }}
                </template>

                <template v-slot:[`item.valorGastoTotal`]="{ item }">
                    {{ getValorGastoTotal(item) }}
                </template>

                <template v-slot:[`item.valorDaSolicitacao`]="{ item }">
                    {{ Number(item.valorDaSolicitacao).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }}
                    <v-icon 
                    dense 
                    color="red" 
                    v-if="naoCadastradoEliminado(item)">
                        mdi-alert-octagon-outline
                    </v-icon>
                </template>

                <template v-slot:[`item.statusStep`]="{ item }">
                    <v-row class="pl-5">
                        <v-col cols="12">
                            <v-chip
                                :color="checkColor(item)"
                                dark
                                class="my-5">
                                {{ item.statusStep }}/6
                            </v-chip>
                            <!-- <v-icon
                            :color="checkColor(item)"
                            v-if="checkApprovalNecessaryForUser(item)">
                                mdi-exclamation
                            </v-icon> -->
                        </v-col>
                    </v-row>
                </template>

                <template v-slot:[`item.status`]="{ item }">
                        {{waitingItems(item)}}
                </template>
            
            </v-data-table>
        </v-card>
        </v-container>
</template>


<script>
import ItemStepper from "@/components/ItemStepper.vue"

export default {
    components: {
        ItemStepper
    },
    data() {
        return {
            snackbar: false,
            snackbarMessage: '',
            snackbarColor: '',
            solicitacaoMessage: "Nenhuma solicitação em andamento.",
            iconMessage: "mdi-emoticon-happy-outline",
            expanded: [],
            search: '',
            page: 0,
            loading: false,
            searches: {
                c1: '',
                c2: '',
                c3: '',
                c4: '',
                c5: '',
                c6: '',
                c7: '',
                c8: '',
                c9: '',
                c10: ''
            },
            todos: true,
            pendentes: false,
            pendentesSimiao: false,
            liberadosAlmoxarife: false,
            ativos: false,
            concluidos: false,
            cancelados: false
        };
    },
    methods: {
        logTable() {
            this.loading = true;
            this.$store.dispatch('getTodosOsPedidos')
            .then(() => {
                })
            .catch(error => {
                console.log(error);
                this.solicitacaoMessage = "Erro ao comunicar-se com o banco de dados";
                this.iconMessage = "mdi-emoticon-sad-outline";
                if (error.response){
                    this.solicitacaoMessage = "Banco de dados indisponível.";
                    this.iconMessage = "mdi-emoticon-sad-outline";
                } 
                if (error ?.response ?.status === 401){
                    this.solicitacaoMessage = "Você não está autenticado ou não tem permissão para ver essa informação.";
                    this.iconMessage = "mdi-emoticon-sad-outline";
                    this.$store.dispatch('logout')
                }
                })
            .finally(() => {
                this.loading = false;
            })
        },
        waitingItems(item) {
            let text = `${item.status}`
            if (item.statusStep === 5 && item.active)
                text += ` - ${item.items.reduce((acc, current) =>  acc + Boolean(current.recebido) ? 1 : 0, 0)} /  ${item.items.length}`
            return text
        },
        capitalize(value) {
            if (!value) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        getColor(statusStep){
            if (statusStep !== 6){
                return "orange";
            } else {
                return "green";
            }
        },
        getValorGastoTotal(item) {
            if (item.valorGastoTotal !== null && 
                item.valorGastoTotal !== undefined) {
                return Number(item.valorGastoTotal).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
            } else if (!item.active) {
                return Number(0).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
            } else {
                return `-`;
            }
        },
        naoCadastradoEliminado(item) {
            if (item.statusStep <= 3)
                return item.items.some(function(obj){return obj['valorTotal'] === null})
            else{
                return item.items.some(function(obj){return obj['valorTotal'] === null && obj['aprovadoFiscal']})
            }
        },
        checkApprovalNecessaryForUser(pedido) {
            if (pedido.statusStep < 6 && pedido.active)
                if (this.$store.getters.getPseudoApprovalsForRoles[pedido.statusStep].includes(this.$store.getters.getRole))
                    if (this.$store.getters.getRole === "regular" || this.$store.getters.getRole === "assistente")
                        return pedido.items.some(item => item.almoxarifadoPossui || item.direcionamentoDeCompra === "Engemil")
                    else
                        return true
                else
                    return false
            return false
        },
        checkColor(pedido) {
            if (pedido.statusStep === 6)
                return `success`
            else if (!pedido.active)
                return `red`
            else if (this.checkApprovalNecessaryForUser(pedido))
                return `orange darken-1`
            return `blue`
        }
    },
    mounted() {
        this.logTable();
        this.$store.dispatch('getEmpresas')
        .then(() => {})
        .catch(error => {
            console.log(error);
            if (error.response)
                this.$store.commit('SET_SNACKBAR', {message: "Houve problema de conexão com o servidor.", color: "error"});
            })
        .finally(() => {
            this.loadingEmpresas = false;
        })
    },
    computed: {
        headers() {
            return [
                { text: '', value: 'data-table-expand', sortable: false },
                { text: "Etapa do Pedido", value: "statusStep"},
                { text: "N°", value: "number", 
                    filter: value => {
                        if (!this.searches.c2) return true
                        return String(value).toLowerCase().includes(this.searches.c2.toLowerCase())
                    } 
                },
                { text: "Empresa", value: "empresa", 
                    filter: value => {
                        if (!this.searches.c3) return true
                        return String(value).toLowerCase().includes(this.searches.c3.toLowerCase())
                    } 
                },
                { text: "Ordem de Serviço", value: "os", 
                    filter: value => {
                        if (!this.searches.c4) return true
                        return String(value).toLowerCase().includes(this.searches.c4.toLowerCase())
                    } 
                },
                { text: "Nome do Requisitante", value: "requisitante", 
                    filter: value => {
                        if (!this.searches.c5) return true
                        return String(value).toLowerCase().includes(this.searches.c5.toLowerCase())
                    } 
                },
                { text: "Email do Requisitante", value: "email", 
                    filter: value => {
                        if (!this.searches.c6) return true
                        return String(value).toLowerCase().includes(this.searches.c6.toLowerCase())
                    } 
                },
                { text: "Data do Pedido", value: "dataPedido", 
                    filter: value => {
                        if (!this.searches.c7) return true
                        return String(value).toLowerCase().includes(this.searches.c7.toLowerCase())
                    } 
                },
                { text: "Horário do Pedido", value: "horarioPedido", 
                    filter: value => {
                        if (!this.searches.c8) return true
                        return String(value).toLowerCase().includes(this.searches.c8.toLowerCase())
                    } 
                },
                { text: "Status do Pedido", value: "status", 
                    filter: value => {
                        if (!this.searches.c9) return true
                        return String(value).toLowerCase().includes(this.searches.c9.toLowerCase())
                    } 
                },
                { text: "Identificador", value: "_id", 
                    filter: value => {
                        if (!this.searches.c10) return true
                        return String(value).toLowerCase().includes(this.searches.c10.toLowerCase())
                    } 
                }
            ]
        },
        pedidos() {
            let pedidos = []
            if (this.todos)
                pedidos = this.$store.getters.getPedidos;
            else if (this.pendentes)
                pedidos = this.$store.getters.getPedidosPendentes;
            else if (this.pendentesSimiao)
                pedidos = this.$store.getters.getPedidosPendentesSimiao;
            else if (this.ativos)
                pedidos = this.$store.getters.getPedidosAtivos;
            else if (this.concluidos)
                pedidos = this.$store.getters.getPedidosConcluidos;
            else if (this.liberadosAlmoxarife)
                pedidos = this.$store.getters.getPedidosLiberadosAlmox;
            else if (this.cancelados)
                pedidos = this.$store.getters.getPedidosCancelados;

            if (this.search)
                pedidos = pedidos.filter((pedido) => pedido.items.some(item => item.nome ? item.nome.toLowerCase().includes(this.search.toLowerCase()) : false))

            return pedidos
        }
    }
}
</script>
