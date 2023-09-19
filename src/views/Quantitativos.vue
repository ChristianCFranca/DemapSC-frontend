<template>
    <div>
        <v-container
        fluid
        class="mt-6">
            <v-row
            justify="center">
                <v-col
                cols="4">
                    <v-select
                    v-model="dataForRequest.tipo"
                    label="Selecione o tipo de quantitativo que deseja verificar"
                    required
                    :items="tipos"
                    item-text="text"
                    item-value="value"
                    :rules="nonEmptyRules"
                    clearable
                    outlined>
                    </v-select>
                </v-col>
            </v-row>
            <v-row
            no-gutters
            justify="center">
                <v-col
                cols="3"
                v-if="dataForRequest.tipo==1">
                    <v-select
                    v-model="dataForRequest.empresa"
                    label="Selecione a empresa que deseja ver o quantitativo de itens"
                    required
                    :items="$store.getters.getCurrentUserEmpresas"
                    :rules="nonEmptyRules"
                    clearable
                    outlined>
                    </v-select>
                </v-col>
                <v-col
                cols="2">
                    <v-select
                    v-model="dataForRequest.mes"
                    label="Mês de referencia"
                    required
                    :items="['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']"
                    :rules="nonEmptyRules"
                    clearable
                    outlined>
                    </v-select>
                </v-col>
                <v-col
                cols="2">
                    <v-select
                    v-model="dataForRequest.ano"
                    label="Ano de referência"
                    required
                    :items="['2021', '2022', '2023', '2024', '2025']"
                    :rules="nonEmptyRules"
                    clearable
                    outlined>
                    </v-select>
                </v-col>
            </v-row>
            <v-row
            no-gutters
            class="text-center"
            justify="center">
                <v-col
                cols="6">
                    <v-btn
                    color="blue darken-1"
                    :loading="loadingBuscar"
                    :disabled="(dataForRequest.empresa == null && dataForRequest.tipo == 1) || dataForRequest.ano == null || dataForRequest.mes == null"
                    large
                    @click="RequestQuantitativos"
                    class="text-center white--text">
                        Buscar
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="my-10"></v-divider>
        </v-container>
    
        <v-container
        fluid
        v-if="showDataEmpresa">
            <v-data-iterator
            :items="ListaDeMateriaisEmpresa"
            :search="search"
            :sorty-by="sortBy.toLowerCase()">

                <template v-slot:header>
                    <v-toolbar
                    dark
                    color="blue darken-3"
                    class="mb-5">
                        <v-text-field
                            v-model="search"
                            clearable
                            flat
                            solo-inverted
                            hide-details
                            prepend-inner-icon="mdi-magnify"
                            label="Search"
                        ></v-text-field>
                        <v-checkbox
                        v-model="filter"
                        label="Fixo"
                        value="Fixo"
                        class="mt-5 mx-5"
                        ></v-checkbox>
                        <v-checkbox
                        v-model="filter"
                        label="Sob Demanda"
                        value="Sob Demanda"
                        class="mt-5"
                        ></v-checkbox>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </template>
                
                <template v-slot:default="props">
                    <v-row>
                        <v-col
                        v-for="item in props.items"
                        :key="item.nome"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3">
                            <v-card>
                                <v-card-title class="text-body-1 font-weight-regular">
                                    {{item.nome}}
                                </v-card-title>
                                <v-card-subtitle class="text-subtitle-1 font-weight-regular">
                                    {{item.categoria}}
                                </v-card-subtitle>
                                
                                <v-divider></v-divider>
                                <v-card-text>
                                    Unidade de Medida: <span class="text-h6">{{item.medida}}</span><br>
                                    Quantidades: <span class="text-h6">{{item.utilizado}} / {{item.total}}</span> <v-icon small right :color="getColor(item)">mdi-brightness-1</v-icon>
                                    <v-divider class="mt-2"></v-divider>
                                </v-card-text>
                                <v-expansion-panels flat class="mb-2">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                                Detalhamento
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <apexchart :options="FactoryOptionsForChart(item.total, item.utilizado)" :series="[item.utilizado, item.total - item.utilizado]"></apexchart>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>
            </v-data-iterator>
        </v-container>

        <v-container
        fluid
        v-if="showDataCartaoCorp">
            <v-card class="mx-5">
                
                <v-card-title>
                <div>
                    Quantitativos do Cartão Corporativo
                </div>
                <v-spacer></v-spacer>
                <div>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-subtitle>
                                Valor total para o período
                            </v-list-item-subtitle>
                            <p class="font-weight-light text-h4">
                                {{ Number(totalValueSummedUp).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }}
                            </p>
                        </v-list-item-content>
                    </v-list-item>
                </div>
                </v-card-title>

                <v-data-table
                :headers="headers"
                :items="ListaDeMateriaisCartaoCorp"
                :items-per-page="15"
                class="elevation-1"
                multi-sort
                show-group-by>


                    <template v-slot:[`body.prepend`] v-if="!$vuetify.breakpoint.xs">
                        <tr>
                            <td>
                                <v-text-field v-model="searches.c1" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                            </td>
                            <td>
                                <v-text-field v-model="searches.c2" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                            </td>
                            <td>
                                <v-text-field v-model="searches.c3" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                            </td>
                            <td>
                                <v-text-field v-model="searches.c4" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                            </td>
                            <td>
                                <v-text-field v-model="searches.c5" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                            </td>
                            <td>
                                <v-text-field v-model="searches.c6" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                            </td>
                            <td>
                                <v-text-field v-model="searches.c6" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
                            </td>
                        </tr>
                    </template>

                    <template v-slot:[`item.valorGasto`]="{ item }">
                        {{ Number(item.valorGasto).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }}
                    </template>

                </v-data-table>
            </v-card>
        </v-container>

    </div>
</template>

<script>

import VueApexCharts from 'vue-apexcharts';

export default {
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            mes: null,
            ano: null,
            dataForRequest: {
                tipo: 2,
                ano: null,
                mes: null,
                empresa: null,
            },
            search: '',
            sortBy: 'nome',
            tipos: [
                {text: 'Empresa', value: 1},
                {text: 'Cartão Corporativo', value: 2}
            ],
            filter: ['Fixo', 'Sob Demanda'],
            loadingBuscar: false,
            nonEmptyRules: [v => !!v || "Campo obrigatório."],
            searches: {
                c1: '',
                c2: '',
                c3: '',
                c4: '',
                c5: '',
                c6: '',
                c7: ''
            },
        }
    },
    methods: {
        showQuant() {
            console.log(this.$store.getters.getCurrentCartaoCorpQuantitativos)
        },
        RequestQuantitativos() {
            this.loadingBuscar = true;
            this.mes = this.dataForRequest.mes;
            this.ano = this.dataForRequest.ano;
            this.$store.dispatch('getQuantitativos', this.dataForRequest)
                .catch(error => {
                    console.log(error);
                    if (error?.response?.status === 401) {
                        this.errorMateriaisMessage = "Você não está autenticado ou não tem permissão para requisitar quantitativos.";
                        this.errorGetMateriais = true;
                        this.$store.dispatch('logout');
                    } else {
                        this.errorMateriaisMessage = "Ocorreu um erro na busca dos materiais disponíveis. Recarregue a página e tente novamente.";
                        this.errorGetMateriais = true;
                    }
                })
                .finally(() => {
                    this.loadingBuscar = false;
                })
        },
        FactoryOptionsForChart(max, current) {
            let colorMax = '#1E88E5';
            let colorMin = '#82C4F8';
            if (current >= max) {
                colorMax = '#F44336';
            }
            return {
                chart: {
                    type: 'donut',
                    dropShadow: {
                        enabled: true,
                        top: 6,
                        left: -6,
                        blur: 6,
                        opacity: 0.1
                    }
                },
                legend: {
                    show: true
                },
                labels: ['Utilizado', 'Restante'],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 320
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                ],
                colors: [colorMax, colorMin],
                stroke: {
                    width: 0
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                total: {
                                    showAlways: true,
                                    show: true
                                }
                            }
                        }
                    }
                }
            }
        },
        getColor(item) {
            if (item.utilizado >= item.total) return "error"
            else if (item.utilizado >= 0.85*item.total) return "warning"
            return "success"
        }
    },
    computed: {
        ListaDeMateriaisEmpresa() {
            return this.$store.getters.getCurrentEmpresaQuantitativos.filter(value => this.filter.includes(value.categoria))
        },
        ListaDeMateriaisCartaoCorp() {
            return this.$store.getters.getCurrentCartaoCorpQuantitativos//.filter(value => this.filter.includes(value.categoria))
        },
        showDataEmpresa() {
            return this.$store.getters.getCurrentEmpresaQuantitativos ? true : false
        },
        showDataCartaoCorp() {
            return this.$store.getters.getCurrentCartaoCorpQuantitativos ? true : false
        },
        headers() {
            return [
                { text: "Nome do Item", value: "nome", 
                    filter: value => {
                        if (!this.searches.c1) return true
                        return String(value).toLowerCase().includes(this.searches.c1.toLowerCase())
                    } 
                },
                { text: "Quantidade", value: "quantidade", 
                    filter: value => {
                        if (!this.searches.c2) return true
                        return String(value).toLowerCase().includes(this.searches.c2.toLowerCase())
                    } 
                },
                { text: "Unidade", value: "unidade", 
                    filter: value => {
                        if (!this.searches.c3) return true
                        return String(value).toLowerCase().includes(this.searches.c3.toLowerCase())
                    } 
                },
                { text: "Valor Gasto", value: "valorGasto", 
                    filter: value => {
                        if (!this.searches.c4) return true
                        return String(value).toLowerCase().includes(this.searches.c4.toLowerCase())
                    } 
                },
                { text: "Ordem de Serviço", value: "os", 
                    filter: value => {
                        if (!this.searches.c5) return true
                        return String(value).toLowerCase().includes(this.searches.c5.toLowerCase())
                    } 
                },
                { text: "Número do Pedido", value: "pedido", 
                    filter: value => {
                        if (!this.searches.c6) return true
                        return String(value).toLowerCase().includes(this.searches.c6.toLowerCase())
                    } 
                },
                { text: "Data do Pedido", value: "dataPedido", 
                    filter: value => {
                        if (!this.searches.c7) return true
                        return String(value).toLowerCase().includes(this.searches.c7.toLowerCase())
                    } 
                }
            ]
        },
        totalValueSummedUp() {
            return this.$store.getters.getCurrentCartaoCorpQuantitativos.reduce((a, b) => a + b.valorGasto, 0)
        }
    },
    watch: {
        'dataForRequest.tipo' () {
            this.dataForRequest.empresa = null;
        }
    },
    //mounted() {
    //    this.$store.commit('UNSET_CURRENT_QUANTITATIVOS');
    //}
}
</script>