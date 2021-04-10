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
                                    sm="6"
                                    md="6">

                                    <v-row class="mx-1">
                                        <v-col
                                        cols="12"
                                        sm="8"
                                        md="8"
                                        >

                                            <v-combobox
                                                v-model="pedido.items[item-1].nome"
                                                :label="'Nome do Item ' + item +'*'"
                                                hint="De preferência escolha um item dos disponíveis."
                                                :rules="nonEmptyRules"
                                                :items="listaDeMateriais"
                                                :loading="isMateriaisLoading"
                                                @click="searchMateriais()"
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
                                        sm="4"
                                        md="4">

                                            <v-text-field
                                                v-model="pedido.items[item-1].quantidade"
                                                :label="'Quantidade do Item ' + item +'*'"
                                                hint="Insira a quantidade na medida apropriada (metros, unidades, etc)."
                                                required
                                                :counter="30"
                                                :rules="nonEmptyRules"
                                                clearable
                                                filled
                                                outlined
                                            ></v-text-field>

                                        </v-col>
                                    </v-row>

                                    <v-col
                                        cols="12"
                                        sm="12"
                                        md="12">

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
                                        ></v-text-field>

                                    </v-col>

                                </v-col>


                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="6">

                                        <v-textarea
                                            v-model="pedido.items[item-1].descricao"
                                            :label="'Descrição do Item ' + item"
                                            height="155"
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
            isMateriaisLoading: false,
            listaDeMateriais: [],
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
                    {nome: null, descricao: null, quantidade: null, finalidade: null}
                ],
                dataPedido: null,
                quantidade: null,
                status: null,
                statusStep: null
            },
            addDisable: false,
            remDisable: true,
            nonEmptyRules: [v => !!v || "Campo obrigatório."],
            emailRules: [v => !!v || 'Campo obrigatório.', v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido.'],
            apiURL: "//localhost:8000/crud/pedidos/",
            apiMateriaisURL: "//localhost:8000/crud/materiais/"
        }
    },
    methods: {
        resetForm() {
            this.$refs.form.reset();
        },
        addItem() {
            console.log("Aqui está o pedido: ", this.pedido)
            this.itemsQtd += 1;
            this.pedido.items.push({nome: null, descricao: null, quantidade: null, finalidade: null})
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

                this.pedido.quantidade = this.pedido.items.length;
                this.pedido.dataPedido = new Date().toLocaleDateString();
                this.pedido.statusStep = 2;
                this.pedido.status = "Solicitação registrada";

                this.loading = true;
                axios.post(`${this.apiURL}`, this.pedido)
                .then(response => {this.resetForm(); return response;})
                .catch(error => {console.log(error); return error});

                this.loading = false;

                this.success = true
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
                this.listaDeMateriais = this.getAllMateriais(res, "descricao")
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => (this.isMateriaisLoading = false))
        },
        getAllMateriais(json, key) {
            const values = [... json.map(item => item[key])]
            return values
        }
        
    }

}
</script>