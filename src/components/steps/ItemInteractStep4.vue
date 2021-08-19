<template>
    <div>
        <v-row 
        justify="center"
        v-if="userCanApprove && it.aprovadoFiscal && itemActive && it.categoria !=='Fixo'">
            <v-col cols="12" class="d-flex justify-center">
                <v-switch 
                inset
                v-model="it.almoxarifadoPossui"
                :label="it.almoxarifadoPossui ? `Possui em estoque`: `Não possui em estoque`" 
                color="blue"
                class="mt-15"
                ></v-switch>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
                <v-textarea
                v-model="it.infoDILOG"
                label="Informações adicionais por parte da DILOG (opcional)"
                auto-grow
                :counter="200"
                clearable
                outlined
                v-if="it.almoxarifadoPossui"
                ></v-textarea>
            </v-col>
        </v-row>
        <v-row 
        no-gutters
        v-if="userCanApprove && it.aprovadoAssistente && itemActive && it.categoria ==='Fixo'">
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
        v-if="!it.aprovadoFiscal || !itemActive"/>
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
        userCanApprove: Boolean,
        itemActive: Boolean
    },
    data() {
        return {

        }
    },
}
</script>