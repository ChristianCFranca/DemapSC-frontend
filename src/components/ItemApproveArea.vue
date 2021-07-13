<template>
    <v-row 
    v-if="item.active">
        <v-col 
        cols="12" 
        xs="12" 
        v-if="item.statusStep === 6">
            <div>
                <h1 class="font-weight-regular success--text">Solicitação finalizada com sucesso!</h1>
                <v-icon
                x-large
                color="success"
                >mdi-check-circle-outline</v-icon>
            </div>
        </v-col>

        <v-row
        v-if="userCanApprove">
            <v-col 
            cols="12">
                <h2 class="my-4">
                    Aguardando aprovação do(a) {{ cargoEmQuestao }}:
                </h2>
            </v-col>
            <v-col 
            cols="12">
                <v-btn
                color="blue darken-1"
                class="white--text"
                :loading="loadingBtnSend"
                :disabled="!currentValidStep"
                @click="send(true)">
                    {{ approveText }}
                </v-btn>
            </v-col>
            <v-col 
            cols="12">
                <v-btn
                dark
                text
                color="red"
                :loading="loadingBtnCancel"
                @click="send(false)">
                    Cancelar Solicitação
                </v-btn>
            </v-col>
            <v-col 
            cols="12">
                <h2 class="font-weight-light red--text" v-if="error">
                    {{errorMessage}}
                </h2>
            </v-col>
        </v-row>

    </v-row>
</template>

<script>
export default {
    data() {
        return {
            loadingBtnSend: false,
            loadingBtnCancel: false,
            error: false,
            errorMessage: null
        }
    },
    methods: {
        send(confirm) {
            if (confirm) {
                this.loadingBtnSend = true;
                this.$store.dispatch('updateCurrentPedido')
                .finally(() => {
                    this.loadingBtnSend = false;
                })
            }
            else {
                this.loadingBtnCancel = false;
                this.$store.dispatch('cancelCurrentPedido')
                .finally(() => {
                    this.loadingBtnCancel = false;
                })
            }
        }
    },
    computed: {
        cargoEmQuestao() {
            if (this.item.statusStep === 2) 
                return `assistente de fiscalização`
            else if (this.item.statusStep === 3) 
                return `fiscal`
            else if (this.item.statusStep === 4) 
                return `DILOG`
            else
                return `fiscal ou da engemil de um ou mais itens correspondentes`
        },
        approveText() {
            if (this.item.statusStep === 5) 
                return `Confirmar Aquisição`
            else
                return `Enviar Aprovação`
        },
        item() {
            return this.$store.getters.getCurrentPedido;
        },
        userCanApprove() {
            return this.$store.getters.getApprovalsForRoles[this.$store.getters.getCurrentPedido.statusStep].includes(this.$store.getters.getRole);
        },
        validStep2() {
            return this.item.items.some(item => item.aprovadoAssistente)
        },
        currentValidStep() {
            if (this.$store.getters.getCurrentPedido.statusStep === 2)
                return this.validStep2
            return true
        }
    }
}
</script>