<template>
    <div 
    v-if="item.assistente || item.fiscal || item.almoxarife">
        <p 
        class="text-h6"> 
            Aprovado Por: 
        </p>
        <v-list-item v-if="item.assistente">
            <v-list-item-content>
                <v-list-item-subtitle class="text-subtitle-1">
                    Assistente:
                </v-list-item-subtitle>
                <p class="text-h6">
                    {{ item.assistente }} 
                    <span class="font-weight-light">em</span> 
                    {{ item.dataAprovacaoAssistente }} 
                    <span class="font-weight-light">às</span> 
                    {{ item.horarioAprovacaoAssistente }}
                </p>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="item.fiscal">
            <v-list-item-content>
                <v-list-item-subtitle class="text-subtitle-1">
                    Fiscal:
                </v-list-item-subtitle>
                <p class="text-h6">
                    {{ item.fiscal }} 
                    <span class="font-weight-light">em</span> 
                    {{ item.dataAprovacaoFiscal }} 
                    <span class="font-weight-light">às</span> 
                    {{ item.horarioAprovacaoFiscal }}
                </p>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="item.almoxarife">
            <v-list-item-content>
                <v-list-item-subtitle class="text-subtitle-1">
                    Almoxarife:
                </v-list-item-subtitle>
                <p class="text-h6">
                    {{ item.almoxarife }} 
                    <span class="font-weight-light">em</span> 
                    {{ item.dataAprovacaoAlmoxarife }} 
                    <span class="font-weight-light">às</span> 
                    {{ item.horarioAprovacaoAlmoxarife }}
                </p>
            </v-list-item-content>
        </v-list-item>
    </div>
    <div 
    class="font-weight-light text-h5"
    v-else>
        Aguardando confirmações...
    </div>
</template>

<script>
export default {
    props: {
        item: Object
    },
    data() {
        return {}
    }
}
</script>