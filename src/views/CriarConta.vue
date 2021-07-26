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
                        <v-card-title class="justify-center">
                            <v-btn
                            text
                            color="blue"
                            fab
                            small
                            class="mx-2"
                            @click="$router.push('/login')">
                                <v-icon>
                                    mdi-arrow-left
                                </v-icon>
                            </v-btn>
                            Criar Conta
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <v-divider class="mx-4"></v-divider>
                            <v-card-text class="justify-center">
                                <p class="text-subtitle-1">
                                    Nome Completo:
                                </p>
                                <v-text-field 
                                v-model="newUser.nomeCompleto"
                                :rules="nomeCompletoRules"
                                required
                                class="rounded-lg"
                                label="Digite seu nome completo"
                                outlined>
                                </v-text-field>

                                <p class="text-subtitle-1">
                                    E-mail:
                                </p>
                                <v-text-field 
                                v-model="newUser.username"
                                :rules="usernameRules"
                                required
                                class="rounded-lg"
                                label="Digite seu e-mail"
                                outlined>
                                </v-text-field>

                                <v-row no-gutter>
                                    <v-col cols="12" xs="12" md="6">
                                        <p class="text-subtitle-1">
                                            Senha:
                                        </p>
                                        <v-text-field 
                                        v-model="newUser.password"
                                        :rules="passwordRules"
                                        required
                                        class="rounded-lg"
                                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                        label="Digite sua senha"
                                        outlined
                                        :type="show ? `` : `password`"
                                        @click:append="show=!show">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" xs="12" md="6">
                                        <p class="text-subtitle-1">
                                            Confirmar Senha:
                                        </p>
                                        <v-text-field
                                        :rules="passwordSameRules"
                                        required
                                        class="rounded-lg"
                                        :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                                        label="Confirme sua senha"
                                        outlined
                                        :type="showConfirm ? `` : `password`"
                                        @click:append="showConfirm=!showConfirm">
                                        </v-text-field>
                                    </v-col>
                                </v-row>

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
                                @click="resetForm">Limpar</v-btn>

                                <v-btn
                                text
                                color="blue"
                                large
                                :loading="loading"
                                @click="criarConta()">Criar</v-btn>

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
            valid: false,
            loading: false,
            show: false,
            showConfirm: false,
            newUser: {
                nomeCompleto: null,
                username: null,
                password: null,
                roleName: 'regular',
            },
            nomeCompletoRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+ ./.test(v) || 'Nome completo deve apresentar pelo menos um sobrenome.'
            ],
            usernameRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+@([a-zA-Z0-9]]?)+/.test(v) || 'E-mail deve ser válido.', 
                v => /.+@(.?)+bcb.gov.br/.test(v) || 'Domínio deve finalizar com bcb.gov.br'
            ],
            passwordRules: [
                v => !!v || 'Campo obrigatório.'
            ],
            passwordSameRules: [
                v => !!v || 'Campo obrigatório.',
                v => v === this.newUser.password || 'Senhas não são iguais'
            ],
            errorMessage: null
        }
    },
    methods: {
        resetForm() {
            this.errorMessage = null;
            this.$refs.form.reset();
        },
        criarConta() {
            if (!this.valid) {
                this.errorMessage = "Todos os campos são obrigatórios.";
                return
            }

            this.errorMessage = null;
            this.loading = true;

            let newUserData = new FormData();

            newUserData.append('nomeCompleto', this.newUser.nomeCompleto);
            newUserData.append('username', this.newUser.username);
            newUserData.append('password', this.newUser.password);
            newUserData.append('roleName', this.newUser.roleName);

            this.$store.dispatch('register', newUserData)
            .then(() => {
                this.$store.commit('SET_SNACKBAR', {message: "Usuário criado com sucesso.", color: "success"})
                this.resetForm();
            })
            .catch(error => {
                if (error?.response?.data?.detail){
                    this.$store.commit('SET_SNACKBAR', {message: error.response.data.detail, color: "error"})
                }
                else {
                    this.$store.commit('SET_SNACKBAR', {message: "Não foi possível concluir o cadastro. Tente mais tarde", color: "error"})
                }
            })
            .finally(() => {
                this.loading = false;
            })
        }
    }
}
</script>