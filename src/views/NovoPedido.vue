<template>
    <v-card class="ma-12">

        <v-alert
            dense
            text
            type="success"
            v-if="success"
            >
            Seu pedido foi realizado com sucesso. Acesse a guia <strong>ANDAMENTOS</strong> para saber mais.
        </v-alert>
        <v-alert
            dense
            outlined
            type="error"
            v-if="error"
            >
            {{ errorMessage }}
        </v-alert>

        <v-card-title> Solicitação de Aquisição de Material não Codificado </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
                   
            <v-container>
                <v-row>
                    <v-col
                        cols="12"
                        sm="4"
                        md="4">

                        <v-text-field
                            v-model="pedido.requisitante"
                            label="Nome do Requisitante*"
                            required
                            :counter="50"
                            :rules="nonEmptyRules"
                            clearable
                            :disabled="true"
                            outlined
                        ></v-text-field>

                    </v-col>
                        

                    <v-col
                        cols="12"
                        sm="4"
                        md="4">

                        <v-text-field
                            v-model="pedido.email"
                            label="Email do Requisitante*"
                            required
                            :counter="50"
                            :rules="emailRules"
                            clearable
                            :disabled="true"
                            outlined
                        ></v-text-field>

                    </v-col>

                    <v-col
                        cols="12"
                        sm="4"
                        md="4">

                        <v-form ref="osForm" v-model="valid">
                            <v-text-field
                                v-model="pedido.os"
                                label="Número da Ordem de Serviço Associada*"
                                required
                                outlined
                                :counter="20"
                                :rules="nonEmptyRules"
                                clearable
                                filled
                            ></v-text-field>
                        </v-form>

                    </v-col>
                </v-row>

            </v-container>

            <v-form ref="form" v-model="valid">
                <v-container>
                    <v-row>

                        <template>
                            <v-row v-for="item in pedido.items.length" :key="item">
                                <v-col
                                    cols="12"
                                    sm="7"
                                    md="7">

                                    <v-row class="mx-1">
                                        <v-col
                                        cols="12"
                                        sm="7"
                                        md="7">
                                            <v-combobox
                                                v-model="pedido.items[item-1].nome"
                                                :label="(listaDeMateriais.length > 0) ? `Nome do Item ${item}*` : `Carregando... por favor aguarde`"
                                                hint="De preferência escolha um item dos disponíveis."
                                                :rules="nonEmptyRules"
                                                :items="listaDeMateriais"
                                                :loading="isMateriaisLoading"
                                                :disabled="isMateriaisLoading"
                                                @blur="mapMaterialParaPropriedades(pedido.items[item-1])"
                                                hide-no-data
                                                hide-selected
                                                :counter="100"
                                                filled
                                                outlined
                                                clearable
                                                required
                                                persistent-hint
                                            ></v-combobox>

                                        </v-col>
                                        
                                        <v-col
                                        cols="12"
                                        sm="3"
                                        md="3">

                                            <v-text-field
                                                v-model="pedido.items[item-1].quantidade"
                                                :label="'Quantidade Item ' + item +'*'"
                                                hint="Insira a quantidade na medida apropriada (metros, unidades, etc)."
                                                required
                                                :counter="30"
                                                :rules="numericRules"
                                                clearable
                                                filled
                                                outlined
                                            ></v-text-field>

                                        </v-col>

                                        <v-col
                                        cols="12"
                                        sm="2"
                                        md="2">

                                            <v-select
                                                v-model="pedido.items[item-1].unidade"
                                                label="Unidade*"
                                                required
                                                :items="unidadesDeMedida"
                                                :rules="nonEmptyRules"
                                                :disabled="pedido.items[item-1].categoria !== 'Outro' && pedido.items[item-1].categoria !== null"
                                                clearable
                                                filled
                                                outlined
                                            ></v-select>

                                        </v-col>
                                    </v-row>
                                    
                                    <v-row>

                                        <v-col
                                            cols="12"
                                            sm="8"
                                            md="8">

                                            <v-text-field
                                                v-model="pedido.items[item-1].finalidade"
                                                :label="'Finalidade do Item ' + item +'*'"
                                                hint="De preferência escolha um item dos disponíveis."
                                                required
                                                :counter="100"
                                                :rules="nonEmptyRules"
                                                clearable
                                                filled
                                                outlined
                                                class="ml-4"
                                            ></v-text-field>
                                            
                                        </v-col>

                                        <v-col
                                            cols="12"
                                            sm="4"
                                            md="4">
                                            <v-radio-group v-model="pedido.items[item-1].categoria" row>
                                                <v-radio
                                                    :label="`Sob Demanda`"
                                                    value="Sob Demanda"
                                                    disabled
                                                ></v-radio>
                                                <v-radio
                                                    :label="`Fixo`"
                                                    value="Fixo"
                                                    disabled
                                                ></v-radio>
                                                <v-radio
                                                    :label="`Outro`"
                                                    value="Outro"
                                                    disabled
                                                ></v-radio>
                                            </v-radio-group>

                                        </v-col>

                                    </v-row>

                                </v-col>


                                <v-col
                                    cols="12"
                                    sm="5"
                                    md="5">

                                    <v-textarea
                                        v-model="pedido.items[item-1].descricao"
                                        :label="'Descrição do Item ' + item"
                                        height="165"
                                        :counter="300"
                                        clearable
                                        filled
                                        auto-grow
                                        outlined
                                    ></v-textarea>


                                </v-col>
                            </v-row>
                        
                        </template>
                        <v-container>
                            <v-row no-gutters>
                                <v-col cols="12" align="center">
                                    <v-btn 
                                    depressed 
                                    class="mt-4 mb-2" 
                                    color="blue-grey lighten-4" 
                                    @click="pedido.items.push(generateNewEmptyItem())" 
                                    :disabled="pedido.items.length >= 5">
                                    Adicionar Item
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" align="center">
                                    <v-btn 
                                    depressed 
                                    color="blue-grey lighten-4" 
                                    @click="pedido.items.pop()" 
                                    :disabled="pedido.items.length <= 1">
                                    Remover Item
                                    </v-btn>
                                </v-col>
                            </v-row>

                        </v-container>
                        
                    </v-row>
                </v-container>
            </v-form>
        * indica campo obrigatório
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="resetForm()"
          >
            Limpar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="constructPedido()"
            :loading="loading"
            :disabled="disableSend"
          >
            Enviar Pedido
          </v-btn>
        </v-card-actions>
        <v-alert
            dense
            outlined
            type="error"
            v-if="errorGetMateriais"
            >
            {{ errorMateriaisMessage }}
        </v-alert>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            unidadesDeMedida: [
                "unid.", // Unidades
                "km", "m", "cm", "mm", "pol.", // Comprimento
                "km²", "m²", "cm²", "mm²", "pol.²", // Área
                "litros", "ml", "km³", "m³", "cm³", "mm³", "pol.³", // Volume
                "g", "kg", "ton.", // Massa
                ],
            isMateriaisLoading: false,
            loading: false,
            disableSend: false,
            errorGetMateriais: false,
            errorMateriaisMessage: null,
            success: false,
            errorMessage: null,
            error: false,
            valid: false,
            pedido: {
                requisitante: this.$store.getters.getCompleteName,
                email: this.$store.getters.getEmail,
                os: null,
                items: [this.generateNewEmptyItem()],
                valorDaSolicitacao: 0,
                dataPedido: null,
                horarioPedido: null,
                quantidade: 1,
                status: "Aguardando confirmação do(a) assistente de fiscalização",
                statusStep: 2,
                assistente: null,
                fiscal: null,
                almoxarife: null,
                recebimento: null,
                color: "orange",
                active: true,
                dataCancelamento: null,
                horarioCancelamento: null,
                dataFinalizacao: null,
                horarioFinalizacao: null,
                valorGastoTotal: null
            },
            addDisable: false,
            remDisable: true,
            nonEmptyRules: [v => !!v || "Campo obrigatório."],
            numericRules: [v => !!v || "Campo obrigatório.", v => !isNaN(v) || "Valor não é um número."],
            emailRules: [v => !!v || 'Campo obrigatório.', v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido.'],
        }
    },
    mounted() {
        this.isMateriaisLoading = true;
        this.disableSend = true;

        // Lazily load input items
        this.$store.dispatch('getMateriais')
        .then(() => {
            this.disableSend = false;
            this.isMateriaisLoading = false;
        })
        .catch(error => {
            console.log(error);
            if (error.response.status === 401) {
                this.errorMateriaisMessage = "Você não está autenticado ou não tem permissão para requisitar materiais.";
                this.errorGetMateriais = true;
                this.isMateriaisLoading = false;
                this.$store.dispatch('logout');
            } else {
                this.errorMateriaisMessage = "Ocorreu um erro na busca dos materiais disponíveis. Recarregue a página e tente novamente.";
                this.errorGetMateriais = true;
                this.isMateriaisLoading = false;
            }
        })
    },
    methods: {
        generateNewEmptyItem() {
            return {
                nome: null, quantidade: null, descricao: null, categoria: null, unidade: null, valorUnitario: null, valorTotal: null, finalidade: null,
                aprovadoAssistente: true, motivoAssistente: null, dataAprovacaoAssistente: null, horarioAprovacaoAssistente: null, 
                aprovadoFiscal: true, motivoFiscal: null, dataAprovacaoFiscal: null, horarioAprovacaoFiscal: null, 
                direcionamentoDeCompra: null, 
                almoxarifadoPossui: true, dataAprovacaoAlmoxarife: null, horarioAprovacaoAlmoxarife: null,
                valorGasto: 0.0
            }
        },
        resetForm() {
            this.error = false;
            this.errorDueToValid = false;
            this.success = false;
            this.$refs.form.reset();
            this.$refs.osForm.reset();
        },
        constructPedido() {
            this.error = false;
            this.success = false;

            if (!this.$refs.form.validate() || !this.$refs.osForm.validate()) {
                this.errorMessage = "Certifique-se de que todos os campos com * foram devidamente preenchidos."
                this.error = true;
                return
            }

            const dataHorario = new Date().toLocaleString('pt-BR');
            this.pedido.dataPedido = dataHorario.split(' ')[0];
            this.pedido.horarioPedido = dataHorario.split(' ')[1];

            this.pedido.items.forEach((function(item, idx) {
                if (idx === 0)
                    this.valorDaSolicitacao = null;
                let aux = item.valorUnitario ? Number(item.valorUnitario) * Number(item.quantidade) : null; // Obtem a multiplicacao
                this.items[idx].valorTotal = aux ? Math.round(aux * 100) / 100 : null; // Arredonda 2 casas decimais, obtendo o valor para 
                this.valorDaSolicitacao += this.items[idx].valorTotal ? this.items[idx].valorTotal : null; // cast Number em null resulta 0
                this.valorDaSolicitacao = this.valorDaSolicitacao ? this.valorDaSolicitacao : null; // if (0) resulta em false
            }).bind(this.pedido))
            
            this.sendPedido()
        },
        sendPedido() {
            this.loading = true;
            this.$store.dispatch('postNovoPedido', this.pedido)
            .then(() => {
                this.resetForm(); 
                this.success = true;
                this.loading = false;
                })
            .catch(error => {
                if (error ?.response ?.status == 401) {
                    this.errorMessage = "Você não está autenticado ou não possui permissão para enviar esse pedido."
                    this.error = true;
                    this.$store.dispatch('logout')
                    .then(() => {
                        this.$router.push({name: "login"})
                    })
                }
                console.log(error); 
                this.errorMessage = "Ocorreu um erro ao enviar o seu pedido para o servidor. Atualize a página e tente novamente."
                this.error = true;
                this.loading = false;
                });
        },
        mapMaterialParaPropriedades(item) {
            setTimeout(() => {
                if (this.listaDeMateriais.length <= 0)
                    return
                if (!item.nome) {
                    item.categoria = null;
                    item.valorUnitario = null;
                    item.unidade = null;
                    return
                }
                let idx = this.listaDeMateriais.indexOf(item.nome); // Retorna -1 se não estiver na lista
                if (idx === -1) {
                    item.categoria = "Outro";
                    item.valorUnitario = null;
                    item.unidade = null;
                    return
                }
                ({categoria: item.categoria, valorUnitario: item.valorUnitario, unidade: item.unidade} = this.$store.getters.getMateriais[idx]);
            }, 100);
            
        }
        
    },
    computed: {
        listaDeMateriais() {
            return this.$store.getters.getMateriaisList;
        }
    },
    watch: {
        'pedido.items.length'() {
            this.pedido.quantidade = this.pedido.items.length;
        }
    }

}
</script>