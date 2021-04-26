<template>
  <v-app>
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