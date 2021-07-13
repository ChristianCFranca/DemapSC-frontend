<template>
    <div>
        <v-row 
        no-gutters
        v-if="userCanApprove">
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
    methods: {
        showValue() {
            console.log(this.it.motivoAssistente)
        }
    },
    computed: {
        userCanApprove() {
            return this.$store.getters.getApprovalsForRoles[this.$store.getters.getCurrentPedido.statusStep].includes(this.$store.getters.getRole);
        }
    }
}
</script>