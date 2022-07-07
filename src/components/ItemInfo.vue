<template>
    <v-row>
        <v-col
        cols="12"
        sm="6"
        md="6">
            <v-list :class="greyRow">
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
                            <span v-if="!engageEdit">
                                {{ `${it.quantidade} ${it.unidade}`}}
                            </span>
                            <span v-else>
                                <v-text-field 
                                outlined
                                v-model="temp">
                                </v-text-field>
                            </span>
                            <v-btn 
                            v-if="$store.getters.getRole === 'admin'"
                            icon
                            @click="engageEdit = !engageEdit; temp = it.quantidade">
                                <v-icon small v-if="!engageEdit">
                                    mdi-pencil
                                </v-icon>
                                <v-icon v-else>
                                    mdi-close-circle
                                </v-icon>
                            </v-btn>
                            <v-btn 
                            v-if="$store.getters.getRole === 'admin' && engageEdit"
                            icon
                            :loading="loading"
                            @click="updateCurrentPedido()">
                                <v-icon>
                                    mdi-check-bold
                                </v-icon>
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-col>
        <v-col
        cols="12"
        sm="6"
        md="6">
            <v-list :class="greyRow">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle>
                            Descrição
                        </v-list-item-subtitle>
                        <p class="text-justify body-1" v-if="it.descricao">
                            {{ it.descricao }}
                        </p>
                        <p class="text-justify body-1 grey--text" v-else>
                            Nenhuma descrição informada.
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
                                <p :class="`font-weight-light text-h5`">
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
        greyRow: String,
        it: Object,
        idx: Number
    },
    data() {
        return {
            engageEdit: false,
            temp: 0,
            loading: false
        }
    },
    methods: {
        getValorMonetario(valor) {
            if (valor !== null && valor !== null) {
                return Number(valor).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
            } else{
                return `Item não cadastrado!`
            }
        },
        updateCurrentPedido() {
            this.loading = true;
            this.$store.dispatch('updateCurrentPedidoDireto', {temp: this.temp, idx: this.idx})
            .then(() => {
                this.$store.commit('SET_SNACKBAR', {message: "Quantidade do item alterada com sucesso", color: "success"})
            })
            .catch(error => {
                console.log(error)
                this.$store.commit('SET_SNACKBAR', {message: "Ocorreu um erro na tentativa de alterar a quantidade.", color: "error"})
            })
            .finally(() => {
                this.loading = false;
                this.engageEdit = false;
            })
        }
    }
}
</script>
