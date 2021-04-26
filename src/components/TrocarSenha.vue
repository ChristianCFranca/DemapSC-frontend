<template>
    <v-card>
        <v-container>
            <v-form v-model="valid" ref="form">
                <v-card-title class="justify-center">
                    Trocar Senha
                </v-card-title>
                <v-divider class="mb-3"></v-divider>
                <v-card-text>

                    <v-text-field 
                    v-model="passwordOld"
                    :rules="passwordRules"
                    required
                    class="rounded-lg"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Digite sua senha atual"
                    outlined
                    :type="show1 ? `` : `password`"
                    @click:append="show1=!show1">
                    </v-text-field>

                    <v-text-field 
                    v-model="passwordNew"
                    :rules="passwordNewRules"
                    required
                    class="rounded-lg"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Digite sua nova senha"
                    outlined
                    :type="show2 ? `` : `password`"
                    @click:append="show2=!show2">
                    </v-text-field>

                    <v-text-field
                    :rules="passwordSameRules"
                    required
                    class="rounded-lg"
                    :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Confirme sua nova senha"
                    outlined
                    :type="show3 ? `` : `password`"
                    @click:append="show3=!show3">
                    </v-text-field>
                    <p class="text-h5 error--text text-center font-weight-light" v-if="error"> {{ errorMessage }}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="justify-center">
                    <v-btn 
                    text 
                    color="blue"
                    @click="trocarSenha()"
                    :loading="loading">
                        Confirmar
                    </v-btn>
                    <v-btn 
                    text 
                    color="red"
                    @click="closeDialog()">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            error: false,
            errorMessage: '',
            loading: false,
            show1: false,
            show2: false,
            show3: false,
            valid: false,
            passwordOld: '',
            passwordNew: '',
            passwordRules: [
                v => !!v || 'Campo obrigatório.'
            ],
            passwordNewRules: [
                v => !!v || 'Campo obrigatório.',
                v => v !== this.passwordOld || 'Nova senha não pode ser igual à antiga'
            ],
            passwordSameRules: [
                v => !!v || 'Campo obrigatório.',
                v => v === this.passwordNew || 'Senhas não são iguais'
            ],
        }
    },
    methods: {
        trocarSenha() {
            this.error = false;
            if (!this.valid) return
            this.loading = true;

            this.$store.dispatch('changePassword', {passwordOld: this.passwordOld, passwordNew: this.passwordNew})
            .then(() => {
                this.loading = false;
                this.closeDialog();
                alert("Senha alterada com sucesso!");
            })
            .catch(error =>{
                console.log(error);
                if (error.response) {
                    if (error.response.data.detail){
                        this.errorMessage = error.response.data.detail;
                    } else {
                        this.errorMessage = error.response.data;
                    }
                } else {
                    this.errorMessage = "Erro de comunicação com o servidor";
                }
                this.error = true;
                this.loading = false;
            })
        },
        closeDialog() {
            this.error = false;
            this.$emit('fecharFormulario');
        }
    },
    props: {
        dialogTrocarSenha: Boolean
    },
    watch: {
        dialogTrocarSenha() {
            this.$refs.form.reset();
            this.error = false;
        }
    }
}
</script>