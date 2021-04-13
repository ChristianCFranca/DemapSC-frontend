<template>
    <v-card class="ma-12">

        <v-alert
            dense
            text
            type="success"
            v-if="success"
            >
            Seu pedido foi realizado com sucesso. Acesse a guia <strong>conferir andamentos</strong> para saber mais.
        </v-alert>
        <v-alert
            dense
            outlined
            type="error"
            v-if="error"
            >
            Ocorreu um erro na realização do seu pedido. Certifique-se de que todos os campos com <strong>*</strong> foram devidamente preenchidos.
        </v-alert>

        <v-card-title> Solicitação de Aquisição de Material não Codificado </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-form ref="form" v-model="valid">
                <v-container>
                    <v-row>

                        <v-col
                            cols="12"
                            sm="4"
                            md="4">

                            <v-text-field
                                v-model="pedido.requisitante"
                                label="Nome do Requisitante*"
                                required
                                :counter="50"
                                :rules="nonEmptyRules"
                                clearable
                            ></v-text-field>

                        </v-col>
                        

                        <v-col
                            cols="12"
                            sm="4"
                            md="4">

                            <v-text-field
                                v-model="pedido.email"
                                label="Email do Requisitante*"
                                required
                                :counter="50"
                                :rules="emailRules"
                                clearable
                            ></v-text-field>

                        </v-col>


                        <v-col
                            cols="12"
                            sm="4"
                            md="4">

                            <v-text-field
                                v-model="pedido.os"
                                label="Número da Ordem de Serviço Associada*"
                                required
                                :counter="20"
                                :rules="nonEmptyRules"
                                clearable
                            ></v-text-field>

                        </v-col>


                        <v-container>
                            <v-row v-for="item in itemsQtd" :key="item">
                                <v-col
                                    cols="12"
                                    sm="7"
                                    md="7">

                                    <v-row class="mx-1">
                                        <v-col
                                        cols="12"
                                        sm="7"
                                        md="7"
                                        >

                                            <v-combobox
                                                v-model="pedido.items[item-1].nome"
                                                :label="'Nome do Item ' + item +'*'"
                                                hint="De preferência escolha um item dos disponíveis."
                                                :rules="nonEmptyRules"
                                                :items="listaDeMateriais"
                                                :loading="isMateriaisLoading"
                                                @click="searchMateriais()"
                                                @blur="checkInputName(pedido.items[item-1])"
                                                hide-no-data
                                                hide-selected
                                                :counter="100"
                                                filled
                                                outlined
                                                clearable
                                                required
                                            ></v-combobox>

                                        </v-col>
                                        
                                        <v-col
                                        cols="12"
                                        sm="3"
                                        md="3">

                                            <v-text-field
                                                v-model="pedido.items[item-1].quantidade"
                                                :label="'Quantidade Item ' + item +'*'"
                                                hint="Insira a quantidade na medida apropriada (metros, unidades, etc)."
                                                required
                                                :counter="30"
                                                :rules="numericRules"
                                                clearable
                                                filled
                                                outlined
                                            ></v-text-field>

                                        </v-col>

                                        <v-col
                                        cols="12"
                                        sm="2"
                                        md="2">

                                            <v-select
                                                v-model="pedido.items[item-1].unidade"
                                                label="Unidade"
                                                required
                                                :items="unidadesDeMedida"
                                                :rules="nonEmptyRules"
                                                clearable
                                                filled
                                                outlined
                                            ></v-select>

                                        </v-col>
                                    </v-row>
                                    
                                    <v-row>

                                        <v-col
                                            cols="12"
                                            sm="8"
                                            md="8">

                                            <v-text-field
                                                v-model="pedido.items[item-1].finalidade"
                                                :label="'Finalidade do Item ' + item +'*'"
                                                hint="De preferência escolha um item dos disponíveis."
                                                required
                                                :counter="100"
                                                :rules="nonEmptyRules"
                                                clearable
                                                filled
                                                outlined
                                                class="ml-4"
                                            ></v-text-field>
                                            
                                        </v-col>

                                        <v-col
                                            cols="12"
                                            sm="4"
                                            md="4">

                                            <v-radio-group v-model="pedido.items[item-1].categoria" row>
                                                <v-radio
                                                    :label="`Sob Demanda`"
                                                    value="Sob Demanda"
                                                    disabled
                                                ></v-radio>
                                                <v-radio
                                                    :label="`Fixo`"
                                                    value="Fixo"
                                                    disabled
                                                ></v-radio>
                                                <v-radio
                                                    :label="`Outro`"
                                                    value="Outro"
                                                    disabled
                                                ></v-radio>
                                            </v-radio-group>

                                        </v-col>

                                    </v-row>

                                </v-col>


                                <v-col
                                    cols="12"
                                    sm="5"
                                    md="5">

                                    <v-textarea
                                        v-model="pedido.items[item-1].descricao"
                                        :label="'Descrição do Item ' + item"
                                        height="165"
                                        :counter="300"
                                        clearable
                                        filled
                                        auto-grow
                                        outlined
                                    ></v-textarea>


                                </v-col>
                            </v-row>
                        
                        </v-container>
                        <v-container>
                            <v-row no-gutters>
                                <v-col cols="12" align="center">
                                    <v-btn depressed class="mt-4 mb-2" color="blue-grey lighten-4" @click="addItem()" :disabled="addDisable">Adicionar Item</v-btn>
                                </v-col>
                                <v-col cols="12" align="center">
                                    <v-btn depressed color="blue-grey lighten-4" @click="removeItem()" :disabled="remDisable">Remover Item</v-btn>
                                </v-col>
                            </v-row>

                        </v-container>
                        
                    </v-row>
                </v-container>
            </v-form>
        *indica campo obrigatório
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="resetForm()"
          >
            Limpar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="sendData()"
            :loading="loading"
            :disabled="loading"
          >
            Enviar Pedido
          </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import axios from 'axios';

export default {

    data() {
        return {
            unidadesDeMedida: [
                "unid.", // Unidades
                "km", "m", "cm", "mm", "pol.", // Comprimento
                "km²", "m²", "cm²", "mm²", "pol.²", // Área
                "litros", "ml", "km³", "m³", "cm³", "mm³", "pol.³", // Volume
                "g", "kg", "ton.", // Massa
                ],
            isMateriaisLoading: false,
            listaDeMateriais: [],
            listaDeMateriaisObj: [],
            loading: false,
            success: false,
            error: false,
            valid: false,
            itemsQtd: 1,
            pedido: {
                requisitante: null,
                email: null,
                os: null,
                items: [
                    {nome: null, descricao: null, quantidade: null, categoria: null, unidade: null, finalidade: null, aprovadoFiscal: true, motivoFiscal: null, aprovadoServidor: true, motivoServidor: true}
                ],
                dataPedido: null,
                dataCancelamento: null,
                quantidade: null,
                status: null,
                statusStep: 2,
                color: "orange",
                active: true
            },
            addDisable: false,
            remDisable: true,
            nonEmptyRules: [v => !!v || "Campo obrigatório."],
            numericRules: [v => !!v || "Campo obrigatório.", v => !isNaN(v) || "Valor não é um número."],
            emailRules: [v => !!v || 'Campo obrigatório.', v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido.'],
            // apiURL: "//localhost:8000/crud/pedidos/",
            apiURL: "https://demapsm-backend.herokuapp.com/crud/pedidos/",
            // apiMateriaisURL: "//localhost:8000/crud/materiais/",
            apiMateriaisURL: "https://demapsm-backend.herokuapp.com/crud/materiais/"
        }
    },
    methods: {
        logValue(value) {
            console.log("Logged value: ", value)
        },
        resetForm() {
            this.error = false;
            this.success = false;
            this.$refs.form.reset();
        },
        addItem() {
            this.itemsQtd += 1;
            this.pedido.items.push({nome: null, descricao: null, quantidade: null, categoria: null, unidade: null, finalidade: null, aprovadoFiscal: true, motivoFiscal: null, aprovadoServidor: true, motivoServidor: true})
            this.computeDisable();
        },
        removeItem() {
            this.itemsQtd -= 1;
            this.pedido.items.pop()
            this.computeDisable();
        },
        computeDisable() {
            if (this.itemsQtd >= 5)
                this.addDisable = true
            else
                this.addDisable = false

            if (this.itemsQtd === 1)
                this.remDisable = true
            else
                this.remDisable = false
        },
        sendData() {
            if (this.valid){
                this.error = false

                // Todas as informações do processo são inseridas aqui
                this.pedido.quantidade = this.pedido.items.length;
                this.pedido.dataPedido = new Date().toLocaleDateString();
                this.pedido.status = "Aguardando confirmação do(a) fiscal";

                this.loading = true;
                axios.post(`${this.apiURL}`, this.pedido)
                .then(response => {
                    this.resetForm(); 
                    this.success = true;
                    this.loading = false;
                    return response
                    })
                .catch(error => {
                    console.log(error); 
                    this.error = true;
                    this.loading = false;
                    return error
                    });
            } else {
                console.log("Something is wrong here...")
                this.success = false
                this.error = true
            }
        },
        searchMateriais() {
            // Items have already been loaded
            if (this.listaDeMateriais.length > 0) return

            // Items have already been requested
            if (this.isMateriaisLoading) return

            this.isMateriaisLoading = true

            // Lazily load input items
            fetch(this.apiMateriaisURL)
            .then(res => res.json()) // {"id": 067812854698, "descricao": "Abraçadeira 3/4" Formato U", categoria: "Fixo", "fabReferencia": "Deca", ...}
            .then(res => {
                this.listaDeMateriaisObj = res;
                this.listaDeMateriais = this.getAllMateriais(res, "descricao");
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => (this.isMateriaisLoading = false));
        },
        getAllMateriais(json, key) {
            const values = [... json.map(item => item[key])]
            return values
        },
        checkInputName(item) {
            if (this.listaDeMateriais.length > 0){
                let nome = item.nome;
                if (this.nonEmptyRules[0](nome) === true){
                    if (this.listaDeMateriais.includes(nome)){
                        let idx = this.listaDeMateriais.indexOf(nome);
                        item.categoria = this.listaDeMateriaisObj[idx].categoria
                    } else {
                        item.categoria = "Outro"
                    }
                }
            }
        }
        
    }

}
</script>