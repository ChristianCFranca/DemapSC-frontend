<template>
    <div>
        <ItemInteractRefused 
        :it="it"
        v-if="!it.aprovadoFiscal"/>
        <ItemInteractCompleted
        :it="it"
        v-else
        />
    </div>
</template>

<script>
import ItemInteractRefused from './ItemInteractRefused.vue'
import ItemInteractCompleted from './ItemInteractCompleted.vue'

export default {
    components: {
        ItemInteractRefused,
        ItemInteractCompleted
    },
    props: {
        it: Object
    },
    data() {
        return {
        }
    },
}
</script>