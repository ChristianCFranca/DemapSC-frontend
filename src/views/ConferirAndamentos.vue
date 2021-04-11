<template>
        <v-container>
        <v-card class="ma-4">
            <v-card>

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
                item-key="_id"
                class="elevation-1"
                multi-sort
                show-expand
                :loading="loading"
                loading-text="Carregando... Por favor aguarde"
                >
                    
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length">
                            
                            <v-stepper alt-labels class="my-4" :value="item.statusStep">
                                <v-stepper-header>
                                    <v-stepper-step step="1" :complete="item.statusStep > 1" color="success">
                                        <h4 class="text-center font-weight-regular">Solicitação realizada</h4> 
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="2" :complete="item.statusStep > 2" color="orange">
                                        <h4 class="text-center font-weight-regular">{{ getMessage(2, item) }}</h4> 
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="3" :complete="item.statusStep > 3">
                                        <h4 class="text-center font-weight-regular">{{ getMessage(3, item) }}</h4> 
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="4" :complete="item.statusStep > 4">
                                        <h4 class="text-center font-weight-regular">{{ getMessage(4, item) }}</h4> 
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="5" :complete="item.statusStep > 5">
                                        <h4 class="text-center font-weight-regular">{{ getMessage(5, item) }}</h4> 
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="6" :complete="item.statusStep === 6">
                                        <h4 class="text-center font-weight-regular">Solicitação finalizada</h4> 
                                    </v-stepper-step>
                                </v-stepper-header>

                                <v-stepper-items>
                                    <v-stepper-content step="1">
                                        <v-card
                                        class="mb-12"
                                        color="grey lighten-1"
                                        height="200px"
                                        ></v-card>
                                    </v-stepper-content>

                                    <v-stepper-content step="2">
                                        <Step2and3 :inputItem="item" :usuario="`gerente`"/>
                                    </v-stepper-content>

                                    <v-stepper-content step="3">
                                        <Step2and3 :inputItem="item" :usuario="`servidor(a)`"/>
                                    </v-stepper-content>

                                    <v-stepper-content step="4">
                                        <v-card
                                        class="mb-12"
                                        color="grey lighten-1"
                                        height="200px"
                                        ></v-card>
                                    </v-stepper-content>

                                    <v-stepper-content step="5">
                                        <v-card
                                        class="mb-12"
                                        color="grey lighten-1"
                                        height="200px"
                                        ></v-card>
                                    </v-stepper-content>

                                    <v-stepper-content step="6">
                                        <v-card
                                        class="mb-12"
                                        color="grey lighten-1"
                                        height="200px"
                                        ></v-card>
                                    </v-stepper-content>
                                    
                                </v-stepper-items>
                                
                            </v-stepper>
                            
                        </td>
                    </template>
                    

                    <template v-slot:no-data>
                        <h1 class="font-weight-light"> {{ solicitacaoMessage }} <v-icon large class="mb-2"> {{ iconMessage }}</v-icon></h1> 
                    </template>

                    <template v-slot:[`item.statusStep`]="{ item }">
                        <h5 class="body-2 my-5">
                        <v-chip
                            :color="getColor(item.statusStep)"
                            dark
                        >
                            {{ item.statusStep }}/6
                        </v-chip>
                        {{item.status}}
                        </h5>
                    </template>
                
                </v-data-table>

            </v-card>
        </v-card>
        </v-container>
</template>


<script>
import axios from 'axios';
import Step2and3 from "@/components/steps/Step2and3.vue"

export default {
    components: {
        Step2and3
    },
    data() {
        return {
            solicitacaoMessage: "Nenhuma solicitação em andamento.",
            iconMessage: "mdi-emoticon-happy-outline",
            expanded: [],
            search: '',
            page: 0,
            loading: true,
            headers: [
                { text: "Número da Ordem de Serviço", value: "os", sortable: false, groupable: false },
                { text: "Quantidade de Itens", value: "quantidade" },
                { text: "Nome do Requisitante", value: "requisitante" },
                { text: "Email do Requisitante", value: "email" },
                { text: "Data do Pedido", value: "dataPedido" },
                { text: "Status do Pedido", value: "statusStep" },
                { text: '', value: 'data-table-expand', sortable: false, groupable: false }
            ],
            pedidos: [],
            messageMapping: [
                {concluido: "Confirmado pelo(a) gerente", andamento: "Aguardando confirmação do(a) gerente"},
                {concluido: "Confirmado pelo(a) servidor(a)", andamento: "Aguardando confirmação do(a) servidor(a)"},
                {concluido: "Confirmado pelo(a) almoxarife", andamento: "Aguardando confirmação do(a) almoxarife"},
                {concluido: "Item(s) obtido(s)", andamento: "Aguardando obtenção do(s) item(s)"}
            ],
            // apiURL: '//localhost:8000/crud/pedidos/',
            apiURL: '//demapsm-backend.herokuapp.com/crud/pedidos/'
        };
    },
    methods: {
        gerarAprovacoesGerencia(array_data) {
            for (let i = 0; i < array_data.length; i++) {
                array_data[i]['keyGerencia'] = '';
                for (let j = 0; j < array_data[i].items.length; j++){
                    array_data[i].items[j]['aprovadoGerencia'] = true;
                    array_data[i].items[j]['motivoGerencia'] = null;
                }
            }
            return array_data
        },
        logTable() {
            this.loading = true;
            axios.get(`${this.apiURL}`)
            .then(response => {
                this.pedidos = this.gerarAprovacoesGerencia(response.data)
                this.loading = false;
                this.gerarAprovacoesGerencia(response.data);
                })
            .catch(error => {
                if (error.response === undefined){
                    this.solicitacaoMessage = "Banco de dados indisponível."
                    this.iconMessage = "mdi-emoticon-sad-outline"
                }
                else {
                    this.solicitacaoMessage = "Nenhuma solicitação em andamento."
                    this.iconMessage = "mdi-emoticon-happy-outline"
                }

                console.log(error); 
                this.loading = false; 
                });
        },
        capitalize(value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
        getMessage(step, item){
            if (item.statusStep > step)
                return this.messageMapping[step-2].concluido
            else
                return this.messageMapping[step-2].andamento
        },
        getColor(statusStep){
            if (statusStep !== 6){
                return "orange"
            } else {
                return "green"
            }
        },
        logData(value) {
            console.log("Logged Value: ", value)
        }
    },
    mounted() {
        this.logTable();
    }
}
</script>
