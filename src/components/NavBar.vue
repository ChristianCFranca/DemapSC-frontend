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
                        :loading="logoutLoading"
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
        temporary>
            <v-system-bar></v-system-bar>
            <v-list>
                <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                    {{ $store.getters.getFirstLastName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ $store.getters.getEmail }}</v-list-item-subtitle>
                    <div class="my-1" v-if="$store.getters.getCurrentUserEmpresas">
                        <div class="text-subtitle-2 grey--text text--darken-1">Empresas</div>
                        <span class="font-weight-bold mt-1" v-for="(empresa, i) in $store.getters.getCurrentUserEmpresas" :key="empresa">
                            {{empresa}}<span v-if="i + 1 < $store.getters.getCurrentUserEmpresas.length">,</span>
                        </span>
                    </div>
                    <div class="mt-2" v-if="$store.getters.getCurrentUserEmpresas">
                        <div class="text-subtitle-2 grey--text text--darken-1">Cargo</div>
                        <div class="font-weight-bold">{{ $store.getters.getRole }}</div>
                    </div>
                </v-list-item-content>
                </v-list-item>
                <v-divider class="mx-4"></v-divider>
                <v-list-group
                :value="false"
                prepend-icon="mdi-account-edit">
                    <template v-slot:activator>
                    <v-list-item-title>Editar Dados</v-list-item-title>
                    </template>
                    <v-list-item link @click="dialogTrocarSenha=!dialogTrocarSenha">
                        <v-list-item-icon>
                        <v-icon right>mdi-circle-edit-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Trocar Senha</v-list-item-title>
                    </v-list-item>
                </v-list-group>
                <v-list-item link v-if="$store.getters.getPermissions.length !== 0" @click="goToCadastro()">
                    <v-list-item-icon>
                    <v-icon>mdi-account-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Criar Usuário</v-list-item-title>
                </v-list-item>
                <v-list-item link v-if="$store.getters.getPermissions.length !== 0" @click="goToUsuarios()">
                    <v-list-item-icon>
                    <v-icon>mdi-account-group</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Usuários do Sistema</v-list-item-title>
                </v-list-item>
                <v-list-item link v-if="$store.getters.getRole === 'admin'" @click="goToFaturamentos()">
                    <v-list-item-icon>
                    <v-icon>mdi-cash-multiple</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Faturamentos</v-list-item-title>
                </v-list-item>
                <v-divider class="mx-4 mb-4"></v-divider>
                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-subtitle class="text-center">Tempo de Sessão Restante</v-list-item-subtitle>
                        <v-list-item-title class="text-center text-h5 font-weight-light">{{ `${remainingHours}:${remainingMinutes}:${remainingSeconds}` }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider class="mx-4 my-4"></v-divider>
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
                <v-tab route to="/quantitativos" v-if="isValidForQuantitativos">Quantitativos</v-tab>
                <v-tab route to="/novo-pedido">Nova Solicitação</v-tab>
                <v-tab route to="/andamentos">Andamentos</v-tab>
                <v-spacer></v-spacer>
            </v-tabs>
        </template>
        </v-app-bar>
    </div>
</template>

<script>
import TrocarSenha from '@/components/TrocarSenha.vue'

export default {
    components: {
        TrocarSenha
    },
    data() {
        return {
            drawer: false,
            logoutLoading: false,
            error: false,
            errorMessage: "Chave inválida",
            key: null,
            filename: null,
            loadingCompras: false,
            solicitacaoMessageCompra: null,
            dialogTrocarSenha: false,
            dialogSair: false
        }
    },
    mounted() {
        if (!this.$store.getters.getSessaoRestante)
            this.$store.commit('ENGAGE_TOKEN_COUNTDOWN')
    },
    methods: {
        logout() {
            this.logoutLoading = true;
            console.log("entrei")
            this.$store.dispatch('logout')
            .then(() => {
            })
            .catch(() => {
                alert("Ocorreu um erro no logout.")
            })
        },
        goToCadastro(){
            this.drawer = false;
            this.$router.push({name: 'criar-usuario'})
        },
        goToUsuarios(){
            this.drawer = false;
            this.$router.push({name: 'usuarios'})
        },
        goToFaturamentos(){
            this.drawer = false;
            this.$router.push({name: 'faturamentos'})
        }
    },
    computed: {
        remainingHours() {
            return String(Math.trunc(this.$store.getters.getSessaoRestante/3600)).padStart(2, '0');
        },
        remainingMinutes() {
            return String(Math.trunc(this.$store.getters.getSessaoRestante/60%60)).padStart(2, '0');
        },
        remainingSeconds() {
            return String(this.$store.getters.getSessaoRestante%60).padStart(2, '0');
        },
        isValidForQuantitativos() {
            return this.$store.getters.getRole !== "regular"
        }
    },
    watch: {
        '$store.getters.getSessaoRestante'() {
            if (this.$store.getters.getSessaoRestante <= 0){
                this.$store.dispatch('logout')
            }
        }
    }
}

</script>
