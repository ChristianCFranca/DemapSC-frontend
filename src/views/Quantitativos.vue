<template>
    <div>
        <v-container
        fluid
        class="mt-6">
            <v-row
            no-gutters
            justify="center">
                <v-col
                cols="4">
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
                    :disabled="dataForRequest.empresa == null || dataForRequest.ano == null || dataForRequest.mes == null"
                    large
                    @click="RequestQuantitativos"
                    class="text-center white--text">
                        Buscar
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

        <v-divider class="my-10"></v-divider>
    
        <v-container
        fluid
        v-if="showData">
            <v-data-iterator
            :items="ListaDeMateriais"
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
            dataForRequest: {
                ano: '2021',
                mes: '05',
                empresa: null,
            },
            search: '',
            sortBy: 'nome',
            filter: ['Fixo', 'Sob Demanda'],
            loadingBuscar: false,
            nonEmptyRules: [v => !!v || "Campo obrigatório."]
        }
    },
    methods: {
        RequestQuantitativos() {
            this.loadingBuscar = true;
            this.$store.dispatch('getQuantitativosForEmpresa', this.dataForRequest)
                .catch(error => {
                    console.log(error);
                    if (error?.response?.status === 401) {
                        this.errorMateriaisMessage = "Você não está autenticado ou não tem permissão para requisitar materiais.";
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
        ListaDeMateriais() {
            return this.$store.getters.getCurrentQuantitativos.filter(value => this.filter.includes(value.categoria))
        },
        showData() {
            return this.$store.getters.getCurrentQuantitativos ? true : false
        }
    }
}
</script>