((typeof self !== 'undefined' ? self : this)["webpackJsonpNutribeShopify"] = (typeof self !== 'undefined' ? self : this)["webpackJsonpNutribeShopify"] || []).push([[8],{

/***/ "c6e4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/PageProduit.vue?vue&type=template&id=6d77398e&scoped=true&lang=html&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('table',{attrs:{"id":_vm.table_id}}),_c('modal-slot',{attrs:{"id_modal":_vm.formated_id_modal,"show_footer":true,"modal_position":''},scopedSlots:_vm._u([{key:"modal_header",fn:function(){return [_c('h5',{staticClass:"modal-title",domProps:{"innerHTML":_vm._s(_vm.modal_title)}})]},proxy:true}])},[(_vm.modal_loading)?_c('div',{staticClass:"d-flex justify-content-center p-5"},[_c('h2',[_c('i',{staticClass:"fas fa-sync fa-spin text-warning"})])]):_vm._e(),_c(_vm.template_modalbody,{directives:[{name:"show",rawName:"v-show",value:(!_vm.modal_loading),expression:"!modal_loading"}],tag:"component",attrs:{"entity":_vm.product,"type-entity":"product"}})],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/PageProduit.vue?vue&type=template&id=6d77398e&scoped=true&lang=html&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("d3b7");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.js
var es_promise = __webpack_require__("e6cf");

// EXTERNAL MODULE: ./src/components/App/NutribeShopify/configs.js
var configs = __webpack_require__("cc84");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/PageProduit.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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


/* harmony default export */ var PageProduitvue_type_script_lang_js_ = ({
  name: "PageProduit",
  props: {//
  },
  components: {
    "modal-slot": function modalSlot() {
      return __webpack_require__.e(/* import() */ 6).then(__webpack_require__.bind(null, "c6de"));
    }
  },
  data: function data() {
    return {
      products: [],
      product: {},
      datatable: {},

      /**
       * Modal
       */
      id_modal: "action-blog",
      modal_title: "",
      modal_action: "",
      template_modalbody: "",
      modal_loading: false,

      /**
       * Tables.
       */
      table_id: "table-datas-products"
    };
  },
  mounted: function mounted() {
    this.GetProducts();
  },
  watch: {//
  },
  computed: {
    formated_id_modal: {
      get: function get() {
        return "model-style-" + this.id_modal;
      }
    },
    productId: function productId() {
      if (this.product.id) {
        return this.product.id;
      } else {
        return 0;
      }
    }
  },
  methods: {
    GetProducts: function GetProducts() {
      var _this = this;

      configs["a" /* default */].GetProducts().then(function (result) {
        _this.products = result;

        _this.buildTable();
      });
    },
    open_modal: function open_modal(action) {
      var self = this;
      self.modal_title = this.product.title;
      $("#" + self.formated_id_modal).modal("show");
      $("#" + self.formated_id_modal).on("shown.bs.modal", function () {
        $("#" + self.formated_id_modal).off("shown.bs.modal");
      });

      switch (action) {
        case "gestion_saveurs":
          this.template_modalbody = function () {
            return __webpack_require__.e(/* import() */ 2).then(__webpack_require__.bind(null, "c9a4"));
          };

          break;

        case "gestion_models_sections":
          this.template_modalbody = function () {
            return __webpack_require__.e(/* import() */ 3).then(__webpack_require__.bind(null, "aa38"));
          };

          break;

        case "show_metafields":
          this.template_modalbody = function () {
            return __webpack_require__.e(/* import() */ 7).then(__webpack_require__.bind(null, "9422"));
          };

          break;

        default:
          this.template_modalbody = "";
          break;
      }
    },
    buildTable: function buildTable() {
      var self = this;

      if (this.datatable.rows) {
        this.datatable.destroy();
        $("#" + this.table_id).empty();
      }

      this.datatable = $("#" + this.table_id).DataTable({
        data: self.products,
        //info: false,
        order: [[0, "desc"]],
        columns: [{
          data: "id",
          title: "# ID "
        }, {
          data: "title",
          title: "Titre"
        }, {
          data: "created_at",
          title: "Date de creation",
          render: function render(data) {
            return moment(data).format("DD/MM/YYYY à HH:mm"); //return $.fn.dataTable.render.moment(data);
          },
          className: "created-at"
        }, {
          className: "details-control",
          orderable: false,
          data: null,
          title: "Action",
          defaultContent: "<select class=\" form-control select-action\">\n                  <option value=\"\" selected> Aucun(e)</option>\n                  <option value=\"gestion_saveurs\"> Gerer des saveurs </option>\n                  <option value=\"gestion_models_sections\"> Gestion models sections </option>\n                </select>"
        }
        /**
         * <option value="gestion_cat_virtuel"> Gestions des categories </option>
         * Permet de d'utiliser l'approche 1, qui bug un peu.
         * utilise le fichier PageBlogNone
         */
        ],
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/French.json"
        }
      });
      var table = this.datatable;
      $("#" + this.table_id).addClass("light-table table");
      $("#" + this.table_id + " thead").addClass("thead-light table-header");
      /**
       * On ajoute les colonnes selectionnes en surbriallance
       */

      /*
      $("#" + this.table_id + " tbody").on("mouseenter", "td", function() {
        var colIdx = table.cell(this).index().column;
         $(table.cells().nodes()).removeClass("highlight");
        $(table.column(colIdx).nodes()).addClass("highlight");
      });
      /**/

      /**
       * On applique l'action
       */

      $("#" + this.table_id + " tbody").on("click", "tr .select-action", function () {
        var action = $(this).val();
        var tr = $(this).parent().parent();

        if (action !== "") {
          self.product = table.row(tr).data(); //console.log("self.product : ", self.product);

          self.open_modal(action);
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/PageProduit.vue?vue&type=script&lang=js&
 /* harmony default export */ var NutribeShopify_PageProduitvue_type_script_lang_js_ = (PageProduitvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/App/NutribeShopify/PageProduit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  NutribeShopify_PageProduitvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "6d77398e",
  null
  
)

/* harmony default export */ var PageProduit = __webpack_exports__["default"] = (component.exports);

/***/ })

}]);
//# sourceMappingURL=NutribeShopify.common.8.js.map