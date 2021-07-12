<template>
    <div>
        <v-row justify="center">
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
                label="Informações adicionais por parte da DILOG"
                auto-grow
                :counter="200"
                clearable
                outlined
                v-if="it.almoxarifadoPossui"
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