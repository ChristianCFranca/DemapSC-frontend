<template>
    <v-row>
        <v-col
        cols="12"
        sm="6"
        md="6">
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
        sm="6"
        md="6">
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
    </v-row>
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
        getValorMonetario(valor) {
            if (valor !== null && valor !== null) {
                return Number(valor).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            } else{
                return `Item não cadastrado!`
            }
        }
    }
}
</script>