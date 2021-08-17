<template>
    <v-row 
    justify="center"
    class="my-2"
    no-gutters>

        <div>
            <v-icon 
            large 
            color="success"
            >mdi-check-circle-outline</v-icon>
        </div>

        <v-col 
        cols="12" 
        justify="center" 
        class="d-flex justify-center">
            <h2 class="font-weight-light" v-if="!it.almoxarifadoPossui">Compra do item realizada por</h2>
            <h2 class="font-weight-light" v-else>Item retirado no</h2>
        </v-col>

        <v-col
        cols="12"
        class="d-flex justify-center mt-2"
        >
            <v-chip 
            large 
            class="mb-4" 
            color="success darken-2" 
            outlined
            v-if="!it.almoxarifadoPossui"
            >
                <h1 class="success--text text--darken-2 font-weight-light">
                    {{ it.direcionamentoDeCompra }}
                </h1>
            </v-chip>

            <v-chip 
            large 
            class="mb-4" 
            color="success darken-2" 
            outlined
            v-else
            >
                <h1 class="success--text text--darken-2 font-weight-light">
                    Almoxarifado
                </h1>
            </v-chip>
        </v-col>
        
        <v-col 
        cols="12" 
        class="text-center">
            <div
            v-if="!it.almoxarifadoPossui && it.direcionamentoDeCompra === 'Demap'">
                <div 
                class="text--subtitle-1 text-center success--text text--darken-3">
                    Valor total gasto
                </div>
                <div 
                class="font-weight-light text-h4 text-center success--text text--darken-3">
                    {{ Number(it.valorGasto).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }}
                </div>
            </div>
        </v-col>

        <v-col
        cols="12">
        <v-divider class="ma-3"></v-divider>
            <div class="text-center">
                <div class="text-body-2 grey--text text--darken-1">
                    Recebimento:
                </div>
                <div class="text-body-1 font-weight-normal">
                    {{ it.recebimento }}
                </div>
                <div class="text-body-1 font-weight-light">
                    {{ it.emailRecebimento }}
                </div>
            </div>
        </v-col>

    </v-row>
</template>

<script>
export default {
    props: {
        it: Object
    },
    setup() {
        
    },
}
</script>