<template>
    <v-row
    class="mt-3">
        <v-col cols="12" align-self="center">
            <div class="red--text text-body-1 text-center">
                <v-icon class="red--text mb-1">mdi-cancel</v-icon>
                CANCELADO
            </div>
        </v-col>
        <v-col
        cols="12">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-subtitle
                    class="text-body-2">
                        Motivo do Assistente
                    </v-list-item-subtitle>
                    <p :class="it.motivoAssistente ? `text-justify text-body-1` : `text-justify text-body-1 grey--text font-weight-light`">
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
                    <p :class="it.motivoFiscal ? `text-justify text-body-1` : `text-justify text-body-1 grey--text font-weight-light`">
                        {{ it.motivoFiscal ? it.motivoFiscal : `Não informado` }}
                    </p>
                </v-list-item-content>
            </v-list-item>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        it: Object
    },
    data() {
        return {}
    },
}
</script>
