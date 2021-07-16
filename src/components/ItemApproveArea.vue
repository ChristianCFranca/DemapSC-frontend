<template>
    <div>
        <v-row 
        v-if="item.active">
            <v-row
            v-if="userCanApprove || userCanCancel">
                <v-col 
                cols="12">
                    <h2 class="my-4">
                        Aguardando aprovação do(a) {{ cargoEmQuestao }}.
                    </h2>
                </v-col>
                <v-col 
                cols="12"
                v-if="userCanApprove && item.statusStep <= 4">
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
                cols="12"
                v-if="userCanCancel">
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
    </div>
</template>

<script>
export default {
    props: {
        item: Object,
        userCanApprove: Boolean,
        userCanCancel: Boolean
    },
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
                this.loadingBtnCancel = true;
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
        validStep2() {
            return this.item.items.some(item => item.aprovadoAssistente)
        },
        validStep3() {
            return this.item.items.every(item => item.direcionamentoDeCompra || !item.aprovadoFiscal) &&
            this.item.items.some(item => item.aprovadoFiscal)
        },
        currentValidStep() {
            if (this.item.statusStep === 2)
                return this.validStep2
            if (this.item.statusStep === 3)
                return this.validStep3
            return true
        }
    }
}
</script>