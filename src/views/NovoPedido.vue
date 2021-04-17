<template>
    <v-card class="ma-12">

        <v-alert
            dense
            text
            type="success"
            v-if="success"
            >
            Seu pedido foi realizado com sucesso. Acesse a guia <strong>conferir andamentos</strong> para saber mais.
        </v-alert>
        <v-alert
            dense
            outlined
            type="error"
            v-if="error"
            >
            Ocorreu um erro na realização do seu pedido. Certifique-se de que todos os campos com <strong>*</strong> foram devidamente preenchidos.
        </v-alert>

        <v-card-title> Solicitação de Aquisição de Material não Codificado </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-form ref="form" v-model="valid">
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
                            ></v-text-field>

                        </v-col>


                        <v-col
                            cols="12"
                            sm="4"
                            md="4">

                            <v-text-field
                                v-model="pedido.os"
                                label="Número da Ordem de Serviço Associada*"
                                required
                                :counter="20"
                                :rules="nonEmptyRules"
                                clearable
                            ></v-text-field>

                        </v-col>


                        <v-container>
                            <v-row v-for="item in itemsQtd" :key="item">
                                <v-col
                                    cols="12"
                                    sm="7"
                                    md="7">

                                    <v-row class="mx-1">
                                        <v-col
                                        cols="12"
                                        sm="7"
                                        md="7"
                                        >
                                            <v-combobox
                                                v-model="pedido.items[item-1].nome"
                                                :label="(listaDeMateriais.length > 0) ? `Nome do Item ${item}*` : `Carregando... por favor aguarde`"
                                                hint="De preferência escolha um item dos disponíveis."
                                                :rules="nonEmptyRules"
                                                :items="listaDeMateriais"
                                                :loading="isMateriaisLoading"
                                                :disabled="isMateriaisLoading"
                                                @click="searchMateriais()"
                                                @blur="checkInputName(pedido.items[item-1])"
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
                                                label="Unidade"
                                                required
                                                :items="unidadesDeMedida"
                                                :rules="nonEmptyRules"
                                                :disabled="unidadeEncontrada"
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
                        
                        </v-container>
                        <v-container>
                            <v-row no-gutters>
                                <v-col cols="12" align="center">
                                    <v-btn depressed class="mt-4 mb-2" color="blue-grey lighten-4" @click="addItem()" :disabled="addDisable">Adicionar Item</v-btn>
                                </v-col>
                                <v-col cols="12" align="center">
                                    <v-btn depressed color="blue-grey lighten-4" @click="removeItem()" :disabled="remDisable">Remover Item</v-btn>
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
            @click="sendData()"
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
            v-if="disableSend"
            >
            Ocorreu um erro na busca dos materiais disponíveis. Recarregue a página e tente novamente.
        </v-alert>
    </v-card>
</template>

<script>
import axios from 'axios';

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
            unidadeEncontrada: false,
            isMateriaisLoading: false,
            listaDeMateriais: [],
            listaDeMateriaisObj: [],
            loading: false,
            disableSend: false,
            errorGetMateriais: false,
            success: false,
            error: false,
            valid: false,
            itemsQtd: 1,
            pedido: {
                requisitante: null,
                email: null,
                os: null,
                items: [
                    {nome: null, descricao: null, quantidade: null, categoria: null, unidade: null, valorUnitario: null, valorTotal: null, finalidade: null, 
                    valorDaSolicitacao: 0, aprovadoAssistente: true, motivoAssistente: null, aprovadoFiscal: true, motivoFiscal: null, 
                    direcionamentoDeCompra: null, almoxarifadoPossui: true}
                ],
                dataPedido: null,
                dataCancelamento: null,
                dataFinalizacao: null,
                quantidade: null,
                status: null,
                statusStep: 2,
                color: "orange",
                active: true
            },
            addDisable: false,
            remDisable: true,
            nonEmptyRules: [v => !!v || "Campo obrigatório."],
            numericRules: [v => !!v || "Campo obrigatório.", v => !isNaN(v) || "Valor não é um número."],
            emailRules: [v => !!v || 'Campo obrigatório.', v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido.'],
            apiURL: '//demapsm-backend.herokuapp.com'
        }
    },
    mounted() { // Primeira coisa a executar
        this.searchMateriais();
    },
    methods: {
        logValue(value) {
            console.log("Logged value: ", value)
        },
        resetForm() {
            this.error = false;
            this.success = false;
            this.$refs.form.reset();
        },
        addItem() {
            this.itemsQtd += 1;
            this.pedido.items.push(
                {nome: null, descricao: null, quantidade: null, categoria: null, unidade: null, valorUnitario: null, valorTotal: null, finalidade: null, 
                valorDaSolicitacao: 0, aprovadoAssistente: true, motivoAssistente: null, aprovadoFiscal: true, motivoFiscal: null, 
                direcionamentoDeCompra: null, almoxarifadoPossui: true}
            )
            this.computeDisable();
        },
        removeItem() {
            this.itemsQtd -= 1;
            this.pedido.items.pop()
            this.computeDisable();
        },
        computeDisable() {
            if (this.itemsQtd >= 5)
                this.addDisable = true
            else
                this.addDisable = false

            if (this.itemsQtd === 1)
                this.remDisable = true
            else
                this.remDisable = false
        },
        sendData() {
            if (this.valid && this.pedido.items[0].categoria !== null){
                this.error = false

                // Todas as informações do processo são inseridas aqui
                this.pedido.quantidade = this.pedido.items.length;
                this.pedido.dataPedido = new Date().toLocaleDateString();
                this.pedido.status = "Aguardando confirmação do(a) assistente de fiscalização";

                for (let idx = 0; idx < this.pedido.items.length; idx++){
                    if (this.pedido.items[idx].valorUnitario !== null){
                        let aux = Number(this.pedido.items[idx].valorUnitario) * Number(this.pedido.items[idx].quantidade); // Obtem a multiplicacao
                        this.pedido.items[idx].valorTotal = Math.round(aux * 100) / 100 // Arredonda 2 casas decimais
                    }
                }

                let valorDaSolicitacao = 0;
                for (let idx = 0; idx < this.pedido.items.length; idx++){
                    if (this.pedido.items[idx].valorTotal !== null)
                        valorDaSolicitacao += this.pedido.items[idx].valorTotal;
                }
                this.pedido.valorDaSolicitacao = valorDaSolicitacao;

                this.loading = true;
                axios.post(`${this.apiURL}/crud/pedidos/`, this.pedido)
                .then(response => {
                    this.resetForm(); 
                    this.success = true;
                    this.loading = false;
                    return response;
                    })
                .catch(error => {
                    console.log(error); 
                    this.error = true;
                    this.loading = false;
                    return error;
                    });
            } else {
                console.log("Something is wrong here...")
                this.success = false
                this.error = true
            }
        },
        searchMateriais() {
            // Items have already been loaded
            if (this.listaDeMateriais.length > 0) return

            // Items have already been requested
            if (this.isMateriaisLoading) return

            this.isMateriaisLoading = true;

            // Lazily load input items
            fetch(`${this.apiURL}/crud/materiais/`)
            .then(res => res.json()) // {"id": 067812854698, "descricao": "Abraçadeira 3/4" Formato U", categoria: "Fixo", "fabReferencia": "Deca", ...}
            .then(res => {
                this.disableSend = false;
                this.listaDeMateriaisObj = res;
                this.listaDeMateriais = this.getAllMateriais(res, "descricao");
            })
            .catch(err => {
                this.disableSend = true;
                console.log(err);
            })
            .finally(() => (this.isMateriaisLoading = false));
        },
        getAllMateriais(json, key) {
            const values = [... json.map(item => item[key])];
            return values
        },
        checkInputName(item) {
            setTimeout(() => {
                if (this.listaDeMateriais.length > 0){
                    let nome = item.nome;
                    if (nome !== null){
                        if (this.listaDeMateriais.includes(nome)){
                            let idx = this.listaDeMateriais.indexOf(nome);
                            item.categoria = this.listaDeMateriaisObj[idx].categoria;
                            item.valorUnitario = this.listaDeMateriaisObj[idx].valorUnitario;
                            item.unidade = this.listaDeMateriaisObj[idx].unidade;
                            this.unidadeEncontrada = true;
                        } else {
                            item.categoria = "Outro";
                            this.unidadeEncontrada = false;
                            item.valorUnitario = null;
                            item.unidade = null;
                        }
                    } else {
                        item.categoria = null;
                        this.unidadeEncontrada = false;
                        item.valorUnitario = null;
                        item.unidade = null;
                    }
                }
            }, 100);
            
        }
        
    }

}
</script>