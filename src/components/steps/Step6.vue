<template>
    <div>
        <div v-for="(it, idx) in inputItem.items" :key="idx">
            <div v-if="it.aprovadoFiscal">
                <v-row>
                    <v-col 
                    cols="12"
                    sm="4"
                    md="4">
                        <v-list>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-subtitle>
                                        Item
                                    </v-list-item-subtitle>
                                    <h3>{{ it.nome }}</h3>
                                    <v-list-item-subtitle class="mt-6">
                                        <div>Categoria</div>
                                    </v-list-item-subtitle>
                                    <p :class="`text-justify body-1 ${(it.categoria === `Sob Demanda`) ? ``: `red--text`}`">
                                        <v-icon 
                                        dense 
                                        :color="(it.categoria === `Sob Demanda`) ? ``: `red`" 
                                        v-if="(it.categoria !== `Sob Demanda`)">mdi-alert-octagon-outline</v-icon>
                                        {{ it.categoria }}
                                    </p>
                                    <v-list-item-subtitle class="mt-6">
                                        Finalidade
                                    </v-list-item-subtitle>
                                    <p class="text-justify body-1">
                                        {{ it.finalidade }}
                                    </p>
                                    <v-list-item-subtitle class="mt-6">
                                        Quantidade
                                    </v-list-item-subtitle>
                                    <v-list-item-title>
                                        {{ `${it.quantidade} ${it.unidade}`}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>

                    <v-col 
                    cols="12"
                    sm="5"
                    md="5">
                        <v-list>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-subtitle>
                                        Descrição
                                    </v-list-item-subtitle>
                                    <p class="text-justify body-1">
                                        {{ it.descricao }}
                                    </p>
                                </v-list-item-content>
                            </v-list-item>
                            <v-row>
                                <v-col cols="12" xs="12" sm="6">
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                                Valor unitário de referência
                                            </v-list-item-subtitle>
                                            <p :class="`font-weight-light text-h5 ${(it.valorUnitario === null) ? `red--text` : ``}`">
                                                {{ getValorMonetario(it.valorUnitario) }}
                                            </p>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col cols="12" xs="12" sm="6" v-if="it.valorTotal !== null && it.valorTotal !== undefined">
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                                Valor total estimado
                                            </v-list-item-subtitle>
                                            <p class="font-weight-light text-h4">
                                                {{ getValorMonetario(it.valorTotal) }}
                                            </p>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                            </v-row>
                        </v-list>
                    </v-col>

                    <v-col 
                    cols="12"
                    sm="3"
                    md="3">
                        <v-row 
                        justify="center" 
                        class="mt-12" 
                        v-if="!it.almoxarifadoPossui">
                            <v-col cols="12" justify="center" class="d-flex justify-center">
                                <h2 class="font-weight-light"> Compra do item realizada por</h2>
                            </v-col>

                            <v-row
                            justify="center"
                            no-gutters>
                                <v-chip 
                                large 
                                class="mb-4" 
                                color="success darken-2" 
                                outlined
                                >
                                    <h1 class="success--text text--darken-2 font-weight-light">
                                        {{ it.direcionamentoDeCompra }}
                                    </h1>
                                </v-chip>
                            </v-row>

                            
                            <v-col cols="12" class="d-flex justify-center">
                                <v-col cols="12">
                                    <div 
                                    class="text--subtitle-1 text-center success--text text--darken-3">
                                        Valor total gasto
                                    </div>
                                    <div 
                                    class="font-weight-light text-h4 text-center success--text text--darken-3">
                                        {{ Number(it.valorGasto).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }}
                                        <v-icon 
                                        large 
                                        color="success"
                                        >mdi-check-bold</v-icon>
                                    </div>
                                </v-col>
                            </v-col>
                            

                        </v-row>

                        <v-row 
                        justify="center" 
                        class="mt-12" 
                        v-else>
                            <v-col cols="12" justify="center" class="d-flex justify-center">
                                <h2 class="font-weight-light"> Item retirado no</h2>
                            </v-col>
                            
                            <v-chip 
                            large class="mb-4" 
                            color="success" 
                            outlined>
                                <h1 class="success--text text--darken-2 font-weight-light">
                                    Almoxarifado
                                </h1>
                            </v-chip>
                            <v-col 
                            cols="12" 
                            class="text-center">
                                <v-icon 
                                large 
                                color="success">mdi-check-bold</v-icon>
                            </v-col>
                        </v-row>
                        
                    </v-col>
                </v-row>
                <v-divider class="my-4"></v-divider>
            </div>
        </div>
        <v-row no-gutters justify="center">
            <v-col cols="12" xs="12" sm="6" md="5" align="center">
                <div>
                    <h3 class="font-weight-light success--text text-h6">{{inputItem.dataFinalizacao}} às {{inputItem.horarioFinalizacao}}</h3>
                    <h1 class="font-weight-regular success--text">Solicitação finalizada com sucesso!</h1>
                    <v-icon
                    x-large
                    color="success"
                    >mdi-check-circle-outline</v-icon>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>

export default {
    data() {
        return {
        }
    },
    props: {
        inputItem: Object
    },
    methods: {
        getValorMonetario(valor){
            if (valor !== undefined && valor !== null) {
                return Number(valor).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            } else {
                return `Item não cadastrado!`
            }
        }
    }
}

</script>