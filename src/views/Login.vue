<template>
    <v-container fluid class="pb-14 fill-height">
        <v-row class="d-flex justify-center">
            <v-col 
            cols="12"
            xs="12"
            sm="10"
            md="10"
            lg="6"
            >
            <h2 class="text-h3 white--text mb-4">
                <v-icon left x-large color="white">mdi-tools</v-icon>
                <span class="font-weight-light">
                    Demap
                </span>
                <span class="font-weight-bold">
                    SM
                </span>
            </h2>
                <v-form 
                ref="form"
                v-model="valid">
                    <v-card elevation="10" shaped> 
                        <v-card-title class="justify-center ml-4">
                            Login
                            <v-spacer></v-spacer>
                            <v-btn
                            text
                            color="blue"
                            @click="$router.push({name: 'criar-conta'})">
                                <v-icon small left>
                                    mdi-plus
                                </v-icon>
                                Criar conta
                            </v-btn>
                        </v-card-title>
                        <v-divider class="mx-4"></v-divider>
                            <v-card-text class="justify-center">
                                <p class="text-subtitle-1">
                                    E-mail:
                                </p>
                                <v-text-field 
                                v-model="user.username"
                                :rules="usernameRules"
                                required
                                class="rounded-lg"
                                label="Digite seu e-mail"
                                outlined>
                                </v-text-field>

                                <p class="text-subtitle-1">
                                    Senha:
                                </p>
                                <v-text-field 
                                v-model="user.password"
                                :rules="passwordRules"
                                required
                                class="rounded-lg"
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                label="Digite sua senha"
                                outlined
                                :type="show ? `` : `password`"
                                @click:append="show=!show">
                                </v-text-field>

                                <p v-if="errorMessage !== null" class="text-h5 red--text text-center font-weight-light">
                                    {{ errorMessage }}
                                </p>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn
                                text
                                color="blue"
                                large
                                @click="resetValidation">Limpar</v-btn>

                                <v-btn
                                text
                                color="blue"
                                large
                                :loading="loading"
                                @click="login()"
                                class="mr-4">Entrar</v-btn>

                            </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    data() {
        return {
            user: {
                username: '',
                password: ''
            },
            loading: false,
            username: null,
            usernameRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+@.+\../.test(v) || 'E-mail deve ser válido.', 
                v => /.+@bcb.gov.br/.test(v) || 'Domínio deve ser bcb.gov.br'
                ],
            passwordRules: [
                v => !!v || 'Campo obrigatório.'
                ],
            valid: false,
            show: false,
            errorMessage: null,
        }
    },
    methods: {
        resetValidation() {
            this.errorMessage = null;
            this.$refs.form.reset();
        },
        login() {
            if (!this.valid) {
                this.errorMessage = "Todos os campos são obrigatórios.";
                return
            }

            this.errorMessage = null;
            this.loading = true;

            let credentials = new FormData();

            credentials.append('username', this.user.username);
            credentials.append('password', this.user.password);

            this.$store.dispatch('authenticate', credentials)
            .then(() => {
                this.loading = false;
                this.$router.push({name: 'novo-pedido'});
            })
            .catch(error => {
                this.loading = false;
                console.log(error);
                if (error.response){
                    if (error.response.data){
                        this.errorMessage = error.response.data.detail;
                    } else {
                        this.errorMessage = error.response;
                    }
                }
                else {
                    console.log("Erro: ", error);
                    this.errorMessage = "Houve problema de conexão com o servidor.";
                }
            })
            
        }
    }
}
</script>

<style>

#app {
  background: linear-gradient(90deg, rgba(2,0,36,0.5) 0%, rgba(9,9,121,0.5) 35%, rgba(79, 83, 13, 0.5) 100%), url('../assets/banner.jpg')  !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}

</style>