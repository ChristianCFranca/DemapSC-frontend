<template>
    <div>
        <v-row 
        no-gutters
        v-if="userCanApprove && itemActive">
            <v-col 
            cols="12"
            class="d-flex justify-center align-center">
                <v-switch 
                v-model="it.aprovadoAssistente"
                label="Aprovado" 
                color="success"></v-switch>
            </v-col>
            <v-col
            cols="12"
            v-if="!it.aprovadoAssistente">
                <v-textarea
                    v-model="it.motivoAssistente"
                    label="Descrição do motivo"
                    auto-grow
                    :counter="200"
                    clearable
                    outlined
                    v-if="!it.aprovadoAssistente"
                ></v-textarea>
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
        userCanApprove: Boolean,
        itemActive: Boolean
    },
    data() {
        return {
        }
    },
    methods: {
        showValue() {
            console.log(this.it.motivoAssistente)
        }
    }
}
</script>