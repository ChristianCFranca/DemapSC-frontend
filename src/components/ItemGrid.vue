<template>
    <div>
        <div class="text-center">
            <div class="font-weight-normal grey--text text-body-2">
                Finalidade dos Materiais
            </div>
            <div class="font-weight-normal text-body-1">
                {{ item.finalidade }}
            </div>
        </div>

        <v-divider class="my-3"></v-divider>
    
        <div v-for="(it, idx) in item.items" :key="idx">
            <v-row :class="greyRow(it)">
                <v-col 
                cols="12"
                sm="8"
                md="8">
                    <ItemInfo :it="it" :greyRow="greyRow(it)"/>
                </v-col>

                <v-col
                cols="1"
                ></v-col>

                <v-col 
                cols="12"
                sm="3"
                md="3">
                    <ItemInteractStep2 :itemActive="item.active" :userCanApprove="userCanApprove" :it="it" v-if="item.statusStep === 2"/>
                    <ItemInteractStep3 :itemActive="item.active" :userCanApprove="userCanApprove" :it="it" v-if="item.statusStep === 3"/>
                    <ItemInteractStep4 :itemActive="item.active" :userCanApprove="userCanApprove" :it="it" v-if="item.statusStep === 4"/>
                    <ItemInteractStep5 :itemActive="item.active" :userCanApprove="userCanApprove" :it="it" :empresa="item.empresa" :idx="idx" v-if="item.statusStep === 5"/>
                    <ItemInteractStep6 :it="it" :empresa="item.empresa" v-if="item.statusStep === 6"/>
                </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
        </div>

        <v-row>
            <v-col 
            cols="12" 
            xs="12" 
            sm="6" 
            md="6" 
            align="center"
            align-self="center">
                <ItemApprovedBy :item="item"/>
            </v-col>
            <v-divider vertical class="my-3"></v-divider>
            <v-col
            cols="12"
            xs="12" 
            sm="6" 
            md="6" 
            align="center"
            align-self="center">
                <ItemApproveArea :userCanApprove="userCanApprove" :userCanCancel="userCanCancel" :item="item" v-if="item.active && item.statusStep < 6"/>
                <ItemCompletedArea :itemActive="item.active" :item="item" v-else/>
            </v-col>
        </v-row>

    </div>
</template>

<script>
import ItemInfo from './ItemInfo.vue'
import ItemInteractStep2 from './steps/ItemInteractStep2.vue'
import ItemInteractStep3 from './steps/ItemInteractStep3.vue'
import ItemInteractStep4 from './steps/ItemInteractStep4.vue'
import ItemInteractStep5 from './steps/ItemInteractStep5.vue'
import ItemInteractStep6 from './steps/ItemInteractStep6.vue'
import ItemApprovedBy from './ItemApprovedBy.vue'
import ItemApproveArea from './ItemApproveArea.vue'
import ItemCompletedArea from './ItemCompletedArea.vue'

export default {
    props: {
        item: Object
    },
    components: {
        ItemInfo,
        ItemInteractStep2,
        ItemInteractStep3,
        ItemInteractStep4,
        ItemInteractStep5,
        ItemInteractStep6,
        ItemApproveArea,
        ItemCompletedArea,
        ItemApprovedBy
    },
    data() {
        return {

        }
    },
    methods: {
        greyRow(it) {
            return !it.aprovadoFiscal && this.item.statusStep >= 4 && this.item.active ? `grey lighten-4` : ``
        }
    },
    computed: {
        cargoCorreto() {
            return this.expectedRoles !== undefined ? this.expectedRoles.includes(this.$store.getters.getRole) : false;
        },
        userCanApprove() {
            return this.$store.getters.getApprovalsForRoles[this.item.statusStep].includes(this.$store.getters.getRole);
        },
        userCanCancel() {
            return this.$store.getters.getCancelForRoles[this.item.statusStep].includes(this.$store.getters.getRole);
        }
    }
}
</script>