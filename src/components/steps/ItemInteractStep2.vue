<template>
    <div>
        <v-row 
        no-gutters>
            <v-col 
            cols="12"
            class="d-flex justify-center align-center">
                <v-switch v-model="it.aprovadoAssistente"
                label="Aprovado" 
                color="success"></v-switch>
            </v-col>

            <v-col
            cols="12"
            v-if="!it.motivoAssistente">
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
    </div>
</template>

<script>
export default {
    props: {
        it: Object
    },
    data() {
        return {

        }
    },
}
</script>