<template>
    <v-stepper alt-labels class="my-4" :value="item.statusStep">
        <div v-if="userCanVisualizeDownload()">
            <div 
            class="text-center my-4"
            v-if="pdfs_ids">
                <v-row 
                align-content="center" 
                justify="center"
                class="font-weight-light text-body-1">
                    <v-col
                    cols="12"
                    sm="4"
                    md="2"
                    v-if="pdfs_ids.demap">
                        Demap:
                        <a :href="pdfs_ids.demap">Download</a>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="4"
                    md="2"
                    v-if="pdfs_ids.almoxarife">
                        Almoxarife:
                        <a :href="pdfs_ids.almoxarife">Download</a>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="4"
                    md="2"
                    v-if="pdfs_ids.empresa">
                        {{inputItem.empresa}}:
                        <a :href="pdfs_ids.empresa">Download</a>
                    </v-col>
                </v-row>
                <v-row
                align-content="center" 
                justify="center"
                class="font-weight-light text-body-1">
                    <v-col
                    cols="12"
                    sm="12"
                    md="6">
                        Tempo restante para download:
                        <v-progress-circular 
                        :value="remaining * 3.33"
                        color="#3F51B5">
                            {{remaining}}
                        </v-progress-circular>
                    </v-col>
                </v-row>
            </div>
            <div class="text-center my-4" v-else>
                <v-btn 
                class="white--text" 
                color="#3F51B5"
                :disabled="!userCanDownloadPDFs()"
                @click="collectPDFsIds()"
                :loading="loading_pdfs">
                    Download dos PDFs
                </v-btn>
                <div 
                class="font-weight-light grey--text mt-1"
                v-if="!userCanDownloadPDFs()">
                    Este pedido ainda não está mapeado diretamente com os pdfs
                </div>
            </div>
            <div class="text-center my-4" v-if="userCanVisualizeDownload()">
                <v-btn 
                color="#3F51B5"
                @click="DispatchPDFsAgain()"
                :loading="loading_pdfs"
                outlined>
                    Recadastrar PDFs
                </v-btn>
            </div>
        </div>
        <v-stepper-header>
            <v-divider></v-divider>
            <v-stepper-step step="1" 
            :complete="item.statusStep > 1" 
            color="success">
                <h4 class="text-center font-weight-regular">Solicitação realizada</h4> 
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="2" 
            :complete="item.statusStep > 2" 
            :color="item.statusStep > 2 ? 'success' : `orange darken-1`"
            :rules="[() => (!item.active && item.statusStep === 2) ? false : true]">
                <h4 class="text-center font-weight-regular">
                    {{ getMessage(2, item) }}
                </h4>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" 
            :complete="item.statusStep > 3" 
            :color="item.statusStep > 3 ? 'success' : `orange darken-1`"
            :rules="[() => (!item.active && item.statusStep === 3) ? false : true]">
                <h4 class="text-center font-weight-regular">
                    {{ getMessage(3, item) }}
                </h4>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="4" 
            :complete="item.statusStep > 4" 
            :color="item.statusStep > 4 ? 'success' : `orange darken-1`"
            :rules="[() => (!item.active && item.statusStep === 4) ? false : true]">
                <h4 class="text-center font-weight-regular">
                    {{ getMessage(4, item) }} 
                </h4> 
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="5" 
            :complete="item.statusStep > 5" 
            :color="item.statusStep > 5 ? 'success' : `orange darken-1`"
            :rules="[() => (!item.active && item.statusStep === 5) ? false : true]">
                <h4 class="text-center font-weight-regular">
                    {{ getMessage(5, item) }}
                </h4> 
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="6" 
            :complete="item.statusStep === 6" 
            color="success">
                <h4 class="text-center font-weight-regular">
                    Solicitação finalizada
                </h4> 
            </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>

            <v-stepper-content step="2">
                <ItemGrid :item="item"/>
            </v-stepper-content>

            <v-stepper-content step="3">
                <ItemGrid :item="item"/>
            </v-stepper-content>

            <v-stepper-content step="4">
                <ItemGrid :item="item"/>
            </v-stepper-content>

            <v-stepper-content step="5">
                <ItemGrid :item="item"/>
            </v-stepper-content>

            <v-stepper-content step="6">
                <ItemGrid :item="item"/>
            </v-stepper-content>
            
        </v-stepper-items>
        
    </v-stepper>
</template>

<script>
import ItemGrid from "@/components/ItemGrid.vue"

export default {
    props: {
        inputItem: Object
    },
    components: {
        ItemGrid
    },
    created() {
        this.$store.commit('UNSET_CURRENT_PEDIDO')
        this.$store.commit('SET_CURRENT_PEDIDO', this.inputItem)
    },
    data() {
        return {
            intervalId: null,
            remaining: null,
            loading_pdfs: false,
            pdfs_ids: null,
            messageMapping: [
                {concluido: this.$store.getters.getNeedAssistant[this.inputItem.empresa] ? `Aprovado pelo(a) assistente de fiscalização`:`Empresa não requer assistente de fiscalização` ,andamento: "Aguardando confirmação do(a) assistente de fiscalização"},
                {concluido: "Aprovado pelo(a) fiscal", andamento: "Aguardando confirmação do(a) fiscal"},
                {concluido: "Confirmado pela DILOG", andamento: "Aguardando confirmação da DILOG"},
                {concluido: "Item(s) obtido(s)", andamento: "Aguardando aquisição do(s) item(s)"}
            ]
        }
    },
    methods: {
        getMessage(step, item){
            if (item.statusStep > step)
                return this.messageMapping[step-2].concluido;
            else
                return this.messageMapping[step-2].andamento;
        },
        getColor(pedido) {
            if (pedido.statusStep === 6)
                return `success`
            if (!pedido.active)
                return `red`
            else
                return `orange darken-1`
        },
        userCanVisualizeDownload() {
            return this.inputItem.statusStep >= 5
        },
        userCanDownloadPDFs() {
            return Boolean(this.inputItem.pdfs_ids)
        },
        collectPDFsIds() {
            this.loading_pdfs = true;
            this.$store.dispatch('getPedidoPDFs', this.inputItem.pdfs_ids)
            .then(response => {
                this.pdfs_ids = response.data
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 404)
                    this.$store.commit('SET_SNACKBAR', {message: "Os PDFs não existem. Recadastre eles para serem gerados novamente.", color: "warning"})
                else
                    this.$store.commit('SET_SNACKBAR', {message: "Ocorreu um erro.", color: "error"})
            })
            .finally(() => {
                this.loading_pdfs = false;
                this.remaining = 30;
                this.intervalId = setInterval(function () {
                    this.remaining -= 1;
                    }.bind(this), 1000);
            })
        },
        DispatchPDFsAgain() {
            this.loading_pdfs = true;

            this.$store.dispatch('reupdatePedidoPDFs')
            .then(response => {
                this.$store.commit('SET_SNACKBAR', {message: `IDs dos PDFs do pedido ${this.item['number']} alterados com sucesso`, color: "success"});
                this.item['pdfs_ids'] = response.data['pdfs_ids'];
            })
            .catch(error => {
                console.log(error);
                this.$store.commit('SET_SNACKBAR', {message: "Ocorreu um erro na tentativa de atualizar os IDs dos PDFs.", color: "error"});
            })
            .finally(() => {
                this.loading_pdfs = false;
            })
        }
    },
    computed: {
        item() {
            return this.$store.getters.getCurrentPedido;
        }
    },
    watch: {
        inputItem() {
            this.$store.commit('SET_CURRENT_PEDIDO', this.inputItem)
        },
        remaining() {
            if (this.remaining <= 0) {
                clearInterval(this.intervalId)
                this.pdfs_ids = null;
                this.remaining = 30;
            }
        }
    },
    beforeDestroy() {
        if (this.intervalId)
            clearInterval(this.intervalId)
    }
}
</script>
