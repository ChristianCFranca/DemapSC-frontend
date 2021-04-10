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
                                        Solicitação realizada
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="2" :complete="item.statusStep > 2" color="orange">
                                        {{ getMessage(2, item) }}
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="3" :complete="item.statusStep > 3">
                                        {{ getMessage(3, item) }}
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="4" :complete="item.statusStep > 4">
                                        {{ getMessage(4, item) }}
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="5" :complete="item.statusStep > 5">
                                        {{ getMessage(5, item) }}
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step step="6" :complete="item.statusStep === 6">
                                        Solicitação finalizada
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
                                        <div v-for="(it, idx) in item.items" :key="idx">
                                            <v-row>
                                                <v-col 
                                                cols="12"
                                                sm="4"
                                                md="4">
                                                    <v-list>
                                                        <v-list-item>
                                                            <v-list-item-content>
                                                                <v-list-item-subtitle>
                                                                    Item
                                                                </v-list-item-subtitle>
                                                                <h3>{{ it.nome }}</h3>
                                                                <v-list-item-subtitle class="mt-6">
                                                                    Finalidade
                                                                </v-list-item-subtitle>
                                                                <p class="text-justify body-1">
                                                                    {{ it.finalidade }}
                                                                </p>
                                                                <v-list-item-subtitle class="mt-6">
                                                                    Quantidade
                                                                </v-list-item-subtitle>
                                                                <v-list-item-title>
                                                                    {{ it.quantidade }}
                                                                </v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-col>

                                                <v-col 
                                                cols="12"
                                                sm="5"
                                                md="5">
                                                    <v-list>
                                                        <v-list-item>
                                                            <v-list-item-content>
                                                                <v-list-item-subtitle>
                                                                    Descrição
                                                                </v-list-item-subtitle>
                                                                <p class="text-justify body-1">
                                                                    {{ it.descricao }}
                                                                </p>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-col>

                                                <v-col 
                                                cols="12"
                                                sm="3"
                                                md="3">
                                                    <v-row justify="center">
                                                        <v-switch v-model="it.aprovadoGerencia" 
                                                        label="Aprovado" 
                                                        color="success"></v-switch>
                                                    </v-row>

                                                    <v-textarea
                                                        v-model="it.motivoGerencia"
                                                        label="Descrição do motivo"
                                                        max-height="150"
                                                        :counter="200"
                                                        clearable
                                                        outlined
                                                        v-if="!it.aprovadoGerencia"
                                                    ></v-textarea>
                                                </v-col>
                                            </v-row>
                                            <v-divider class="my-4"></v-divider>
                                        </div>
                                        <v-row no-gutters justify="center">
                                            <v-col cols="2" align="center">
                                                <h2>Chave de Identificação:</h2>
                                                <v-text-field
                                                    class="mt-4"
                                                    rows="1"
                                                    required
                                                    shaped
                                                    outlined
                                                    clearable
                                                    prepend-inner-icon="mdi-key"
                                                    type="password"
                                                ></v-text-field>
                                                <v-btn
                                                dark
                                                color="blue darken-1"
                                                class="mb-8">
                                                    Enviar Aprovação
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-stepper-content>

                                    <v-stepper-content step="3">
                                        <v-card
                                        class="mb-12"
                                        color="grey lighten-1"
                                        height="200px"
                                        ></v-card>
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
                        <v-chip
                            :color="getColor(item.statusStep)"
                            dark
                        >
                            {{ item.statusStep }}/6
                        </v-chip>
                    </template>
                
                </v-data-table>

            </v-card>
        </v-card>
        </v-container>
</template>


<script>
import axios from 'axios';

export default {
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
                {concluido: "Item(s) obtido(s)", andamento: "Aguardando obtenção do(s) item(s)."}
            ],
            apiURL: '//localhost:8000/crud/pedidos/'
        };
    },
    methods: {
        gerarAprovacoesGerencia(array_data) {
            
            for (let i = 0; i < array_data.length; i++) {
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
