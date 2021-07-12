<template>
    <div>
        <v-row no-gutters>
            <v-col 
            cols="12"
            class="d-flex justify-center">
                <v-switch 
                v-model="it.aprovadoFiscal"
                required
                label="Aprovado" 
                color="success">
                </v-switch>
            </v-col>

            <v-col 
            cols="12"
            v-if="it.aprovadoFiscal">
                <h2 class="body-1 font-weight-bold">Na ausência do item no almoxarifado (DILOG), a compra deverá ser realizada por:</h2>
                <v-col cols="12" align="center" class="d-flex justify-center">
                    <v-radio-group 
                    v-model="it.direcionamentoDeCompra" 
                    row>
                        <v-radio
                            :label="`Engemil`"
                            value="Engemil"
                            :disabled="!it.valorUnitario"
                        ></v-radio>
                        <v-radio
                            :label="`Demap`"
                            value="Demap"
                        ></v-radio>
                    </v-radio-group>
                </v-col>
            </v-col>

            <v-col 
            cols="12"
            v-else>
                <v-textarea
                v-model="it.motivoFiscal"
                label="Descrição do motivo"
                auto-grow
                :counter="200"
                clearable
                outlined
                v-if="!it.aprovadoFiscal"
                ></v-textarea>

                <h2 
                class="font-weight-light red--text mb-6 text-center" 
                v-if="errorDirecionamento && (it.direcionamentoDeCompra===undefined || it.direcionamentoDeCompra===null)">
                    {{errorMessageDirecionamento}}
                </h2> 
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        it: Object
    },
    data() {
        return {
            errorDirecionamento: false,
            errorMessageDirecionamento: ""
        }
    },
}
</script>