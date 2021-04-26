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
                                    <p :class="`text-justify body-1 ${(it.categoria === `Sob Demanda`) ? ``: `red--text`}`">
                                        <v-icon 
                                        dense 
                                        :color="(it.categoria === `Sob Demanda`) ? ``: `red`" 
                                        v-if="(it.categoria !== `Sob Demanda`)">mdi-alert-octagon-outline</v-icon>
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
                            <v-row>
                                <v-col cols="12" xs="12" sm="6">
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                                Valor unitário de referência
                                            </v-list-item-subtitle>
                                            <p :class="`font-weight-light text-h5 ${(it.valorUnitario === null) ? `red--text` : ``}`">
                                                {{ getValorMonetario(it.valorUnitario) }}
                                            </p>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col cols="12" xs="12" sm="6" v-if="it.valorTotal !== null && it.valorTotal !== undefined">
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                                Valor total estimado
                                            </v-list-item-subtitle>
                                            <p class="font-weight-light text-h4">
                                                {{ getValorMonetario(it.valorTotal) }}
                                            </p>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                            </v-row>
                        </v-list>
                    </v-col>

                    <v-col 
                    cols="12"
                    sm="3"
                    md="3"
                    v-if="cargoCorreto || !inputItem.active">
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
                <div v-if="inputItem.active && cargoCorreto">
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
                        @click="keyCheck()">
                            Enviar Confirmação
                        </v-btn>
                    </v-col>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            expectedRoles: ['almoxarife', 'admin'],
            error: false,
            errorMessage: "Chave inválida",
            key: '',
            loadingBtnSend: false,
            loadingBtnCancel: false,
            loadingDeleteBtn: false,
            dialogDelete: false,
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

            const now = new Date().toLocaleString('pt-BR');

            inputItem['statusStep'] += 1;
            inputItem['status'] = "Aguardando aquisição dos itens";
            inputItem['dataAprovacaoAlmoxarife'] = now.split(' ')[0];
            inputItem['horarioAprovacaoAlmoxarife'] = now.split(' ')[1];
            inputItem['color'] = "teal darken-1";
            let valorDaSolicitacao = 0;
            for (let idx = 0; idx < inputItem.items.length; idx++){
                if (inputItem.items[idx].valorTotal !== null && !inputItem.items[idx].almoxarifadoPossui) // Tem que ter valor diferente de 0 e almoxarifado NÃO possuir
                    valorDaSolicitacao += inputItem.items[idx].valorTotal;
            }
            inputItem.valorDaSolicitacao = valorDaSolicitacao; // Atualizamos o valor total da proposta
            
            this.$store.dispatch('putPedidoExistente', {_id: _id, pedidoExistente: inputItem})
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
                if (error.response){
                    if (error.response.status === 401)
                        this.$emit('itemCRUDError', "Usuário não autenticado ou não possui permissão");
                    else
                        this.$emit('itemCRUDError', error.response);
                } else {
                    this.$emit('itemCRUDError', "Erro de comunicação com o servidor");
                }
                });
        },
        /* eslint-disable no-unused-vars */
        keyCheck(){
            const cargo = 2; // almoxarife             
            this.error = false;
            this.loadingBtnSend = true;

            this.$store.dispatch('keyCheck', {key: this.key, cargo: cargo})
            .then(response => {
                this.response = response.data;
                if (this.response['valid']) {
                    this.updateItemStep();
                }
                else {
                    this.loadingBtnSend = false;
                    this.errorMessage = "Chave inválida";
                    this.error = true;              
                }
                })
            .catch(error => {
                console.log(error);
                this.errorMessage = "Ocorreu um erro no servidor";
                this.error = true;
                })
            
        },
        getValorMonetario(valor){
            if (valor !== null && valor !== null) {
                return Number(valor).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            } else{
                return `Item não cadastrado!`
            }
        },
        logValue(value) {
            console.log(value)
        }
    },
    computed: {
        cargoCorreto() {
            return this.expectedRoles !== undefined ? this.expectedRoles.includes(this.$store.getters.getRole) : false;
        }
    }
}

</script>