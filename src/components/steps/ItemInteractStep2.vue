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
                color="success"
                @click="it.motivoAssistente = null"></v-switch>
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
        }
    },
    methods: {
        showValue() {
            console.log(this.it.motivoAssistente)
        }
    }
}
</script>