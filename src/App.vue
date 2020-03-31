<template>
  <v-app>
    <router-view v-if="layout == 'undefined-layout'" />
    <component v-else :is="layout">
      <router-view />
    </component>
    <notifications group="app" />
  </v-app>
</template>

<script>
import AdminLayout from "@/layouts/adminLayout";
export default {
  name: "App",
  computed: {
    layout() {
      return this.$route.meta.layout + "-layout";
    }
  },
  components: {
    AdminLayout
  },

  data: () => ({
    //
  })
};
</script>
