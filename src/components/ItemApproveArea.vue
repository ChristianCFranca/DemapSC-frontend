<template>
    <div class="mx-2">
        <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
                <v-card-title class="headline">Tem certeza que deseja cancelar essa solicitação?</v-card-title>
                <v-card-text>
                    <v-textarea
                    v-model="item.motivoCancelamento"
                    label="Conte o motivo (opcional) ..."
                    outlined
                    required
                    counter="200"
                    auto-grow>
                    </v-textarea>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = !dialogDelete">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="send(false)" :loading="loadingBtnCancel">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-row 
        v-if="item.active">
            <v-row
            v-if="userCanApprove || userCanCancel"
            class="mb-3">
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
                    @click="dialogDelete = true">
                        Cancelar Solicitação
                    </v-btn>
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
            dialogDelete: false
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
                if (this.item.motivoCancelamento) if (this.item.motivoCancelamento.length > 200) return
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
            else {
                if (this.$store.getters.getCurrentUserEmpresas)
                    return `fiscal ou da ${this.item.empresa} de um ou mais itens correspondentes`
                else
                    return `fiscal de um ou mais itens correspondentes`
            }
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
            return this.item.items.every(item => item.direcionamentoDeCompra || !item.aprovadoFiscal || item.categoria === 'Fixo') &&
            this.item.items.some(item => item.aprovadoFiscal)
        },
        validStep4() {
            return this.item.items.every(item => {
                if (item.almoxarifadoPossui && item.infoDILOG) {
                    if (item.infoDILOG.length > 200)
                        return false
                }
                return true
            })
        },
        currentValidStep() {
            if (this.item.statusStep === 2)
                return this.validStep2
            if (this.item.statusStep === 3)
                return this.validStep3
            if (this.item.statusStep === 4)
                return this.validStep4
            return true
        }
    },
    watch: {
        dialogDelete() {
            this.item.motivoCancelamento = null;
        }
    }
}
</script>