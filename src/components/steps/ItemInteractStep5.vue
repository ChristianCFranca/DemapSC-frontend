<template>
    <div>
        <v-row 
        justify="center"
        class="my-2"
        no-gutters
        v-if="userCanApprove && it.aprovadoFiscal && !it.recebido && itemActive">
        
            <div>
                <v-icon 
                large 
                color="warning darken-1"
                class="pt-3"
                >mdi-dots-horizontal</v-icon>
            </div>

            <v-col 
            cols="12" 
            justify="center" 
            class="d-flex justify-center">
                <h2 class="font-weight-light" v-if="!it.almoxarifadoPossui">Aguardando compra do item por</h2>
                <h2 class="font-weight-light" v-else>Item aguardando retirada no</h2>
            </v-col>

            <v-col
            cols="12"
            class="d-flex justify-center mt-2"
            >
                <v-chip 
                large 
                class="mb-4" 
                color="warning darken-1" 
                outlined
                v-if="!it.almoxarifadoPossui"
                >
                    <h1 class="font-weight-light">
                        {{ it.direcionamentoDeCompra }}
                    </h1>
                </v-chip>

                <v-chip 
                large 
                class="mb-4" 
                color="warning darken-1" 
                outlined
                v-else
                >
                    <h1 class="font-weight-light">
                        Almoxarifado
                    </h1>
                </v-chip>
            </v-col>
            
            <v-col 
            cols="12" 
            class="text-center">
                <v-icon 
                large 
                color="warning darken-1"
                v-if="!it.almoxarifadoPossui"
                >mdi-account-cash-outline</v-icon>
                <v-icon 
                large 
                color="warning darken-1"
                v-else
                >mdi-archive-arrow-up-outline</v-icon>
            </v-col>

            <v-col 
            cols="12" 
            sm="8"
            class="mt-4">
                <v-form ref="send">
                    <v-currency-field
                    v-model="it.valorGasto"
                    outlined
                    clearable
                    label="Valor total gasto*"
                    hint="Digite o valor total gasto no item"
                    class="rounded-tr-xl"
                    prepend-inner-icon="mdi-cash"
                    :rules="cashRules"
                    required
                    validate-on-blur
                    v-if="!it.almoxarifadoPossui"></v-currency-field>

                    <div v-else>
                        <div class="text-body-2 font-weight-bold text-center">
                            Informações da DILOG:
                        </div>
                        <div :class="it.infoDILOG ? `text-body-2 text-center` : `text-body-2 font-weight-light text-center grey--text`">
                            {{ it.infoDILOG ? it.infoDILOG : `Não informado` }}
                        </div>
                    </div>
                </v-form>
            </v-col>

            <v-col
            cols="12"
            class="text-center mt-3"
            align-self="center">
                    <v-btn 
                    class="blue white--text"
                    :disabled="!specificApproval()"
                    :loading="loadingBtnSend"
                    @click="send($refs.send.validate())">
                        Confirmar Aquisição
                    </v-btn>
            </v-col>
        </v-row>
        <ItemInteractCompleted
        :it="it"
        v-if="userCanApprove && it.aprovadoFiscal && it.recebido && itemActive"
        />
        <ItemInteractRefused 
        :it="it"
        v-if="!it.aprovadoFiscal || !itemActive"/>
    </div>
</template>

<script>
import ItemInteractRefused from './ItemInteractRefused.vue'
import ItemInteractCompleted from './ItemInteractCompleted.vue'

export default {
    components: {
        ItemInteractRefused,
        ItemInteractCompleted
    },
    props: {
        it: Object,
        userCanApprove: Boolean,
        itemActive: Boolean,
        idx: Number
    },
    data() {
        return {
            cashRules: [v => !!v || "Campo obrigatório.", v => v != "0,00" || "Valor deve ser maior que 0."],
            loadingBtnSend: false
        }
    },
    methods: {
        specificApproval() {
            const isDemap = this.it.direcionamentoDeCompra === "Demap" && !this.it.almoxarifadoPossui;
            if (this.$store.getters.getRole !== "fiscal") {
                if (isDemap) return false;
                else return true;
            } else return true;
        },
        send(valid) {
            if(!valid)
                return

            this.loadingBtnSend = true;
            this.$store.dispatch('finishCurrentPedido', this.idx)
            .finally(() => {
                this.loadingBtnSend = false;
            })
        }
    }
}
</script>