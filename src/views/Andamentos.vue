<template>
        <v-container fluid>

        <v-tabs background-color="grey lighten-4">
            <v-spacer></v-spacer>
            <v-tab class="blue--text" @click="concluidos=false;cancelados=false;ativos=true;">Ativos</v-tab>
            <v-tab class="green--text" @click="cancelados=false;ativos=false;concluidos=true;">Concluídos</v-tab>
            <v-tab class="error--text" @click="concluidos=false;ativos=false;cancelados=true;">Cancelados</v-tab>
            <v-spacer></v-spacer>
        </v-tabs>

        <v-card class="my-4">
            <v-card-title>
                Solicitações em Andamento

                <v-spacer></v-spacer>

                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Pesquisar"
                    single-line
                    hide-details
                ></v-text-field>

            </v-card-title>

            <v-data-table
            :headers="headers"
            :items="pedidos"
            :search="search"
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
                    <v-chip
                        :color="item.color"
                        dark
                        class="my-5"
                    >
                        {{ item.statusStep }}/6
                    </v-chip>
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
            concluidos: false,
            cancelados: false,
            ativos: true,
            snackbar: false,
            snackbarMessage: '',
            snackbarColor: '',
            solicitacaoMessage: "Nenhuma solicitação em andamento.",
            iconMessage: "mdi-emoticon-happy-outline",
            expanded: [],
            search: '',
            page: 0,
            loading: false,
            headers: [
                { text: '', value: 'data-table-expand', sortable: false, groupable: false },
                { text: "N°", value: "number"},
                { text: "Etapa do Pedido", value: "statusStep" },
                { text: "Ordem de Serviço", value: "os"},
                { text: "Nome do Requisitante", value: "requisitante"},
                { text: "Email do Requisitante", value: "email" },
                { text: "Data do Pedido", value: "dataPedido" },
                { text: "Horário do Pedido", value: "horarioPedido"},
                { text: "Valor Estimado", value: "valorDaSolicitacao" },
                { text: "Status do Pedido", value: "status" },
                { text: "Identificador", value: "_id", }
            ]
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
            if (item.statusStep === 5)
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
        }
    },
    mounted() {
        this.logTable();
    },
    computed: {
        pedidos() {
            if (this.ativos)
                return this.$store.getters.getPedidosAtivos;
            else if (this.concluidos)
                return this.$store.getters.getPedidosConcluidos;
            else if (this.cancelados)
                return this.$store.getters.getPedidosCancelados;
            else
                return [];
        }
    }
}
</script>
