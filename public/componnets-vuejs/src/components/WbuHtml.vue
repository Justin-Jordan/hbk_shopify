<!-- WbuHtml -->
<template>
  <div>
    <h2>TEST OK import direct KKSA888</h2>
    <a class="btn btn-outline-success" @hover="hover">Test methods </a>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
export default {
  name: "WbuHtml",
  mounted() {
    this.$root.$options.shadowRoot = true;
    console.log("Chargement du module : WbuHtml.vue");
  },
  methods: {
    hover() {
      alert("opoi");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "/siteweb/PluginsModules/stephane888/wbu-components/scss/style.scss";
a {
  color: #0f0 !important;
}
</style>
