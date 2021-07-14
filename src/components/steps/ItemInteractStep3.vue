<template>
    <div>
        <v-row 
        no-gutters
        v-if="userCanApprove && itemActive">
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
        <v-row
        v-else>
            <v-col
            cols="12">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle
                        class="text-body-2">
                            Motivo do Assistente
                        </v-list-item-subtitle>
                        <p class="text-justify text-body-1">
                            {{ it.motivoAssistente ? it.motivoAssistente : `Não informado` }}
                        </p>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle
                        class="text-body-2">
                            Motivo do Fiscal
                        </v-list-item-subtitle>
                        <p class="text-justify text-body-1">
                            {{ it.motivoFiscal ? it.motivoFiscal : `Não informado` }}
                        </p>
                    </v-list-item-content>
                </v-list-item>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        it: Object,
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