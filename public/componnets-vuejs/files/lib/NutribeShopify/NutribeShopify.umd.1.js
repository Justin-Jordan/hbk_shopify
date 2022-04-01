((typeof self !== 'undefined' ? self : this)["webpackJsonpNutribeShopify"] = (typeof self !== 'undefined' ? self : this)["webpackJsonpNutribeShopify"] || []).push([[1,6],{

/***/ "1276":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
var isRegExp = __webpack_require__("44e7");
var anObject = __webpack_require__("825a");
var requireObjectCoercible = __webpack_require__("1d80");
var speciesConstructor = __webpack_require__("4840");
var advanceStringIndex = __webpack_require__("8aa5");
var toLength = __webpack_require__("50c4");
var callRegExpExec = __webpack_require__("14c3");
var regexpExec = __webpack_require__("9263");
var fails = __webpack_require__("d039");

var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);


/***/ }),

/***/ "14c3":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("c6b6");
var regexpExec = __webpack_require__("9263");

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),

/***/ "2532":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var notARegExp = __webpack_require__("5a34");
var requireObjectCoercible = __webpack_require__("1d80");
var correctIsRegExpLogic = __webpack_require__("ab13");

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "3452":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/PageArticle.vue?vue&type=template&id=7bf92048&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('ajax',{attrs:{"numbre_request":_vm.trigger_request,"data":_vm.data_post,"token":_vm.ajax_token,"debug":false,"show_alert_msg":_vm.show_alert_msg,"messages":_vm.ajax_messages},on:{"ev_ajax_success":_vm.ev_ajax_success,"ev_ajax_error":_vm.ev_ajax_error}}),_c('h4',[_vm._v("Blogs")]),_c('div',{staticClass:"lists-checkbox d-flex flex-wrap mt-3 space-bottom-xl"},_vm._l((_vm.blogs),function(blog,index){return _c('div',{key:index,staticClass:"custom-control custom-checkbox"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.blogs_select),expression:"blogs_select"}],staticClass:"custom-control-input",class:'bg-' + blog.handle,attrs:{"type":"checkbox","id":'cus585Check' + index},domProps:{"value":blog.id,"checked":Array.isArray(_vm.blogs_select)?_vm._i(_vm.blogs_select,blog.id)>-1:(_vm.blogs_select)},on:{"change":function($event){var $$a=_vm.blogs_select,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=blog.id,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.blogs_select=$$a.concat([$$v]))}else{$$i>-1&&(_vm.blogs_select=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.blogs_select=$$c}}}}),_c('label',{staticClass:"custom-control-label",class:'bg-' + blog.handle,attrs:{"for":'cus585Check' + index},domProps:{"innerHTML":_vm._s(blog.title)},on:{"click":function($event){return _vm.select_remove_blog(blog.id)}}})])}),0),(_vm.table_loading)?_c('div',{staticClass:"d-flex justify-content-center p-5 "},[_vm._m(0)]):_vm._e(),_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.table_loading),expression:"!table_loading"}]},[_c('table',{attrs:{"id":_vm.table_id}})]),_c('modal-slot',{attrs:{"id_modal":_vm.formated_id_modal,"show_footer":true,"modal_position":''},scopedSlots:_vm._u([{key:"modal_header",fn:function(){return [_c('h5',{staticClass:"modal-title",domProps:{"innerHTML":_vm._s(_vm.modal_title)}})]},proxy:true}])},[(_vm.modal_loading)?_c('div',{staticClass:"d-flex justify-content-center p-5"},[_c('h2',[_c('i',{staticClass:"fas fa-sync fa-spin text-warning"})])]):_vm._e(),_c(_vm.template_modalbody,{directives:[{name:"show",rawName:"v-show",value:(!_vm.modal_loading),expression:"!modal_loading"}],ref:"composant",tag:"component",attrs:{"article":_vm.article_select,"articles":_vm.articles,"blog":_vm.getBlog(_vm.article_select['blog_id']),"blogs":_vm.blogs,"metafields":_vm.metafields,"form_running":_vm.form_running},on:{"ev_index":_vm.ev_index}})],1)],1)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('h2',[_c('i',{staticClass:"fas fa-sync fa-spin text-warning"})])}]


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/PageArticle.vue?vue&type=template&id=7bf92048&

// EXTERNAL MODULE: ./src/components/App/NutribeShopify/Ajax.vue + 9 modules
var Ajax = __webpack_require__("6f2e");

// EXTERNAL MODULE: ./src/components/App/NutribeShopify/configs.js
var configs = __webpack_require__("cc84");

// EXTERNAL MODULE: ./src/components/Modals/ModalSlot.vue + 4 modules
var ModalSlot = __webpack_require__("c6de");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/ReferenceBlock.vue?vue&type=template&id=9e704fc6&
var ReferenceBlockvue_type_template_id_9e704fc6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{attrs:{"id":_vm.id_html}},_vm._l((_vm.blocks),function(block,index){return _c('div',{key:index,staticClass:"drap-drop-box"},[_c('div',{staticClass:"d-flex justify-content-center align-items-center"},[_c('div',{staticClass:"identifiant text-center py-2"},[_vm._v(" "+_vm._s(index + 1)+" "),_c('i',{staticClass:"fas fa-arrows-alt fa-2x text-warning"})]),_c('div',{staticClass:"w-100"},[_c('div',{staticClass:"form-group"},[_c('label',[_vm._v("Libellé")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(block.art_ref_titre),expression:"block.art_ref_titre"}],staticClass:" form-control",attrs:{"type":"text"},domProps:{"value":(block.art_ref_titre)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(block, "art_ref_titre", $event.target.value)}}})]),_c('div',{staticClass:"form-group"},[_c('label',[_vm._v("Url")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(block.art_ref_description),expression:"block.art_ref_description"}],staticClass:" form-control",attrs:{"type":"text"},domProps:{"value":(block.art_ref_description)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(block, "art_ref_description", $event.target.value)}}})]),_c('span',{staticClass:"btn btn-outline-danger btn-sm remove-block",on:{"click":function($event){return _vm.remove_block(index)}}},[_c('i',{staticClass:"fas fa-trash-alt"})])])])])}),0),_c('div',[(_vm.show_save)?_c('span',{staticClass:"btn btn-outline-success btn-sm",on:{"click":_vm.save_reference}},[_vm._v(" Enregistrer "),(_vm.form_running)?_c('i',{staticClass:"fas fa-sync fa-spin "}):_vm._e()]):_vm._e(),(_vm.show_add)?_c('span',{staticClass:"btn btn-outline-success btn-sm float-right ",on:{"click":_vm.add_new_block}},[_vm._v(" Ajouter un bloc ")]):_vm._e()])])}
var ReferenceBlockvue_type_template_id_9e704fc6_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ReferenceBlock.vue?vue&type=template&id=9e704fc6&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.splice.js
var es_array_splice = __webpack_require__("a434");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/ReferenceBlock.vue?vue&type=script&lang=js&

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
//
//
//
//
//
//
//

/**
 * Jquery doit etre definie;
 */
var $;

if (window.jQuery) {
  $ = window.jQuery;
} else if (window.$) {
  $ = window.$;
}

function set_defautl_model(id) {
  return {
    id: id,
    art_ref_titre: "",
    art_ref_description: ""
  };
}

/* harmony default export */ var ReferenceBlockvue_type_script_lang_js_ = ({
  name: "ReferenceBlock",
  props: {
    article: {
      type: Object
    },
    metafields: {
      type: [Array, Object]
    },
    form_running: {
      type: Boolean
    },
    id_html: {
      type: String,
      default: "blocks-reference"
    }
  },
  data: function data() {
    return {
      /**
       * Contient les  blocks de references.
       */
      blocks: [],
      show_add: true,
      show_save: true,
      metafield_name: "ref_blocks"
      /**
       * id blocks
       */

    };
  },
  mounted: function mounted() {
    //console.log("chargement du module ReferenceBlock");
    this.PrepareBuildBloc();
  },
  methods: {
    PrepareBuildBloc: function PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc: function buildBloc() {
      this.blocks = []; //alert("");

      var nombreMetafield = this.metafields.length;

      if (nombreMetafield) {
        for (var i in this.metafields) {
          var metafield = this.metafields[i];

          if (metafield.key === this.metafield_name) {
            var val = JSON.parse(metafield.value); //console.log("block datas, ", metafield.value, val);

            if (metafield.value_type === "json_string") {
              this.blocks = val;
            } else {
              /**
               * Le type string etait utiliser au debut, actuelement on convertie en  json_string.
               */
              // on verifie si  c'est un object, on convertie en tableau.
              if (val instanceof Array) {
                this.blocks = this.deCodeData(val);
              } else {
                for (var j in val) {
                  this.blocks.push(this.deCodeData(val[j]));
                }
              }
            }
          }
          /**
           *  En fin de boucle :
           *  - On ajoute la valeur par defaut.
           *  - On ajoute le trie.
           */


          var ii = parseInt(i) + 1;

          if (nombreMetafield === ii) {
            if (!this.blocks.length) {
              this.blocks.push(set_defautl_model(this.article.id));
            }

            this.add_sortable();
          }
        }
      } else {
        this.blocks.push(set_defautl_model(this.article.id));
      }
    },
    deCodeData: function deCodeData(data) {
      for (var i in data) {
        data[i] = decodeURIComponent(data[i]);
      }

      return data;
    },
    enCodeData: function enCodeData(data) {
      for (var i in data) {
        data[i] = encodeURIComponent(data[i]);
      }

      return data;
    },

    /**
     * On tranmet les donnnées non encodes qui doivent etre encoder par le parent.
     * Cette etape ne serra plus necessaire si on utilise le type jaon_string.
     *
     */
    save_reference: function save_reference() {
      this.$emit("ev_index", {
        action: "save_metafield",
        key: this.metafield_name,
        value: this.blocks,
        type_metafield: "json_string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    },
    add_new_block: function add_new_block() {
      this.blocks.push({
        id: this.article.id,
        art_ref_titre: "",
        art_ref_description: ""
      });
    },
    remove_block: function remove_block(index) {
      this.blocks.splice(index, 1);
    },
    add_sortable: function add_sortable() {
      var self = this;
      var old_index, new_index;
      $("#" + this.id_html).sortable({
        axis: "y",
        cursor: "move",
        handle: ".identifiant",
        //containment: "parent",
        placeholder: "ui-state-highlight",
        //revert: true,
        start: function start(event, ui) {
          if (event) {
            console.log("height : ", $(ui.item[0]).height());
            $(" .ui-state-highlight").height($(ui.item[0]).height());
            old_index = $(ui.item[0]).index();
          }
        },
        stop: function stop(event, ui) {
          if (event) {
            new_index = $(ui.item[0]).index();
            /**
             * Il faut desactiver avant de modofier le tableau.
             */

            $("#" + self.id_html).sortable("cancel");
            self.array_move(self.blocks, old_index, new_index);
            /*
            console.log(
              "old_index : ",
              old_index,
              "\n new_index : ",
              new_index
            );
            /**/
          }
        }
      });
    },
    array_move: function array_move(arr, old_index, new_index) {
      while (old_index < 0) {
        old_index += arr.length;
      }

      while (new_index < 0) {
        new_index += arr.length;
      }

      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;

        while (k--) {
          arr.push(undefined);
        }
      }

      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }
  },
  computed: {//
  },
  watch: {
    article: {
      handler: function handler() {//this.PrepareBuildBloc();
      },
      deep: true
    },
    metafields: {
      handler: function handler() {
        this.PrepareBuildBloc();
      },
      deep: true
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ReferenceBlock.vue?vue&type=script&lang=js&
 /* harmony default export */ var cmpts_ReferenceBlockvue_type_script_lang_js_ = (ReferenceBlockvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ReferenceBlock.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  cmpts_ReferenceBlockvue_type_script_lang_js_,
  ReferenceBlockvue_type_template_id_9e704fc6_render,
  ReferenceBlockvue_type_template_id_9e704fc6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ReferenceBlock = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/TypeLivreV2.vue?vue&type=template&id=59d8477c&
var TypeLivreV2vue_type_template_id_59d8477c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"tab"},[_c('div',{staticClass:"w-100"},[_c('label',[_vm._v("Type")]),_c('div',{staticClass:"lists-checkbox d-flex flex-wrap mt-2 mb-4"},_vm._l((_vm.blog_categories),function(blog,key){return _c('div',{key:key,staticClass:"custom-control custom-checkbox"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.blog_type),expression:"blog_type"}],staticClass:"custom-control-input",attrs:{"type":"checkbox","id":'blog-' + _vm.camelToUnderscore(blog.value)},domProps:{"value":blog.id,"checked":Array.isArray(_vm.blog_type)?_vm._i(_vm.blog_type,blog.id)>-1:(_vm.blog_type)},on:{"change":function($event){var $$a=_vm.blog_type,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=blog.id,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.blog_type=$$a.concat([$$v]))}else{$$i>-1&&(_vm.blog_type=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.blog_type=$$c}}}}),_c('label',{staticClass:"custom-control-label",attrs:{"for":'blog-' + _vm.camelToUnderscore(blog.value)},domProps:{"innerHTML":_vm._s(blog.value)}})])}),0)]),_c('div',[(_vm.show_save)?_c('span',{staticClass:"btn btn-outline-success btn-sm",on:{"click":_vm.save_reference}},[_vm._v(" Enregistrer "),(_vm.form_running)?_c('i',{staticClass:"fas fa-sync fa-spin "}):_vm._e()]):_vm._e()])])])}
var TypeLivreV2vue_type_template_id_59d8477c_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/TypeLivreV2.vue?vue&type=template&id=59d8477c&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__("caad");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.join.js
var es_array_join = __webpack_require__("a15b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__("ac1f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.includes.js
var es_string_includes = __webpack_require__("2532");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js
var es_string_replace = __webpack_require__("5319");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.split.js
var es_string_split = __webpack_require__("1276");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/TypeLivreV2.vue?vue&type=script&lang=js&







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
//
//
//
//
//
//
//
//
//
/* harmony default export */ var TypeLivreV2vue_type_script_lang_js_ = ({
  name: "TypeLivre",
  props: {
    article: {
      type: Object
    },
    metafields: {
      type: [Array, Object]
    },
    form_running: {
      type: Boolean
    },
    id_html: {
      type: String,
      default: "type-livre"
    },
    blog: [Object, Array]
  },
  data: function data() {
    return {
      /**
       * variable pour gerer le type de blog
       */
      blog_type: [],
      show_save: true,
      // metafield au niveau de l'article.
      metafield_name: "type_livre",
      // metafield au niveau du blog.
      metafield_name_blog: "blog_categories",
      //contient la liste des categories,
      blog_categories: [],
      blog_categories_ids: [],
      //
      current_tab: "",
      //
      metafields_blog: []
    };
  },
  watch: {
    metafields: {
      handler: function handler() {
        this.PrepareBuildBloc();
      },
      deep: true
    }
  },
  methods: {
    PrepareBuildBloc: function PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
        this.metafields_blog = this.blog.metafields;
        this.buildCategorie();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc: function buildBloc() {
      this.blog_type = []; //alert("");

      var val;
      var nombreMetafield = this.metafields.length;

      if (nombreMetafield) {
        for (var i in this.metafields) {
          var metafield = this.metafields[i];

          if (metafield.key === this.metafield_name) {
            val = JSON.parse(metafield.value);
            console.log("block type, ", val);
            this.blog_type = val; // on nettoie les valeurs.
          }
        }
      }
    },
    cleanValue: function cleanValue() {
      for (var i in this.blog_type) {
        //last_array.splice(index, 1);
        if (!this.blog_categories_ids.includes(this.blog_type[i])) {
          this.blog_type.splice(i, 1);
        }
        /*
        for (const j in this.blog_categories) {
          if (this.blog_categories[j].id == this.blog_type[i]) {
            this.blog_type.splice(i, 1);
            break;
          }
        }
        /**/

      }
    },
    buildCategorie: function buildCategorie() {
      var val;

      for (var i in this.metafields_blog) {
        var metafield = this.metafields_blog[i];

        if (metafield.key === this.metafield_name_blog) {
          val = JSON.parse(metafield.value);

          if (val) {
            this.blog_categories = val;
            this.blog_categories_ids = [];

            for (var z in val) {
              this.blog_categories_ids.push(val[z].id);
            }

            this.cleanValue();
          }
        }
      }
    },

    /**
     * On tranmet les donnnées non encodes qui doivent etre encoder par le parent.
     * Cette etape ne serra plus necessaire si on utilise le type jaon_string.
     *
     */
    save_reference: function save_reference() {
      this.$emit("ev_index", {
        action: "save_metafield",
        key: this.metafield_name,
        value: this.blog_type,
        type_metafield: "json_string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    },
    camelToUnderscore: function camelToUnderscore(key) {
      var result = key.replace(/([A-Z])/g, " $1");
      return result.split(" ").join("-").toLowerCase();
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/TypeLivreV2.vue?vue&type=script&lang=js&
 /* harmony default export */ var cmpts_TypeLivreV2vue_type_script_lang_js_ = (TypeLivreV2vue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/TypeLivreV2.vue





/* normalize component */

var TypeLivreV2_component = Object(componentNormalizer["a" /* default */])(
  cmpts_TypeLivreV2vue_type_script_lang_js_,
  TypeLivreV2vue_type_template_id_59d8477c_render,
  TypeLivreV2vue_type_template_id_59d8477c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var TypeLivreV2 = (TypeLivreV2_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/ArticlesLier.vue?vue&type=template&id=29d0ff6a&
var ArticlesLiervue_type_template_id_29d0ff6a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"form-group"},[_c('label',[_vm._v(" Selectionner l'article ")]),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.filter_article),expression:"filter_article"}],staticClass:" form-control",on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.filter_article=$event.target.multiple ? $$selectedVal : $$selectedVal[0]}}},_vm._l((_vm.formetad_select_articles),function(article,index){return _c('option',{key:index,domProps:{"value":index,"innerHTML":_vm._s(article.title)}})}),0)]),_c('div',{staticClass:"lists-checkbox d-flex flex-wrap my-3"},_vm._l((_vm.blogs),function(blog,index){return _c('div',{key:index,staticClass:"custom-control custom-checkbox"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.blogs_select),expression:"blogs_select"}],staticClass:"custom-control-input",attrs:{"type":"checkbox","id":'cus475Check' + index},domProps:{"value":blog.id,"checked":Array.isArray(_vm.blogs_select)?_vm._i(_vm.blogs_select,blog.id)>-1:(_vm.blogs_select)},on:{"change":function($event){var $$a=_vm.blogs_select,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=blog.id,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.blogs_select=$$a.concat([$$v]))}else{$$i>-1&&(_vm.blogs_select=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.blogs_select=$$c}}}}),_c('label',{staticClass:"custom-control-label",attrs:{"for":'cus475Check' + index},domProps:{"innerHTML":_vm._s(blog.title)}})])}),0),_c('div',{attrs:{"id":_vm.id_html}},_vm._l((_vm.articles_lier),function(block,index){return _c('div',{key:index,staticClass:"drap-drop-box"},[_c('div',{staticClass:"d-flex justify-content-center align-items-center"},[_c('div',{staticClass:"identifiant text-center py-2"},[_vm._v(" "+_vm._s(index + 1)+" "),_c('i',{staticClass:"fas fa-arrows-alt fa-2x text-warning"})]),_c('div',{staticClass:"w-100"},[_c('div',{staticClass:"form-group"},[_c('a',{attrs:{"href":'https://nutribe.fr/' +
                  block.blog_handle +
                  '/' +
                  block.handle_article,"target":"_blanck"},domProps:{"innerHTML":_vm._s(block.title)}})]),_c('span',{staticClass:"btn btn-outline-danger btn-sm remove-block",on:{"click":function($event){return _vm.remove_block(index)}}},[_c('i',{staticClass:"fas fa-trash-alt"})])])])])}),0),_c('div',[(_vm.show_save)?_c('span',{staticClass:"btn btn-outline-success btn-sm",on:{"click":_vm.save_reference}},[_vm._v(" Enregistrer "),(_vm.form_running)?_c('i',{staticClass:"fas fa-sync fa-spin "}):_vm._e()]):_vm._e()]),_c('pre',{staticClass:"d-none"},[_vm._v("    "+_vm._s(_vm.articles_lier)+"\n  ")])])}
var ArticlesLiervue_type_template_id_29d0ff6a_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ArticlesLier.vue?vue&type=template&id=29d0ff6a&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/ArticlesLier.vue?vue&type=script&lang=js&



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
 * Jquery doit etre definie;
 */
var ArticlesLiervue_type_script_lang_js_$;

if (window.jQuery) {
  ArticlesLiervue_type_script_lang_js_$ = window.jQuery;
} else if (window.$) {
  ArticlesLiervue_type_script_lang_js_$ = window.$;
}

/* harmony default export */ var ArticlesLiervue_type_script_lang_js_ = ({
  name: "TypeLivre",
  props: {
    article: {
      type: Object
    },
    metafields: {
      type: [Array, Object]
    },
    form_running: {
      type: Boolean
    },
    id_html: {
      type: String,
      default: "articles-lier"
    },
    articles: {
      type: Array
    },
    blogs: {
      type: Array
    }
  },
  data: function data() {
    return {
      /**
       * Variable pour gerer le type de blog
       */
      articles_lier: [],
      show_save: true,
      metafield_name: "articles_lier",
      filter_article: "",
      blogs_select: [],
      articles_lier_index: []
    };
  },
  computed: {
    formetad_select_articles: {
      get: function get() {
        return this.buildSelectList();
      }
    }
  },
  watch: {
    blogs_select: {
      handler: function handler(val) {
        this.$emit("ev_index", {
          action: "update_select_blog",
          blogs_select: val
        });
      },
      deep: true
    },
    metafields: {
      handler: function handler() {
        this.PrepareBuildBloc();
      },
      deep: true
    },
    filter_article: function filter_article(index) {
      if (index !== "") {
        this.add_article(this.formetad_select_articles[index]);
      }
    }
  },
  methods: {
    remove_block: function remove_block(index) {
      if (this.articles_lier[index]) {
        for (var i in this.articles_lier_index) {
          if (this.articles_lier_index[i] === this.articles_lier[index].id) {
            this.articles_lier.splice(index, 1);
            this.articles_lier_index.splice(i, 1);
            break;
          }
        }
      }
    },
    PrepareBuildBloc: function PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc: function buildBloc() {
      this.articles_lier = [];
      this.articles_lier_index = []; //alert("");

      var nombreMetafield = this.metafields.length;

      if (nombreMetafield) {
        for (var i in this.metafields) {
          var metafield = this.metafields[i];

          if (metafield.key === this.metafield_name) {
            var val = JSON.parse(metafield.value);
            this.articles_lier = val;

            for (var j in val) {
              this.articles_lier_index.push(val[j].id);
            }

            break;
          }
        }
      }
    },

    /**
     * On tranmet les donnnées non encodes qui doivent etre encoder par le parent.
     * Cette etape ne serra plus necessaire si on utilise le type jaon_string.
     *
     */
    save_reference: function save_reference() {
      this.$emit("ev_index", {
        action: "save_metafield",
        key: this.metafield_name,
        value: this.articles_lier,
        type_metafield: "json_string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    },
    set_value: function set_value(val) {
      this.blogs_select = val;
    },
    buildSelectList: function buildSelectList() {
      var array_formated = [];

      for (var i in this.articles) {
        var article = this.articles[i];

        if (!this.articles_lier_index.includes(article.id)) {
          array_formated.push(article);
        }
      }

      return array_formated;
    },
    add_article: function add_article(article) {
      //console.log("article", article);
      var self = this;

      var execution = function execution(blog_handle, article) {
        self.articles_lier.push({
          id: article.id,
          handle_article: article.handle,
          blog_handle: blog_handle,
          title: article.title
        });
        self.articles_lier_index.push(article.id);
      };

      for (var i in this.blogs) {
        if (article.blog_id == this.blogs[i].id) {
          execution(this.blogs[i].handle, article);
          this.add_sortable();
          break;
        }
      }

      this.filter_article = "";
    },
    add_sortable: function add_sortable() {
      var self = this;
      var old_index, new_index;
      ArticlesLiervue_type_script_lang_js_$("#" + this.id_html).sortable({
        axis: "y",
        cursor: "move",
        handle: ".identifiant",
        //containment: "parent",
        placeholder: "ui-state-highlight",
        //revert: true,
        start: function start(event, ui) {
          if (event) {
            console.log("height : ", ArticlesLiervue_type_script_lang_js_$(ui.item[0]).height());
            ArticlesLiervue_type_script_lang_js_$(" .ui-state-highlight").height(ArticlesLiervue_type_script_lang_js_$(ui.item[0]).height());
            old_index = ArticlesLiervue_type_script_lang_js_$(ui.item[0]).index();
          }
        },
        stop: function stop(event, ui) {
          if (event) {
            new_index = ArticlesLiervue_type_script_lang_js_$(ui.item[0]).index();
            /**
             * Il faut desactiver avant de modofier le tableau.
             */

            ArticlesLiervue_type_script_lang_js_$("#" + self.id_html).sortable("cancel");
            self.array_move(self.articles_lier, old_index, new_index);
            /*
            console.log(
              "old_index : ",
              old_index,
              "\n new_index : ",
              new_index
            );
            /**/
          }
        }
      });
    },
    array_move: function array_move(arr, old_index, new_index) {
      while (old_index < 0) {
        old_index += arr.length;
      }

      while (new_index < 0) {
        new_index += arr.length;
      }

      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;

        while (k--) {
          arr.push(undefined);
        }
      }

      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ArticlesLier.vue?vue&type=script&lang=js&
 /* harmony default export */ var cmpts_ArticlesLiervue_type_script_lang_js_ = (ArticlesLiervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ArticlesLier.vue





/* normalize component */

var ArticlesLier_component = Object(componentNormalizer["a" /* default */])(
  cmpts_ArticlesLiervue_type_script_lang_js_,
  ArticlesLiervue_type_template_id_29d0ff6a_render,
  ArticlesLiervue_type_template_id_29d0ff6a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ArticlesLier = (ArticlesLier_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/PositionImage.vue?vue&type=template&id=3359ca1a&
var PositionImagevue_type_template_id_3359ca1a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"blog-position_image"}},[_vm._v("Position image")]),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.position_image),expression:"position_image"}],staticClass:" form-control",attrs:{"id":"blog-position_image"},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.position_image=$event.target.multiple ? $$selectedVal : $$selectedVal[0]}}},[_c('option',{attrs:{"value":"bottom"}},[_vm._v("Bottom")]),_c('option',{attrs:{"value":"center"}},[_vm._v("Center")]),_c('option',{attrs:{"value":"top"}},[_vm._v("Top")])])]),_c('div',[(_vm.show_save)?_c('span',{staticClass:"btn btn-outline-success btn-sm",on:{"click":_vm.save_reference}},[_vm._v(" Enregistrer "),(_vm.form_running)?_c('i',{staticClass:"fas fa-sync fa-spin "}):_vm._e()]):_vm._e()])])}
var PositionImagevue_type_template_id_3359ca1a_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/PositionImage.vue?vue&type=template&id=3359ca1a&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/PositionImage.vue?vue&type=script&lang=js&

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
//
//
/* harmony default export */ var PositionImagevue_type_script_lang_js_ = ({
  name: "PositionImage",
  props: {
    article: {
      type: Object
    },
    metafields: {
      type: [Array, Object]
    },
    form_running: {
      type: Boolean
    },
    id_html: {
      type: String,
      default: "articles-lier"
    },
    articles: {
      type: Array
    },
    blogs: {
      type: Array
    }
  },
  data: function data() {
    return {
      show_save: true,
      position_image: "bottom",
      metafield_name: "position_image"
    };
  },
  watch: {
    metafields: {
      handler: function handler() {
        this.PrepareBuildBloc();
      },
      deep: true
    }
  },
  methods: {
    remove_block: function remove_block(index) {
      this.blocks.splice(index, 1);
    },
    PrepareBuildBloc: function PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc: function buildBloc() {
      this.position_image = ""; //alert("");

      var nombreMetafield = this.metafields.length;

      if (nombreMetafield) {
        for (var i in this.metafields) {
          var metafield = this.metafields[i];

          if (metafield.key === this.metafield_name) {
            this.position_image = metafield.value;
          }
        }
      }
    },

    /**
     * On tranmet les donnnées non encodes qui doivent etre encoder par le parent.
     * Cette etape ne serra plus necessaire si on utilise le type jaon_string.
     *
     */
    save_reference: function save_reference() {
      this.$emit("ev_index", {
        action: "save_metafield",
        key: this.metafield_name,
        value: this.position_image,
        type_metafield: "string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/PositionImage.vue?vue&type=script&lang=js&
 /* harmony default export */ var cmpts_PositionImagevue_type_script_lang_js_ = (PositionImagevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/PositionImage.vue





/* normalize component */

var PositionImage_component = Object(componentNormalizer["a" /* default */])(
  cmpts_PositionImagevue_type_script_lang_js_,
  PositionImagevue_type_template_id_3359ca1a_render,
  PositionImagevue_type_template_id_3359ca1a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var PositionImage = (PositionImage_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/ArticleVideo.vue?vue&type=template&id=4eba1d86&
var ArticleVideovue_type_template_id_4eba1d86_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"article_video"}},[_vm._v("Contenu (video)")]),_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.article_video),expression:"article_video"}],staticClass:"form-control",attrs:{"id":"article_video","rows":"12"},domProps:{"value":(_vm.article_video)},on:{"input":function($event){if($event.target.composing){ return; }_vm.article_video=$event.target.value}}})]),_c('div',[(_vm.show_save)?_c('span',{staticClass:"btn btn-outline-success btn-sm",on:{"click":_vm.save_reference}},[_vm._v(" Enregistrer "),(_vm.form_running)?_c('i',{staticClass:"fas fa-sync fa-spin "}):_vm._e()]):_vm._e()])])}
var ArticleVideovue_type_template_id_4eba1d86_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ArticleVideo.vue?vue&type=template&id=4eba1d86&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/ArticleVideo.vue?vue&type=script&lang=js&

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
/* harmony default export */ var ArticleVideovue_type_script_lang_js_ = ({
  name: "ArticleVideo",
  props: {
    article: {
      type: Object
    },
    metafields: {
      type: [Array, Object]
    },
    form_running: {
      type: Boolean
    },
    id_html: {
      type: String,
      default: "articles-lier"
    },
    articles: {
      type: Array
    },
    blogs: {
      type: Array
    }
  },
  data: function data() {
    return {
      show_save: true,
      article_video: "",
      metafield_name: "article_video"
    };
  },
  watch: {
    metafields: {
      handler: function handler() {
        this.PrepareBuildBloc();
      },
      deep: true
    }
  },
  methods: {
    remove_block: function remove_block(index) {
      this.blocks.splice(index, 1);
    },
    PrepareBuildBloc: function PrepareBuildBloc() {
      if (this.article.id) {
        this.buildBloc();
      } else {
        alert("Error: le type d'entitté n'est pas pris en compte ");
      }
    },
    buildBloc: function buildBloc() {
      this.article_video = ""; //alert("");

      var nombreMetafield = this.metafields.length;

      if (nombreMetafield) {
        for (var i in this.metafields) {
          var metafield = this.metafields[i];

          if (metafield.key === this.metafield_name) {
            this.article_video = metafield.value;
          }
        }
      }
    },

    /**
     * On tranmet les donnnées non encodes qui doivent etre encoder par le parent.
     * Cette etape ne serra plus necessaire si on utilise le type jaon_string.
     *
     */
    save_reference: function save_reference() {
      this.$emit("ev_index", {
        action: "save_metafield",
        key: this.metafield_name,
        value: this.article_video,
        type_metafield: "string",
        type: "article",
        id_entity: this.article.id,
        id_parent: this.article.blog_id
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ArticleVideo.vue?vue&type=script&lang=js&
 /* harmony default export */ var cmpts_ArticleVideovue_type_script_lang_js_ = (ArticleVideovue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/ArticleVideo.vue





/* normalize component */

var ArticleVideo_component = Object(componentNormalizer["a" /* default */])(
  cmpts_ArticleVideovue_type_script_lang_js_,
  ArticleVideovue_type_template_id_4eba1d86_render,
  ArticleVideovue_type_template_id_4eba1d86_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ArticleVideo = (ArticleVideo_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/PageArticle.vue?vue&type=script&lang=js&
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
//

/**
 * Jquery doit etre definie (simulation);
 */
if (window.jQuery) {
  var PageArticlevue_type_script_lang_js_$ = window.jQuery;
}
/**
 * moment simulation
 */


if (window.moment) {
  var moment = window.moment;
}









/* harmony default export */ var PageArticlevue_type_script_lang_js_ = ({
  name: "PageArticle",
  props: {},
  components: {
    ajax: Ajax["a" /* default */],
    "modal-slot": ModalSlot["default"]
  },
  data: function data() {
    return {
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      ajax_messages: {
        msg: "",
        type: ""
      },

      /**
       *modal
       */
      id_modal: "action-article",
      modal_title: "",
      modal_action: "",
      template_modalbody: "",

      /**
       *
       */
      table_id: "table-datas",
      articles: [],
      article_select: {},
      metafields: [],
      blogs: [],
      form_running: false,
      modal_loading: false,
      blogs_select: [],
      datatable: {},
      composant: {},
      table_loading: false
    };
  },
  mounted: function mounted() {
    this.databaseConfig = configs["a" /* default */].databaseConfig;
    this.getBlocs();
  },
  methods: {
    select_remove_blog: function select_remove_blog() {},
    filtrageEnfunctionIdBlog: function filtrageEnfunctionIdBlog(id_blog) {
      var self = this;
      /*
      console.log(
        "articles : ",
        this.articles.length,
        "\n self.blogs_select : ",
        self.blogs_select
      );
      /**/
      //this.datatable.rows().data(this.articles);

      console.log("Nombre de ligne : ", self.datatable.rows().data().length, " \n id_blog", id_blog);
      /**/

      /**
       * hide rows
       */

      /*
      self.datatable
        .rows()
        .data()
        .filter(function(value) {
          //console.log(" value : ", value);
          if (id_blog === value.blog_id) {
            console.log(
              "\n value.blog_id : ",
              value.blog_id,
              "\n value.id : ",
              value.id
            );
            this.blocks.splice(index, 1);
            this.row(value).remove();
          }
        });
      /**/
      //

      /*
      var last_array = self.datatable.rows().data();
      for (const index in last_array) {
        var article = last_array[index];
        if (article.blog_id === id_blog) {
          last_array.splice(index, 1);
        }
      }
      console.log("Last_array : ", last_array);
      self.datatable.clear();
      console.log(self.datatable.rows());
      self.datatable.row().add(last_array[0]);
      self.datatable.draw();
      /**/
    },
    getArticles: function getArticles() {
      this.table_loading = true;
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        blogs_ids: this.blogs_select
      };
      this.ajax_token = "shopify_load_all_articles";
      this.trigger_request++;
    },
    getBlocs: function getBlocs() {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig
      };
      this.ajax_token = "shopify_load_blogs_with_metafield";
      this.trigger_request++;
    },
    ev_ajax_success: function ev_ajax_success(datas) {
      console.log("ev_ajax_success : ", datas);

      switch (datas.token) {
        case "shopify_load_all_articles":
          this.articles = datas.return.articles;
          this.buildTable();
          this.table_loading = false;
          break;

        case "shopify_load_articles_metafields":
          this.modal_loading = false;
          this.metafields = datas.return.shopify_load_articles_metafields.metafields;
          break;

        case "save_metafields":
          this.form_running = false;
          this.close_modal();
          break;

        case "shopify_load_blogs_with_metafield":
          this.blogs = datas.return.shopify_load_blog.blogs;
          this.select_all_blogs();
          break;
      }
    },
    select_all_blogs: function select_all_blogs() {
      var nombreBlog = this.blogs.length;

      if (localStorage.getItem("blogs_select")) {
        this.blogs_select = JSON.parse(localStorage.getItem("blogs_select"));
      } //
      else if (!this.blogs_select.length) {
          for (var i in this.blogs) {
            this.blogs_select.push(this.blogs[i].id);
            var ii = parseInt(i) + 1;

            if (nombreBlog === ii) {//this.getArticles();
            }
          }
        } else {//this.getArticles();
          }
    },
    ev_ajax_error: function ev_ajax_error() {},
    buildTable: function buildTable() {
      var self = this;

      if (this.datatable.rows) {
        this.datatable.destroy();
        PageArticlevue_type_script_lang_js_$("#" + this.table_id).empty();
      }

      this.datatable = PageArticlevue_type_script_lang_js_$("#" + this.table_id).DataTable({
        data: this.articles,
        //info: false,
        order: [[0, "desc"]],
        lengthMenu: [[10, 30, 60, 100], [10, 30, 60, 100]],
        pageLength: 10,
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
          className: "created-at",
          dateFormat: "MM-dd-YYYY"
        }, {
          className: "details-control",
          orderable: false,
          data: null,
          title: "Action",
          defaultContent: "<select class=\" form-control select-action\">\n                <option value=\"\" selected> Aucun(e)</option>\n                <option value=\"ref_blocks\">References blocks</option>\n                <option value=\"type_livre\">Type Livre</option>\n                <option value=\"articles_lier\">Articles li\xE9s</option>\n                <option value=\"ingredients\">Ingredients</option>\n                <option value=\"position_image\">Position image</option>\n                <option value=\"article_video\">Video</option>\n                </select>"
        }],
        rowCallback: function rowCallback(row, data) {
          //console.log("row : ", row, "\n data : ", data, "\n index", index);
          // on affiche pas les articles donc l'id du blog n'est pas present dans blogs_select
          PageArticlevue_type_script_lang_js_$(row).addClass("bg-" + self.getBlogHandle(data.blog_id));
        },
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/French.json"
        }
        /*
        columnDefs: [
          {
            targets: 2,
            render: $.fn.dataTable.render.moment("M")
          }
        ]
        /**/

      });
      var table = this.datatable;
      PageArticlevue_type_script_lang_js_$("#" + this.table_id).addClass("light-table table");
      PageArticlevue_type_script_lang_js_$("#" + this.table_id + " thead").addClass("thead-light table-header");
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

      PageArticlevue_type_script_lang_js_$("#" + this.table_id + " tbody").on("click", "tr .select-action", function () {
        var action = PageArticlevue_type_script_lang_js_$(this).val();
        var tr = PageArticlevue_type_script_lang_js_$(this).parent().parent();

        if (action !== "") {
          self.article_select = table.row(tr).data(); //console.log(self.article_select);

          self.open_modal(self.article_select, action);
        }
      });
    },
    getBlogHandle: function getBlogHandle(blog_id) {
      var handle = "error";

      for (var i in this.blogs) {
        if (blog_id == this.blogs[i].id) {
          handle = this.blogs[i].handle;
          break;
        }
      }

      return handle;
    },
    getBlog: function getBlog(blog_id) {
      var blog = [];

      for (var i in this.blogs) {
        if (blog_id == this.blogs[i].id) {
          blog = this.blogs[i];
          break;
        }
      }

      return blog;
    },
    open_modal: function open_modal(data, action) {
      var self = this;
      self.modal_title = data.title;
      self.modal_action = action;
      self.select_template();
      PageArticlevue_type_script_lang_js_$("#" + self.formated_id_modal).modal("show");
      PageArticlevue_type_script_lang_js_$("#" + self.formated_id_modal).on("shown.bs.modal", function () {
        PageArticlevue_type_script_lang_js_$("#" + self.formated_id_modal).off("shown.bs.modal");
        self.loadMetafield();
      });
    },
    close_modal: function close_modal() {
      var self = this;
      PageArticlevue_type_script_lang_js_$("#" + self.formated_id_modal).modal("hide");
    },
    loadMetafield: function loadMetafield() {
      this.modal_loading = true;
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        id_blog: this.article_select.blog_id,
        id_article: this.article_select.id
      };
      this.ajax_token = "shopify_load_articles_metafields";
      this.trigger_request++;
    },
    saveMetaField: function saveMetaField(type, key, type_metafield, id_entity, value) {
      var id_parent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      this.show_alert_msg = true;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        metafields: {
          type_metafield: type_metafield,
          id_entity: id_entity,
          type: type,
          key: key,
          value: value,
          id_parent: id_parent
        }
      };
      this.ajax_token = "save_metafields";
      this.trigger_request++;
    },
    select_template: function select_template() {
      switch (this.modal_action) {
        case "ref_blocks":
          this.template_modalbody = ReferenceBlock;
          break;

        case "type_livre":
          this.template_modalbody = TypeLivreV2;
          break;

        case "articles_lier":
          this.template_modalbody = ArticlesLier;
          break;

        case "position_image":
          this.template_modalbody = PositionImage;
          break;

        case "article_video":
          this.template_modalbody = ArticleVideo;
          break;

        default:
          this.template_modalbody = "";
          break;
      }

      this.applyConfigsComponent();
    },
    applyConfigsComponent: function applyConfigsComponent() {
      var self = this;
      setTimeout(function () {
        self.composant = self.$refs.composant;

        switch (self.modal_action) {
          case "articles_lier":
            self.composant.set_value(self.blogs_select);
            break;
        }
      }, 150);
    },
    save_reference: function save_reference() {},
    add_new_block: function add_new_block() {},
    ev_index: function ev_index(datas) {
      switch (datas.action) {
        case "save_metafield":
          this.form_running = true;
          this.saveMetaField(datas.type, datas.key, datas.type_metafield, datas.id_entity, datas.value, datas.id_parent);
          break;

        case "update_select_blog":
          this.blogs_select = datas.blogs_select;
          break;
      }
    }
  },
  computed: {
    formated_id_modal: {
      get: function get() {
        return "model-style-" + this.id_modal;
      }
    }
  },
  watch: {
    blogs_select: {
      handler: function handler(val) {
        console.log("Blogs_select : ", val);
        localStorage.setItem("blogs_select", JSON.stringify(val));
        this.getArticles();
      },
      deep: true
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/PageArticle.vue?vue&type=script&lang=js&
 /* harmony default export */ var NutribeShopify_PageArticlevue_type_script_lang_js_ = (PageArticlevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/App/NutribeShopify/PageArticle.vue?vue&type=style&index=0&lang=scss&
var PageArticlevue_type_style_index_0_lang_scss_ = __webpack_require__("c689");

// CONCATENATED MODULE: ./src/components/App/NutribeShopify/PageArticle.vue






/* normalize component */

var PageArticle_component = Object(componentNormalizer["a" /* default */])(
  NutribeShopify_PageArticlevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var PageArticle = __webpack_exports__["default"] = (PageArticle_component.exports);

/***/ }),

/***/ "44d2":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");
var create = __webpack_require__("7c73");
var definePropertyModule = __webpack_require__("9bf2");

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "44e7":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");
var classof = __webpack_require__("c6b6");
var wellKnownSymbol = __webpack_require__("b622");

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),

/***/ "4969":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "5319":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
var anObject = __webpack_require__("825a");
var toObject = __webpack_require__("7b0b");
var toLength = __webpack_require__("50c4");
var toInteger = __webpack_require__("a691");
var requireObjectCoercible = __webpack_require__("1d80");
var advanceStringIndex = __webpack_require__("8aa5");
var regExpExec = __webpack_require__("14c3");

var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "5a34":
/***/ (function(module, exports, __webpack_require__) {

var isRegExp = __webpack_require__("44e7");

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),

/***/ "6547":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("a691");
var requireObjectCoercible = __webpack_require__("1d80");

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "712d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalSlot_vue_vue_type_style_index_0_id_014b11f9_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9430");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalSlot_vue_vue_type_style_index_0_id_014b11f9_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalSlot_vue_vue_type_style_index_0_id_014b11f9_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalSlot_vue_vue_type_style_index_0_id_014b11f9_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "8aa5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__("6547").charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ "9263":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpFlags = __webpack_require__("ad6d");
var stickyHelpers = __webpack_require__("9f7f");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "9430":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "9f7f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__("d039");

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

exports.UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});


/***/ }),

/***/ "a15b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var IndexedObject = __webpack_require__("44ad");
var toIndexedObject = __webpack_require__("fc6a");
var arrayMethodIsStrict = __webpack_require__("a640");

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),

/***/ "a434":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var toAbsoluteIndex = __webpack_require__("23cb");
var toInteger = __webpack_require__("a691");
var toLength = __webpack_require__("50c4");
var toObject = __webpack_require__("7b0b");
var arraySpeciesCreate = __webpack_require__("65f0");
var createProperty = __webpack_require__("8418");
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
var USES_TO_LENGTH = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),

/***/ "ab13":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};


/***/ }),

/***/ "ac1f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var exec = __webpack_require__("9263");

$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ "ad6d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__("825a");

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "c689":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PageArticle_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4969");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PageArticle_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PageArticle_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PageArticle_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "c6de":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Modals/ModalSlot.vue?vue&type=template&id=014b11f9&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{class:[
      _vm.type_modal_bootstrap
        ? 'modal fade'
        : 'modal-custom ' + _vm.formated_open_modal_custom
    ],attrs:{"id":_vm.id_modal,"role":"dialog","aria-labelledby":_vm.id_modal + 'Label',"aria-hidden":"true"}},[_c('div',{staticClass:"modal-dialog modal-lg",class:_vm.modal_position,attrs:{"role":"document"}},[_c('div',{staticClass:"modal-content"},[_c('div',{staticClass:"modal-header"},[_vm._t("modal_header",[_vm._v(" Titre modal ")],{"id":_vm.id_modal + 'Label'}),_c('button',{staticClass:"close",attrs:{"type":"button","aria-label":"Close"},on:{"click":_vm.close_and_false}},[_c('span',{attrs:{"aria-hidden":"true"}},[_vm._v("×")])])],2),_c('div',{staticClass:"modal-body"},[_vm._t("default",null,{"id":_vm.id_modal + 'Label',"doaction":_vm.actionparent,"is_runing":_vm.is_runing})],2),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.show_footer),expression:"show_footer"}],staticClass:"modal-footer "},[_vm._t("modal_footer",null,{"doaction":_vm.actionparent,"is_runing":_vm.is_runing})],2)])])])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Modals/ModalSlot.vue?vue&type=template&id=014b11f9&scoped=true&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js
var es_number_constructor = __webpack_require__("a9e3");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Modals/ModalSlot.vue?vue&type=script&lang=js&

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
 * Jquery doit etre definie;
 */
var $;

if (window.jQuery) {
  $ = window.jQuery;
} else if (window.$) {
  $ = window.$;
}

/* harmony default export */ var ModalSlotvue_type_script_lang_js_ = ({
  name: "ModalSimple",
  props: {
    datas_modal_body: [Object, Array, String, Number],
    id_modal: {
      type: String,
      default: "myModal"
    },
    type_modal_bootstrap: {
      type: Boolean,
      default: true
    },
    modal_position: {
      type: String,
      default: "modal-dialog-centered"
    },
    open_modal_custom: {
      type: Boolean,
      default: false
    },
    show_footer: {
      type: Boolean,
      default: true
    },
    actionparent: [Object, Array, String, Number],
    is_runing: {
      type: [Boolean],
      default: false
    }
  },
  data: function data() {
    return {
      modal_custom_class: ""
    };
  },
  computed: {
    titre_modal: {
      get: function get() {
        return decodeURIComponent(this.titre_modal_preview);
      }
    },
    formated_open_modal_custom: {
      get: function get() {
        if (this.open_modal_custom) {
          return "show-custom-modal";
        }

        return "";
      }
    }
  },
  methods: {
    ev_modal_simple: function ev_modal_simple(datas) {
      this.$emit("ev_modal_simple", datas);
    },
    ev_modal_simple_footer: function ev_modal_simple_footer(datas) {
      this.$emit("ev_modal_simple_footer", datas);
    },
    close_and_false: function close_and_false() {
      if (this.type_modal_bootstrap) {
        $("#" + this.id_modal).modal("hide");
      } else {
        /**
         * il fzut emettre un evenement pour informer le parent que le bloc doit etre fermer
         */
        this.$emit("ev_modal_simple", {
          action: "close"
        });
      }
    },
    close_modal_confirm: function close_modal_confirm() {
      alert("");
    }
  }
});
// CONCATENATED MODULE: ./src/components/Modals/ModalSlot.vue?vue&type=script&lang=js&
 /* harmony default export */ var Modals_ModalSlotvue_type_script_lang_js_ = (ModalSlotvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/Modals/ModalSlot.vue?vue&type=style&index=0&id=014b11f9&lang=scss&scoped=true&
var ModalSlotvue_type_style_index_0_id_014b11f9_lang_scss_scoped_true_ = __webpack_require__("712d");

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/Modals/ModalSlot.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Modals_ModalSlotvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "014b11f9",
  null
  
)

/* harmony default export */ var ModalSlot = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "caad":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $includes = __webpack_require__("4d64").includes;
var addToUnscopables = __webpack_require__("44d2");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: !USES_TO_LENGTH }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ "d784":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__("ac1f");
var redefine = __webpack_require__("6eeb");
var fails = __webpack_require__("d039");
var wellKnownSymbol = __webpack_require__("b622");
var regexpExec = __webpack_require__("9263");
var createNonEnumerableProperty = __webpack_require__("9112");

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};


/***/ })

}]);
//# sourceMappingURL=NutribeShopify.umd.1.js.map