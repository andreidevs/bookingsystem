<template>
  <v-app>
    <router-view />
    <notifications group="app" />
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  })
};
</script>
