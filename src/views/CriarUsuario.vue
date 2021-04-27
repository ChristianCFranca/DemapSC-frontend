<template>
    <div class="fill-height">
        <v-container fluid class="pb-14 fill-height" v-if="$store.getters.getPermissions.length !== 0">
            <v-row class="d-flex justify-center">
                <v-col 
                cols="12"
                xs="12"
                sm="10"
                md="10"
                lg="6"
                >
                    <v-form 
                    ref="form"
                    v-model="valid">
                        <v-card elevation="10" shaped> 
                            <v-card-title class="justify-center ml-4">
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
                                    label="Digite o nome completo do novo usuário"
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
                                    label="Digite o email completo do novo usuário"
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
                                            label="Digite a senha do novo usuário"
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
                                            label="Confirme a senha do novo usuário"
                                            outlined
                                            :type="showConfirm ? `` : `password`"
                                            @click:append="showConfirm=!showConfirm">
                                            </v-text-field>
                                        </v-col>

                                    </v-row>
                                    <v-row justify="center">
                                        <v-col cols="12" md="4">
                                            <v-select
                                            v-model="newUser.roleName"
                                            outlined
                                            required
                                            class="rounded-lg"
                                            :rules="nonEmptyRyles"
                                            :items="$store.getters.getPermissions"
                                            label="Insira o cargo do novo usuário"
                                            ></v-select>
                                        </v-col>
                                    </v-row>

                                    <p v-if="errorMessage !== null" class="text-h5 red--text text-center font-weight-light">
                                        {{ errorMessage }}
                                    </p>
                                    <p v-if="successMessage !== null" class="text-h5 success--text text-center font-weight-light">
                                        {{ successMessage }}
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
                                    class="mr-2"
                                    large
                                    :loading="loading"
                                    @click="criarConta()">Criar</v-btn>

                                </v-card-actions>
                        </v-card>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>
        <v-container fluid class="pb-14 fill-height" v-else>
            <v-row class="d-flex justify-center">
                <p class="text-h3 mb-4 font-weight-light">
                    Você não possui permissão para criar usuários. <v-icon x-large>mdi-emoticon-sad-outline</v-icon>
                </p>
            </v-row>
        </v-container>
    </div>
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
                roleName: null,
            },
            nonEmptyRyles: [
                v => !!v || 'Campo obrigatório.'
            ],
            nomeCompletoRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+ ./.test(v) || 'Nome completo deve apresentar pelo menos um sobrenome.'
            ],
            usernameRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+@.+\../.test(v) || 'E-mail deve ser válido.', 
                v => /.+@bcb.gov.br/.test(v) || 'Domínio deve ser bcb.gov.br'
            ],
            passwordRules: [
                v => !!v || 'Campo obrigatório.'
            ],
            passwordSameRules: [
                v => !!v || 'Campo obrigatório.',
                v => v === this.newUser.password || 'Senhas não são iguais'
            ],
            errorMessage: null,
            successMessage: null
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
                this.loading = false;
                this.successMessage = "Usuário cadastrado com sucesso!";
                this.resetForm();
            })
            .catch(error => {
                this.loading = false;
                if (error.response){
                    if (error.response.status === 401){
                        this.errorMessage = "Você não está autenticado ou não possui permissão para fazer isso.";
                        this.$store.distpach('logout')
                        .then(() => {
                            this.$router.push({name: 'login'})
                        })
                    }
                    this.errorMessage = error.response.data.detail;
                }
                else {
                    this.errorMessage = "Houve problema de conexão com o servidor.";
                }
            })
        }
    }
}
</script>