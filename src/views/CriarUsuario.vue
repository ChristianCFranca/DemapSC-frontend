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
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <p class="text-subtitle-1">
                                                Cargo:
                                            </p>
                                            <v-select
                                            v-model="newUser.roleName"
                                            outlined
                                            required
                                            class="rounded-lg"
                                            :rules="nonEmptyRules"
                                            :items="$store.getters.getPermissions"
                                            label="Insira o cargo do novo usuário"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" xs="12" md="6">
                                            <p class="text-subtitle-1">
                                                Empresa:
                                            </p>
                                            <v-select
                                            v-model="newUser.empresa"
                                            :items="$store.getters.getAllEmpresasNames"
                                            :rules="nonEmptyArray"
                                            attach
                                            chips
                                            multiple
                                            required
                                            :label="`Selecione a empresa do novo usuário`"
                                            :loading="loadingEmpresas">
                                            </v-select>
                                        </v-col>
                                    </v-row>

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
            loadingEmpresas: false,
            show: false,
            showConfirm: false,
            newUser: {
                nomeCompleto: null,
                username: null,
                password: null,
                roleName: null,
            },
            nonEmptyRules: [
                v => !!v || 'Campo obrigatório.'
            ],
            nomeCompletoRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+ ./.test(v) || 'Nome completo deve apresentar pelo menos um sobrenome.'
            ],
            usernameRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+@([a-zA-Z0-9]]?)+/.test(v) || 'E-mail deve ser válido.', 
                v => /.+@(.?)+bcb.gov.br/.test(v) || 'Domínio deve finalizar com bcb.gov.br'
            ],
            nonEmptyArray: [
                v => (!!v && v?.length !== 0) || 'Campo obrigatório.'
            ],
            passwordRules: [
                v => !!v || 'Campo obrigatório.'
            ],
            passwordSameRules: [
                v => !!v || 'Campo obrigatório.',
                v => v === this.newUser.password || 'Senhas não são iguais'
            ]
        }
    },
    mounted() {
        this.loadingEmpresas = true;
        this.$store.dispatch('getEmpresas')
        .then(() => {})
        .catch(error => {
            console.log(error);
            if (error.response)
                this.$store.commit('SET_SNACKBAR', {message: "Houve problema de conexão com o servidor.", color: "error"});
            })
        .finally(() => {
            this.loadingEmpresas = false;
        })
    },
    methods: {
        resetForm() {
            this.$refs.form.reset();
        },
        criarConta() {
            if (!this.$refs.form.validate()) return

            this.loading = true;

            let newUserData = new FormData();

            newUserData.append('nomeCompleto', this.newUser.nomeCompleto);
            newUserData.append('username', this.newUser.username);
            newUserData.append('empresa', this.newUser.empresa);
            newUserData.append('password', this.newUser.password);
            newUserData.append('roleName', this.newUser.roleName);

            this.$store.dispatch('register', newUserData)
            .then(() => {
                this.$store.commit('SET_SNACKBAR', {message: "Usuário criado com sucesso.", color: "success"})
                this.resetForm();
            })
            .catch(error => {
                if (error ?.response ?.status === 401){
                    this.$store.commit('SET_SNACKBAR', {message: "Usuário não está autenticado.", color: "error"});
                    this.$store.distpach('logout')
                } else if (error ?.response ?.data ?.detail)
                    this.$store.commit('SET_SNACKBAR', {message: error.response.data.detail, color: "error"});
                else
                    this.$store.commit('SET_SNACKBAR', {message: "Houve problema de conexão com o servidor.", color: "error"});
            })
            .finally(() => {
                this.loading = false;
            })
        }
    }
}
</script>