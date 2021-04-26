<template>
    <div>
        <v-dialog
        v-model="dialogTrocarSenha"
        max-width="400">
            <TrocarSenha :dialogTrocarSenha="dialogTrocarSenha" @fecharFormulario="dialogTrocarSenha=false"/>
        </v-dialog>

        <v-dialog
        v-model="dialogSair"
        max-width="400">
            <v-card>
                <v-container>
                    <v-card-title class="justify-center">
                        Tem certeza que deseja sair?
                    </v-card-title>
                    <v-divider class="mb-3"></v-divider>
                    <v-card-actions class="justify-center">
                        <v-btn 
                        text 
                        color="blue"
                        @click="logout()">
                            Sim
                        </v-btn>
                        <v-btn 
                        text 
                        color="red"
                        @click="dialogSair=false">
                            Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-navigation-drawer
        v-model="drawer"
        absolute
        bottom
        temporary
        >
            <v-system-bar></v-system-bar>
            <v-list>
                <v-list-item link>
                <v-list-item-content>
                    <v-list-item-title class="title">
                    {{ $store.getters.getFirstLastName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ $store.getters.getEmail }}</v-list-item-subtitle>
                </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item link @click="dialogTrocarSenha=!dialogTrocarSenha">
                    <v-list-item-icon>
                    <v-icon>mdi-account-edit</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Trocar Senha</v-list-item-title>
                </v-list-item>
                <v-list-group
                :value="false"
                prepend-icon="mdi-account-plus"
                v-if="$store.getters.getPermissions.length !== 0">
                    <template v-slot:activator>
                        <v-list-item-title>Criar Usuários</v-list-item-title>
                    </template>
                    <div v-for="role in $store.getters.getAllRoles" :key="role">
                        <v-list-item
                        link
                        v-if="$store.getters.getPermissions.includes(role)">
                            <v-list-item-icon>
                            <v-icon v-text="`mdi-plus`" right></v-icon>
                            </v-list-item-icon>
                            <v-list-item-title v-text="role"></v-list-item-title>

                        </v-list-item>
                    </div>
                </v-list-group>
                <v-list-item class="justify-center">
                    <v-btn plain text x-large class="mr-5" @click="dialogSair=true" color="blue">
                        <v-icon>mdi-logout</v-icon>
                        Sair
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

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

        <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>

        <v-app-bar-title>
            <h2><v-icon left>mdi-tools</v-icon><span class="font-weight-light">Demap</span><span class="font-weight-bold">SM</span></h2>
        </v-app-bar-title>

        <v-spacer></v-spacer>
        
        <template v-slot:extension>
            <v-tabs>
                <v-spacer></v-spacer>
                <v-tab route to="/novo-pedido">Nova Solicitação</v-tab>
                <v-menu offset-y dark>
                    <template v-slot:activator="{ on, attrs }">
                        <v-tab v-bind="attrs" v-on="on">Andamentos</v-tab>
                    </template>
                    <v-list>
                        <v-list-item>
                            <v-btn plain text route to="/andamentos-ativos">
                                Andamentos Ativos
                            </v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn plain text route to="/andamentos-concluidos">
                                Andamentos Concluídos
                            </v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn plain text route to="/andamentos-cancelados">
                                Andamentos Cancelados
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
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
import ServiceAPI from '@/services/ServiceAPI.js';
import TrocarSenha from '@/components/TrocarSenha.vue'

export default {
    components: {
        TrocarSenha
    },
    data() {
        return {
            drawer: false,
            error: false,
            errorMessage: "Chave inválida",
            key: null,
            csv_filename: 'data.csv',
            loading: false,
            solicitacaoMessage: "Nenhum dado disponível.",
            dialogTrocarSenha: false,
            dialogSair: false
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
            ServiceAPI.collectData()
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
        logout() {
            this.dialogSair = false;
            this.$store.dispatch('logout')
            .then(() => {
                this.$router.push({name: 'novo-pedido'})
            })
        },
        keyCheck(){
            this.error = false;
            this.loading = true;   

            ServiceAPI.checkKeyBoth(this.key)
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
        }
    }
}

</script>
