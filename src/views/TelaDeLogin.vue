<template>
    <v-container fluid class="mt-14">
        
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
                        <v-card-title class="justify-center">
                            Login
                            <v-spacer></v-spacer>
                            <v-btn
                            text
                            color="blue">
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
                                    v-model="username"
                                    :rules="usernameRules"
                                    required
                                    class="rounded-lg"
                                    label="Digite seu e-mail"
                                    outlined></v-text-field>
                                <p class="text-subtitle-1">
                                    Senha:
                                    
                                </p><v-text-field 
                                    v-model="password"
                                    :rules="passwordRules"
                                    required
                                    class="rounded-lg"
                                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                    label="Digite sua senha"
                                    outlined
                                    :type="show ? `` : `password`"
                                    @click:append="show=!show"></v-text-field>
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
                                large>Entrar</v-btn>
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
            username: null,
            usernameRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+@.+\..+\..+/.test(v) || 'E-mail deve ser válido.', 
                v => /.+@bcb.gov.br/.test(v) || 'Domínio deve ser bcb.gov.br'
                ],
            password: null,
            passwordRules: [
                v => !!v || 'Campo obrigatório.'
                ],
            valid: false,
            show: false
        }
    },
    methods: {
        resetValidation() {
            this.$refs.form.reset()
        }
    }
}
</script>
