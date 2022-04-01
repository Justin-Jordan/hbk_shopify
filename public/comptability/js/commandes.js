jQuery(document).ready(function ($) {
  Vue.component("commandes", Commandes);
  new Vue({
    delimiters: ["${", "}"],
    el: "#commandes",
    data: { config__manage_connect: {} },
    methods: {
      getconfig__manage_connect: async function (configs) {
        this.$refs.commandes.getconfig__manage_connect(configs);
      },
    },
  });
});
