<template>
    <div>
        <v-app-bar
        color="#6A76AB"
        dark
        src="../assets/banner.jpg"
        >
        <template v-slot:img="{ props }">
            <v-img
            v-bind="props"
            gradient="to top right, rgba(0,0,0,.8), rgba(0,33,90,.6)"
            ></v-img>
        </template>

        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-spacer></v-spacer>

        <v-app-bar-title><h2><v-icon left>mdi-tools</v-icon><span class="font-weight-light">Demap</span><span class="font-weight-bold">SM</span></h2></v-app-bar-title>

        <v-spacer></v-spacer>
        
        <template v-slot:extension>
            <v-tabs>
                <v-spacer></v-spacer>
                <v-tab route to="/novo-pedido">Novo Pedido de Compra</v-tab>
                <v-tab route to="/andamentos">Conferir Andamentos</v-tab>
                <v-spacer></v-spacer>
            </v-tabs>
        </template>
        
        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>

        </v-app-bar>
    </div>
</template>

<script>

export default {
    data() {
        return {
        }
    }
}

</script>
