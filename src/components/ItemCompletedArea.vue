<template>
    <div>
        <v-row>
            <v-col 
            cols="12" 
            xs="12" 
            v-if="itemActive">
                <div>
                    <h1 class="font-weight-regular success--text">
                        Solicitação finalizada com sucesso!
                    </h1>
                    <h2 class="font-weight-regular success--text">
                        em
                        <span class="font-weight-bold">{{item.dataFinalizacao}}</span> às 
                        <span class="font-weight-bold">{{item.horarioFinalizacao}}</span>
                    </h2>
                    <v-icon
                    x-large
                    color="success"
                    >mdi-check-circle-outline</v-icon>
                </div>
            </v-col>

            <v-col 
            cols="12" 
            xs="12"
            v-else>
                <div>
                    <h1 class="font-weight-regular red--text">
                        Solicitação cancelada.
                    </h1>
                    <h2 class="font-weight-regular red--text">
                        <span class="font-weight-bold">{{item.canceladoPor}}</span> em
                        <span class="font-weight-bold">{{item.dataCancelamento}}</span> às 
                        <span class="font-weight-bold">{{item.horarioCancelamento}}</span>
                    </h2>
                    <v-icon
                    x-large
                    color="red"
                    >mdi-cancel</v-icon>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        item: Object,
        itemActive: Boolean
    },
    data() {
        return {
        }
    }
}
</script>