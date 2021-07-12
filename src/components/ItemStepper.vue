<template>
    <v-stepper alt-labels class="my-4" :value="item.statusStep">
        <v-stepper-header>
            <v-stepper-step step="1" 
            :complete="item.statusStep > 1" 
            color="success">
                <h4 class="text-center font-weight-regular">Solicitação realizada</h4> 
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="2" 
            :complete="item.statusStep > 2" 
            :color="item.statusStep > 2 ? 'success' : item.color"
            :rules="[() => (!item.active && item.statusStep === 2) ? false : true]">
                <h4 class="text-center font-weight-regular">
                    {{ getMessage(2, item) }}
                </h4>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" 
            :complete="item.statusStep > 3" 
            :color="item.statusStep > 3 ? 'success' : item.color"
            :rules="[() => (!item.active && item.statusStep === 3) ? false : true]">
                <h4 class="text-center font-weight-regular">
                    {{ getMessage(3, item) }}
                </h4>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="4" 
            :complete="item.statusStep > 4" 
            :color="item.statusStep > 4 ? 'success' : item.color"
            :rules="[() => (!item.active && item.statusStep === 4) ? false : true]">
                <h4 class="text-center font-weight-regular">
                    {{ getMessage(4, item) }} 
                </h4> 
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="5" 
            :complete="item.statusStep > 5" 
            :color="item.statusStep > 5 ? 'success' : item.color"
            :rules="[() => (!item.active && item.statusStep === 5) ? false : true]">
                <h4 class="text-center font-weight-regular">
                    {{ getMessage(5, item) }}
                </h4> 
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="6" 
            :complete="item.statusStep === 6" 
            :color="item.color">
                <h4 class="text-center font-weight-regular">
                    Solicitação finalizada
                </h4> 
            </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>

            <v-stepper-content step="2">
                <ItemGrid/>
            </v-stepper-content>

            <v-stepper-content step="3">
                <ItemGrid/>
            </v-stepper-content>

            <v-stepper-content step="4">
                <ItemGrid/>
            </v-stepper-content>

            <v-stepper-content step="5">
                <ItemGrid/>
            </v-stepper-content>

            <v-stepper-content step="6">
                <ItemGrid/>
            </v-stepper-content>
            
        </v-stepper-items>
        
    </v-stepper>
</template>

<script>
import ItemGrid from "@/components/ItemGrid.vue"

export default {
    props: {
        item: Object
    },
    components: {
        ItemGrid
    },
    created() {
        this.$store.commit('UNSET_CURRENT_PEDIDO')
        this.$store.commit('SET_CURRENT_PEDIDO', this.item)
    },
    data() {
        return {
            messageMapping: [
                {concluido: "Aprovado pelo(a) assistente de fiscalização", andamento: "Aguardando confirmação do(a) assistente de fiscalização"},
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
    }
}
</script>