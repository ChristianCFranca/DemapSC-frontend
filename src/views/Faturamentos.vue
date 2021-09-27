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
                                Solicitar Faturamento
                                <v-spacer></v-spacer>
                            </v-card-title>
                            <v-divider class="mx-4"></v-divider>
                                <v-card-text class="justify-center">
                                    <v-row>
                                        <v-col cols="12" xs="12" md="12">
                                            <p class="text-subtitle-1">
                                                Empresa:
                                            </p>
                                            <v-select
                                            v-model="faturamentoInfo.empresa"
                                            :items="$store.getters.getAllEmpresasNames"
                                            attach
                                            chips
                                            required
                                            outlined
                                            :label="`Selecione a empresa o qual quer o faturamento`"
                                            :disabled="loadingEmpresas"
                                            :loading="loadingEmpresas">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" xs="12" md="6">
                                            <p class="text-subtitle-1">
                                                Mês:
                                            </p>
                                            <v-select
                                            v-model="faturamentoInfo.mes"
                                            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                                            attach
                                            chips
                                            required
                                            outlined
                                            :label="`Selecione o mês para a fatura`">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" xs="12" md="6">
                                            <p class="text-subtitle-1">
                                                Ano:
                                            </p>
                                            <v-select
                                            v-model="faturamentoInfo.ano"
                                            :items="[2021, 2022, 2023, 2024, 2025, 2026]"
                                            attach
                                            chips
                                            required
                                            outlined
                                            :label="`Selecione o ano para a fatura`">
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
                                    @click="gerarFaturamento()">Gerar</v-btn>

                                </v-card-actions>
                        </v-card>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>
        <v-container fluid class="pb-14 fill-height" v-else>
            <v-row class="d-flex justify-center">
                <p class="text-h3 mb-4 font-weight-light">
                    Você não possui permissão para obter faturamentos. <v-icon x-large>mdi-emoticon-sad-outline</v-icon>
                </p>
            </v-row>
        </v-container>
        <v-container fluid class="pb-14 fill-height" v-if="downloadURL">
            <v-row class="d-flex justify-center">
                <p class="text-h3 mb-4 font-weight-light">
                    <a :href="downloadURL"></a>
                </p>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            faturamentoInfo: {
                empresa: null,
                mes: null,
                ano: null
            },
            loadingEmpresas: false,
            downloadURL: null,
            loading: false,
            valid: false
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
        gerarFaturamento() {
            if (!this.$refs.form.validate()) return

            this.loading = true;

            this.$store.dispatch('getFaturamento', this.faturamentoInfo)
            .then(data => {
                this.$store.commit('SET_SNACKBAR', {message: "Faturamento obtido com sucesso.", color: "success"});
                this.downloadURL = data.download_url;
                this.resetForm();
            })
            .catch(error => {
                if (error ?.response ?.status === 401) {
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