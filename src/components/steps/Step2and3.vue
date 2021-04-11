<template>
    <div>
        <div v-for="(it, idx) in inputItem.items" :key="idx">
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
            <v-col cols="12" xs="12" sm="6" md="5" align="center">
                <h2>Chave de Identificação do(a) {{usuario}}:</h2>
                <v-col cols="12" sm="12" align="center">
                    <v-text-field
                        v-model="inputItem['keyGerencia']"
                        class="mt-4"
                        rows="1"
                        required
                        shaped
                        outlined
                        clearable
                        prepend-inner-icon="mdi-key"
                        type="password"
                    ></v-text-field>
                </v-col>
                <v-btn
                dark
                color="blue darken-1"
                class="mb-8"
                :loading="loadingBtn"
                @click="keyCheck()">
                    Enviar Aprovação
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            loadingBtn: false,
            apiCargo: "https://demapsm-backend.herokuapp.com/cargos",
            // apiCargo: "//localhost:8000/cargos",
            response: null,
        }
    },
    props: {
        inputItem: Object,
        usuario: String
    },
    methods: {
        keyCheck(){
            this.loadingBtn = true;
            let cargo = -1;
            let key = '';
            if (this.inputItem.statusStep === 2) {
                cargo = 0;
                key = "keyGerencia";
            }
            else if (this.inputItem.statusStep === 3) {
                cargo = 1;
                key = "keyServidor";
            }

            axios.get(`${this.apiCargo}/keycheck/?key=${this.inputItem[key]}&cargo=${cargo}`)
            .then(response => {
                this.response = response.data;
                if (this.response['valid'])
                    console.log(`Valid key for cargo ${cargo}!!`);
                else
                    console.log(`Invalid key for cargo ${cargo}!!`);
                this.loadingBtn = false;
                })
            .catch(error => {
                console.log(error)
                })
            
        },
        logValue(value) {
            console.log(value)
        }
    }
}

</script>