<template>
    <div>
        <!-- <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
                <v-card-title class="headline">Tem certeza que deseja cancelar essa solicitação?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = !dialogDelete">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="updateItemStep(true)" :loading="loadingDeleteBtn">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

        <div v-for="(it, idx) in inputItem.items" :key="idx">
            <div v-if="it.aprovadoFiscal">
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
                                        <div>Categoria</div>
                                    </v-list-item-subtitle>
                                    <p :class="`text-justify body-1 ${(it.categoria === `Fixo`) ? `red--text`: ``}`">
                                        <v-icon 
                                        dense 
                                        :color="(it.categoria !== `Sob Demanda`) ? `red`: ``"  v-if="(it.categoria !== `Sob Demanda`)">
                                            mdi-alert-octagon-outline
                                        </v-icon>
                                        {{ it.categoria }}
                                    </p>
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
                                        {{ `${it.quantidade} ${it.unidade}`}}
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
                            <v-switch 
                            inset
                            v-model="it.almoxarifadoPossui"
                            :label="it.almoxarifadoPossui ? `Possui em estoque`: `Não possui em estoque`" 
                            color="blue"
                            class="mt-15"
                            :disabled="!inputItem.active"></v-switch>
                        </v-row>
                    </v-col>
                </v-row>
                <v-divider class="my-4"></v-divider>
            </div>
        </div>
        <v-row no-gutters justify="center">
            <v-col cols="12" xs="12" sm="6" md="5" align="center">
                <div v-if="inputItem.active">
                    <h2>Chave de Identificação do(a) almoxarife:</h2>
                    <v-col cols="12" xs="12" sm="12" md="6" align="center">
                        <v-text-field
                            v-model="key"
                            class="mt-4"
                            rows="1"
                            required
                            shaped
                            outlined
                            clearable
                            prepend-inner-icon="mdi-key"
                            type="password"
                        ></v-text-field>

                        <h2 class="font-weight-light red--text" v-if="error">{{errorMessage}}</h2> 
                        
                    </v-col>    

                    <v-col>
                        <v-btn
                        dark
                        color="blue darken-1"
                        :loading="loadingBtnSend"
                        @click="keyCheck(`send`)">
                            Enviar Confirmação
                        </v-btn>
                    </v-col>
                    <!-- <v-col>
                        <v-btn
                        dark
                        text
                        color="red"
                        :loading="loadingBtnCancel"
                        @click="keyCheck(`cancel`)">
                            Cancelar Solicitação
                        </v-btn>
                    </v-col> -->
                </div>
                <!-- <div v-else>
                    <h3 class="font-weight-light red--text">{{inputItem.dataCancelamento}}</h3>
                    <h1 class="font-weight-regular red--text">Solicitação cancelada pelo(a) almoxarife</h1>
                    <v-icon
                    x-large
                    color="red"
                    >mdi-cancel</v-icon>
                </div> -->
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            error: false,
            errorMessage: "Chave inválida",
            key: '',
            loadingBtnSend: false,
            loadingBtnCancel: false,
            loadingDeleteBtn: false,
            dialogDelete: false,
            apiPedidos: "https://demapsm-backend.herokuapp.com/crud/pedidos",
            apiCargo: "https://demapsm-backend.herokuapp.com/cargos",
            // apiCargo: "//localhost:8000/cargos",
            response: null,
        }
    },
    props: {
        inputItem: Object
    },
    methods: {
        /* eslint-disable no-unused-vars */
        updateItemStep(){
            let message = "Solicitação atualizado com sucesso";
            let {_id, ...inputItem} = this.inputItem; // Removemos o id para que ele não seja visto no json de alteração

            inputItem['statusStep'] += 1;
            inputItem['status'] = "Aguardando aquisição dos itens"
            inputItem['color'] = "teal darken-1";
            
            axios.put(`${this.apiPedidos}/${this.inputItem._id}`, inputItem)
            .then(response => {
                this.loadingBtnSend = false;
                this.dialogDelete = false;
                this.loadingDeleteBtn = false;

                this.$emit('itemCRUD', message); 
                return response
                })
            .catch(error => {
                this.loadingBtnSend = false;
                console.log(error);
                this.$emit('itemCRUDError', error.response);
                });
        },
        /* eslint-disable no-unused-vars */
        keyCheck(btn){
            const cargo = 2; // almoxarife             
            this.error = false;
            this.loadingBtnSend = true;

            axios.get(`${this.apiCargo}/keycheck/?key=${this.key}&cargo=${cargo}`)
            .then(response => {
                this.response = response.data;
                if (this.response['valid']) {
                    // console.log(`Valid key for cargo ${cargo}!!`);
                    this.updateItemStep();
                }
                else {
                    this.loadingBtnSend = false;
                    this.errorMessage = "Chave inválida";
                    this.error = true;
                    // console.log(`Invalid key for cargo ${cargo}!!`);                
                }
                })
            .catch(error => {
                console.log(error);
                this.errorMessage = "Ocorreu um erro no servidor";
                this.error = true;
                })
            
        },
        logValue(value) {
            console.log(value)
        }
    }
}

</script>