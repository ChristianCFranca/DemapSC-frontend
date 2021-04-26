<template>
    <div>
        <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
                <v-card-title class="headline">Tem certeza que deseja cancelar essa solicitação?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = !dialogDelete">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="updateItemStep(true)" :loading="loadingDeleteBtn">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-form v-model="valid">
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
                        md="3">
                            <v-row 
                            justify="center" 
                            class="mt-12" 
                            v-if="!it.almoxarifadoPossui">
                                <v-col cols="12" justify="center" class="d-flex justify-center">
                                    <h2 class="font-weight-light"> Aguardando compra do item por</h2>
                                </v-col>

                                <v-row
                                justify="center"
                                no-gutters>
                                    <v-chip 
                                    large 
                                    class="mb-4" 
                                    color="teal darken-2" 
                                    outlined
                                    >
                                        <h1 class="font-weight-light">
                                            {{ it.direcionamentoDeCompra }}
                                        </h1>
                                    </v-chip>
                                </v-row>
                                
                                <v-col 
                                cols="12" 
                                class="text-center">
                                    <v-icon 
                                    large 
                                    color="teal darken-2"
                                    >mdi-account-cash-outline</v-icon>
                                </v-col>

                                <v-col cols="12" sm="8" v-if="cargoCorreto">
                                    <v-currency-field
                                    v-model="it.valorGasto"
                                    outlined
                                    clearable
                                    label="Valor total gasto*"
                                    hint="Digite o valor total gasto no item"
                                    class="rounded-tr-xl"
                                    prepend-inner-icon="mdi-cash"
                                    :rules="cashRules"
                                    required
                                    validate-on-blur></v-currency-field>
                                </v-col>
                            </v-row>

                            <v-row 
                            justify="center" 
                            class="mt-12" 
                            v-else>
                                <v-col cols="12" justify="center" class="d-flex justify-center">
                                    <h2 class="font-weight-light"> Item aguardando retirada no</h2>
                                </v-col>
                                
                                <v-chip 
                                large class="mb-4" 
                                color="indigo darken-2" 
                                outlined>
                                    <h1 class="font-weight-light">
                                        Almoxarifado
                                    </h1>
                                </v-chip>
                                <v-col 
                                cols="12" 
                                class="text-center">
                                    <v-icon 
                                    large 
                                    color="indigo darken-2"
                                    >mdi-archive-arrow-up-outline</v-icon>
                                </v-col>
                            </v-row>
                            
                        </v-col>
                    </v-row>
                    <v-divider class="my-4"></v-divider>
                </div>
            </div>
        </v-form>
        <v-row no-gutters justify="center">
            <v-col cols="12" xs="12" sm="6" md="5" align="center">
                <div v-if="inputItem.active && cargoCorreto">
                    <h2>Chave de Identificação do(a) assistente de fiscalização:</h2>
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
                        color="blue darken-1"
                        class="white--text"
                        :loading="loadingBtnSend"
                        @click="keyCheck(`send`)"
                        :disabled="!valid">
                            Confirmar Aquisição
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
                    <h1 class="font-weight-regular red--text">Solicitação cancelada pelo(a) fiscal</h1>
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
import ServiceAPI from '@/services/ServiceAPI.js';

export default {
    data() {
        return {
            expectedRoles: ['assistente', 'admin'],
            valid: false,
            cashRules: [v => !!v || "Campo obrigatório.", v => v != "0,00" || "Valor deve ser maior que 0."],
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
        inputItem: Object,
        apiURL: String
    },
    methods: {
        /* eslint-disable no-unused-vars */
        updateItemStep(){
            let message = "Solicitação atualizado com sucesso";
            let {_id, ...inputItem} = this.inputItem; // Removemos o id para que ele não seja visto no json de alteração

            inputItem['statusStep'] += 1;
            inputItem['status'] = "Solicitação finalizada";
            inputItem['color'] = "success";
            inputItem['dataFinalizacao'] = new Date().toLocaleDateString();
            let valorGastoTotal = 0; // O v-text-currency ja valida como um float
            for (let idx = 0; idx < inputItem.items.length; idx++){
                if (
                    inputItem.items[idx].valorGasto !== null && // Tem que ter valor diferente de null
                    !inputItem.items[idx].almoxarifadoPossui &&// Almoxarifado NÃO deve possuir
                    inputItem.items[idx].aprovadoFiscal)  // Fiscal deve ter aprovado
                    valorGastoTotal += inputItem.items[idx].valorGasto;
            }
            inputItem.valorGastoTotal = valorGastoTotal; // Atualizamos o valor gasto total da proposta

            ServiceAPI.putPedidoExistente(_id, inputItem)
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
            const cargo = 0; // assistente de fiscalização             
            this.error = false;
            this.loadingBtnSend = true;

            ServiceAPI.keyCheck(this.key, cargo)
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
            return this.expectedRoles.includes(this.$store.getters.getRole);
        }
    }
}

</script>