((typeof self !== 'undefined' ? self : this)["webpackJsonpNutribeShopify"] = (typeof self !== 'undefined' ? self : this)["webpackJsonpNutribeShopify"] || []).push([[7],{

/***/ "9422":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/ComponentsShopify/Products/MetaFields.vue?vue&type=template&id=1eacec05&scoped=true&lang=html&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"idproduct":_vm.productIdDisplay}},[_c('MetaField',{attrs:{"meta-fields":_vm.metaFields}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/ComponentsShopify/Products/MetaFields.vue?vue&type=template&id=1eacec05&scoped=true&lang=html&

// EXTERNAL MODULE: ./src/components/App/NutribeShopify/configs.js
var configs = __webpack_require__("cc84");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/ComponentsShopify/MetaFields/MetaField.vue?vue&type=template&id=33a79ebb&scoped=true&lang=html&
var MetaFieldvue_type_template_id_33a79ebb_scoped_true_lang_html_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('strong',[_vm._v("Liste de metafields")]),_c('div',{staticClass:"table-responsive"},[_c('table',{attrs:{"id":_vm.table_id}})])])}
var MetaFieldvue_type_template_id_33a79ebb_scoped_true_lang_html_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/ComponentsShopify/MetaFields/MetaField.vue?vue&type=template&id=33a79ebb&scoped=true&lang=html&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/ComponentsShopify/MetaFields/MetaField.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//

/**
 * Jquery doit etre definie (simulation);
 */
if (window.jQuery) {
  var $ = window.jQuery;
}
/**
 * moment simulation
 */


if (window.moment) {
  var moment = window.moment;
}

/* harmony default export */ var MetaFieldvue_type_script_lang_js_ = ({
  name: "MetaField",
  props: {
    metaFields: {
      type: Array,
      required: true
    }
  },
  components: {//
  },
  data: function data() {
    return {
      /**
       * Tables.
       */
      table_id: "table-datas-metafields",
      datatable: {}
    };
  },
  mounted: function mounted() {
    this.buildTable();
  },
  watch: {
    metaFields: {
      deep: true,
      handler: function handler() {
        this.buildTable();
      }
    }
  },
  computed: {//
  },
  methods: {
    buildTable: function buildTable() {
      var self = this;

      if (this.datatable.rows) {
        this.datatable.destroy();
        $("#" + this.table_id).empty();
      }

      this.datatable = $("#" + this.table_id).DataTable({
        data: self.metaFields,
        //info: false,
        order: [[0, "desc"]],
        columns: [{
          data: "key",
          title: "Key"
        }, {
          data: "value",
          title: "Valeur"
        }, {
          data: "created_at",
          title: "Date de creation",
          render: function render(data) {
            return moment(data).format("DD/MM/YYYY à HH:mm");
          },
          className: "created-at"
        }, {
          data: "updated_at",
          title: "Date de MAJ",
          render: function render(data) {
            return moment(data).format("DD/MM/YYYY à HH:mm");
          },
          className: "created-at"
        }],
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/French.json"
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/ComponentsShopify/MetaFields/MetaField.vue?vue&type=script&lang=js&
 /* harmony default export */ var MetaFields_MetaFieldvue_type_script_lang_js_ = (MetaFieldvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/App/NutribeShopify/ComponentsShopify/MetaFields/MetaField.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MetaFields_MetaFieldvue_type_script_lang_js_,
  MetaFieldvue_type_template_id_33a79ebb_scoped_true_lang_html_render,
  MetaFieldvue_type_template_id_33a79ebb_scoped_true_lang_html_staticRenderFns,
  false,
  null,
  "33a79ebb",
  null
  
)

/* harmony default export */ var MetaField = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/ComponentsShopify/Products/MetaFields.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//


/* harmony default export */ var MetaFieldsvue_type_script_lang_js_ = ({
  name: "MetaFields",
  props: {
    entity: {
      type: Object,
      required: true
    }
  },
  components: {
    MetaField: MetaField
  },
  data: function data() {
    return {
      metaFields: []
    };
  },
  mounted: function mounted() {
    this.GetProductMetafield();
  },
  watch: {//
  },
  computed: {
    productIdDisplay: function productIdDisplay() {
      this.GetProductMetafield();
      return this.productId;
    },
    productId: function productId() {
      return this.entity.id ? this.entity.id : 0;
    }
  },
  methods: {
    GetProductMetafield: function GetProductMetafield() {
      var _this = this;

      configs["a" /* default */].GetProductMetafield(this.productId).then(function (reponse) {
        _this.metaFields = reponse;
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/ComponentsShopify/Products/MetaFields.vue?vue&type=script&lang=js&
 /* harmony default export */ var Products_MetaFieldsvue_type_script_lang_js_ = (MetaFieldsvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/ComponentsShopify/Products/MetaFields.vue





/* normalize component */

var MetaFields_component = Object(componentNormalizer["a" /* default */])(
  Products_MetaFieldsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "1eacec05",
  null
  
)

/* harmony default export */ var MetaFields = __webpack_exports__["default"] = (MetaFields_component.exports);

/***/ })

}]);
//# sourceMappingURL=NutribeShopify.umd.7.js.map