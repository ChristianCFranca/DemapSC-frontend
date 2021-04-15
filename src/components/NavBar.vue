<template>
    <div>
        <v-app-bar
        color="#6A76AB"
        dark
        src="../assets/banner.jpg"
        >
        <template v-slot:img="{ props }">
            <v-img
            v-bind="props"
            gradient="to top right, rgba(0,0,0,.8), rgba(0,33,90,.6)"
            ></v-img>
        </template>

        <v-app-bar-nav-icon @click="logValue()"></v-app-bar-nav-icon>

        <v-spacer></v-spacer>

        <v-app-bar-title><h2><v-icon left>mdi-tools</v-icon><span class="font-weight-light">Demap</span><span class="font-weight-bold">SM</span></h2></v-app-bar-title>

        <v-spacer></v-spacer>
        
        <template v-slot:extension>
            <v-tabs>
                <v-spacer></v-spacer>
                <v-tab route to="/novo-pedido">Nova Solicitação</v-tab>
                <v-tab route to="/andamentos">Conferir Andamentos</v-tab>
                <v-spacer></v-spacer>
            </v-tabs>
        </template>
        
        <div class="text-center">
            <v-menu 
            transition="slide-y-transition"
            :close-on-content-click="false"
            :nudge-width="200"
            offest-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                    v-bind="attrs"
                    v-on="on"
                    icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-card 
                class="text-center px-4" 
                color="grey lighten-5"
                max-width="350">
                    <v-card-title class="justify-center">Baixar andamentos</v-card-title>
                    
                    <v-card-text>
                        <v-divider></v-divider>
                        <p class="body-1 my-4">Chave de Identificação do(a) assistente/fiscal:</p>
                        <v-text-field
                            v-model="key"
                            rows="1"
                            required
                            shaped
                            outlined
                            clearable
                            prepend-inner-icon="mdi-key"
                            type="password"
                        ></v-text-field>
                    </v-card-text>
                    <h2 class="font-weight-light red--text mb-3" v-if="error">{{errorMessage}}</h2> 
                    <v-card-actions class="justify-center pb-8">
                        <v-btn 
                        large
                        outlined
                        color="blue darken-3"
                        @click="keyCheck()"
                        :loading="loading">
                            <v-icon large left>mdi-download</v-icon>
                            Download
                        </v-btn>
                    </v-card-actions>
                    
                </v-card>
            </v-menu>
        </div>

        </v-app-bar>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            error: false,
            errorMessage: "Chave inválida",
            key: null,
            csv_filename: 'data.csv',
            loading: false,
            solicitacaoMessage: "Nenhum dado disponível.",
            apiURL: (process.env.BACKEND_URL === undefined) ? '//localhost:8000' : process.env.BACKEND_URL
        }
    },
    methods: {
        forceFileDownload(response) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', this.csv_filename)
            document.body.appendChild(link)
            link.click()
        },
        getPedidosAsCSV() {
            axios({
                method: 'get',
                url: `${this.apiURL}/collect_data/`,
                responseType: 'arraybuffer',
            })
            .then(response => {
                this.forceFileDownload(response)
                this.loading = false;
                })
            .catch(error => {
                if (error.response === undefined)
                    this.solicitacaoMessage = "Banco de dados indisponível.";
                else 
                    this.solicitacaoMessage = "Nenhum dado disponível.";
                console.log(error); 
                this.loading = false; 
                });
        },
        keyCheck(){
            this.error = false;
            this.loading = true;   

            axios.get(`${this.apiURL}/cargos/keycheck_both/?key=${this.key}`)
            .then(response => {
                this.response = response.data;
                if (this.response['valid']) {
                    this.getPedidosAsCSV()
                }
                else {
                    this.errorMessage = "Chave inválida";
                    this.error = true;
                    this.loading = false;               
                }
                })
            .catch(error => {
                console.log(error);
                this.errorMessage = "Ocorreu um erro no servidor";
                this.error = true;
                this.loading = false;
                })
        },
        logValue() {
            console.log(process.env.BACKEND_URL)
        }
    }
    
}

</script>
