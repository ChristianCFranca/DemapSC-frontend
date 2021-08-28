<template>
    <div>
        <v-row 
        no-gutters
        v-if="userCanApprove && itemActive && it.categoria!=='Fixo'">
            <v-col 
            cols="12"
            class="d-flex justify-center">
                <v-tooltip left max-width="400">
                    <template v-slot:activator="{on, attrs}">
                        <v-icon 
                        v-bind="attrs"
                        v-on="on"
                        v-if="!it.aprovadoAssistente" 
                        left 
                        color="warning">
                            mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>
                        O assistente recusou este item
                        <span v-if="it.motivoAssistente">
                            com o seguinte motivo: 
                            <span class="text-body-1">
                                {{it.motivoAssistente}}
                            </span>
                        </span>
                        <span v-else>
                            . Nenhum motivo foi dado.
                        </span>
                        <br/>
                        <br/>
                        Você pode continuar recusando este item e dar um motivo (opcional) ou você pode aprová-lo.
                    </span>
                </v-tooltip>
                <v-switch 
                v-model="it.aprovadoFiscal"
                required
                label="Aprovado" 
                color="success"
                @click="it.direcionamentoDeCompra = null">
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
                            :label="empresa"
                            :value="empresa"
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
        <v-row 
        no-gutters
        v-if="userCanApprove && it.aprovadoAssistente && itemActive && it.categoria==='Fixo'">
            <v-col 
            cols="12"
            class="d-flex justify-center">
                <div class="text-h6 font-weight-regular">
                    Este item é de categoria <span class="font-weight-bold">'Fixo'</span>.
                </div>
            </v-col>
            <v-col 
            cols="12"
            class="d-flex justify-center my-4">
                <v-divider></v-divider>
            </v-col>
            <v-col 
            cols="12"
            class="d-flex justify-center">
                <div class="text-body-2 font-weight-regular text-center">
                    Itens da categoria 'fixo' devem ser providenciados diretamente pela contratada. Não há necessidade de aprovação e direcionamento neste caso.
                </div>
            </v-col>
        </v-row>
        <ItemInteractRefused 
        :it="it"
        v-if="!itemActive"/>
    </div>
</template>

<script>
import ItemInteractRefused from './ItemInteractRefused.vue'

export default {
    components: {
        ItemInteractRefused
    },
    props: {
        it: Object,
        empresa: String,
        userCanApprove: Boolean,
        itemActive: Boolean
    },
    data() {
        return {
            errorDirecionamento: false,
            errorMessageDirecionamento: ""
        }
    },
}
</script>