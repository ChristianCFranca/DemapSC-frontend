<template>
  <v-app>
    <v-snackbar v-model="$store.getters.getSnackbar.state" :timeout="4000" top :color="$store.getters.getSnackbar.color">
        {{ $store.getters.getSnackbar.message }}
        <template v-slot:action="{ attrs }">
            <v-btn color="white" v-bind="attrs" text @click="$store.commit('UNSET_SNACKBAR')">Close</v-btn>
        </template>
    </v-snackbar>
    <NavBar v-if="isAuthenticated"/>
    <v-main :class="isAuthenticated ? `grey lighten-4` : ``">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar";

export default {
  name: 'App',

  components: {
    NavBar
  },

  data: () => ({
  }),
  computed: {
    isAuthenticated() {
      return this.$store.getters.getIsAuthenticated
    }
  }
};
</script>