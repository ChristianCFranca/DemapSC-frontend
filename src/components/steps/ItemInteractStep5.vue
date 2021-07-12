<template>
    <div>
        <v-row 
        justify="center" 
        class="mt-8" 
        no-gutters>
            <v-col 
            cols="12" 
            justify="center" 
            class="d-flex justify-center">
                <h2 class="font-weight-light" v-if="!it.almoxarifadoPossui">Aguardando compra do item por</h2>
                <h2 class="font-weight-light" v-else>Item aguardando retirada no</h2>
            </v-col>

            <v-col
            cols="12"
            class="d-flex justify-center mt-2"
            >
                <v-chip 
                large 
                class="mb-4" 
                color="teal darken-2" 
                outlined
                v-if="!it.almoxarifadoPossui"
                >
                    <h1 class="font-weight-light">
                        {{ it.direcionamentoDeCompra }}
                    </h1>
                </v-chip>

                <v-chip 
                large 
                class="mb-4" 
                color="indigo darken-2" 
                outlined
                v-else
                >
                    <h1 class="font-weight-light">
                        Almoxarifado
                    </h1>
                </v-chip>
            </v-col>
            
            <v-col 
            cols="12" 
            class="text-center">
                <v-icon 
                large 
                color="teal darken-2"
                v-if="!it.almoxarifadoPossui"
                >mdi-account-cash-outline</v-icon>
                <v-icon 
                large 
                color="indigo darken-2"
                v-else
                >mdi-archive-arrow-up-outline</v-icon>
            </v-col>

            <v-col 
            cols="12" 
            sm="8"
            class="mt-4">
                <v-currency-field
                v-model="it.valorGasto"
                outlined
                clearable
                label="Valor total gasto*"
                hint="Digite o valor total gasto no item"
                class="rounded-tr-xl"
                prepend-inner-icon="mdi-cash"
                :rules="cashRules"
                required
                validate-on-blur
                v-if="!it.almoxarifadoPossui"></v-currency-field>

                <div v-else>
                    <div class="text-body-2 font-weight-bold text-center">
                        Informações da DILOG:
                    </div>
                    <div class="text-body-2 text-center">
                        {{ it.infoDILOG }}
                    </div>
                </div>
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
            cashRules: [v => !!v || "Campo obrigatório.", v => v != "0,00" || "Valor deve ser maior que 0."],
        }
    },
}
</script>