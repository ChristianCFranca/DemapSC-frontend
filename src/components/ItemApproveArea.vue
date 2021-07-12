<template>
    <v-row 
    v-if="item.active">
        <v-col 
        cols="12" 
        xs="12" 
        v-if="item.statusStep === 6"
        >
            <div>
                <h1 class="font-weight-regular success--text">Solicitação finalizada com sucesso!</h1>
                <v-icon
                x-large
                color="success"
                >mdi-check-circle-outline</v-icon>
            </div>
        </v-col>

        <v-row
        v-else>
            <v-col 
            cols="12">
                <h2 class="my-4">
                    Aguardando aprovação do(a) {{ cargoAtual }}:
                </h2>
            </v-col>
            <v-col 
            cols="12">
                <v-btn
                color="blue darken-1"
                class="white--text"
                :loading="loadingBtnSend"
                :disabled="!item.items.some(function(obj){return obj['aprovadoAssistente'] === true})"
                @click="keyCheck(`send`)">
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
                @click="keyCheck(`cancel`)">
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
    computed: {
        cargoAtual() {
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
        }
    }
}
</script>