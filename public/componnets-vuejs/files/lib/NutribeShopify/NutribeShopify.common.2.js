((typeof self !== 'undefined' ? self : this)["webpackJsonpNutribeShopify"] = (typeof self !== 'undefined' ? self : this)["webpackJsonpNutribeShopify"] || []).push([[2],{

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

/***/ "7ed1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ModelBlocks/Files/ImageShopify.vue?vue&type=template&id=29217290&scoped=true&lang=html&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"form-group",class:[_vm.image.ShowCover ? 'bg-cover' : '']},[_c('div',{staticClass:"row"},[(_vm.image.url === '')?_c('div',{staticClass:"col-sm-7"},[_c('b-form-group',{attrs:{"label":"Image"}},[_c('b-form-file',{attrs:{"accept":"image/*","placeholder":"Choose a file or drop it here...","drop-placeholder":"Drop file here..."},on:{"change":_vm.previewAndSaveImage}})],1)],1):_vm._e(),_c('div',{staticClass:"col-sm-4"},[(_vm.image.url)?_c('div',[_c('img',{staticClass:"img-fuild",staticStyle:{"max-width":"140px","max-height":"100px"},attrs:{"alt":"","src":_vm.image.url}})]):_vm._e()]),(_vm.image.url !== '')?_c('div',{staticClass:"col-sm-7"},[_c('ButtonDelete',{attrs:{"running":_vm.running},on:{"ev-click":function($event){return _vm.$emit('ev-delete-file', _vm.image.key)}}})],1):_vm._e()]),_c('h4',{staticClass:"text-wait"},[_vm._v("Patientez ...")])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/ModelBlocks/Files/ImageShopify.vue?vue&type=template&id=29217290&scoped=true&lang=html&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__("b0c0");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("d3b7");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.js
var es_promise = __webpack_require__("e6cf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__("ac1f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.split.js
var es_string_split = __webpack_require__("1276");

// EXTERNAL MODULE: /siteweb/PluginsModules/AppVueJS/wbuutilities/index.js + 12 modules
var wbuutilities = __webpack_require__("7261");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ModelBlocks/Files/ImageShopify.vue?vue&type=script&lang=js&





//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ImageShopifyvue_type_script_lang_js_ = ({
  name: "ImageShopify",
  props: {
    image: {
      type: Object,
      required: true,
      validator: function validator(val) {
        if ((val.url || val.url == "") && (val.alt || val.alt == "") && ( //(val.ShowCover || val.ShowCover == "") &&
        val.key || val.key == "") && (val.filename || val.filename == "")) return true;
        return false;
      },
      default: function _default() {
        return {
          url: "",
          alt: "",
          title: "",
          filename: "",
          key: "",
          ShowCover: false
        };
      }
    }
  },
  components: {
    ButtonDelete: wbuutilities["b" /* ButtonDelete */]
  },
  data: function data() {
    return {
      running: false
    };
  },
  mounted: function mounted() {//
  },
  watch: {//
  },
  computed: {//
  },
  methods: {
    /**
     * Convertie l'image en base 64 et le return au parent.
     */
    previewAndSaveImage: function previewAndSaveImage(event) {
      var self = this;

      if (event.target.files && event.target.files[0]) {
        self.getBase64(event.target.files[0]).then(function (ConvertResult) {
          self.$emit("image-save", ConvertResult);
        });
      }
    },
    getBase64: function getBase64(file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file); // reader.onload = () => resolve(reader.result);

        reader.onloadend = function () {
          var fileArray = reader.result.split(",");
          resolve({
            src: reader.result,
            base64: fileArray[1],
            name: file.name
          });
        };

        reader.onerror = function (error) {
          return reject(error);
        };
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/ModelBlocks/Files/ImageShopify.vue?vue&type=script&lang=js&
 /* harmony default export */ var Files_ImageShopifyvue_type_script_lang_js_ = (ImageShopifyvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/ModelBlocks/Files/ImageShopify.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Files_ImageShopifyvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "29217290",
  null
  
)

/* harmony default export */ var ImageShopify = __webpack_exports__["a"] = (component.exports);

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

/***/ "c975":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $indexOf = __webpack_require__("4d64").indexOf;
var arrayMethodIsStrict = __webpack_require__("a640");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "c9a4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/GestionSaveurs.vue?vue&type=template&id=13387180&scoped=true&lang=html&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"d-flex text-center text-white mb-4"},[_c('div',{staticClass:"w-50 p-3 border click-pointer",class:{
        'bg-secondary': _vm.current_tab != 'manage_block',
        'bg-primary': _vm.current_tab == 'manage_block'
      },on:{"click":function($event){return _vm.select_curent_tabs('manage_block')}}},[_vm._v(" Gerer les saveurs "),(_vm.loading_blocs)?_c('i',{staticClass:"fas fa-sync fa-spin "}):_vm._e()]),_c('div',{staticClass:"w-50 p-3 border click-pointer",class:{
        'bg-secondary': _vm.current_tab != 'associate_variants',
        'bg-primary': _vm.current_tab == 'associate_variants'
      },on:{"click":function($event){return _vm.select_curent_tabs('associate_variants')}}},[_vm._v(" Associer les ingredients à la saveur "),(_vm.loading_association)?_c('i',{staticClass:"fas fa-sync fa-spin "}):_vm._e()])]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.current_tab == 'associate_variants'),expression:"current_tab == 'associate_variants'"}]},[_c('menus-buttons',{attrs:{"group_buttons":_vm.menus},on:{"ev-menu-button":_vm.evMenuButton}}),_c('b-form-group',{attrs:{"label":"Selectionner le block d'ingredient"}},[_c('b-form-select',{attrs:{"options":_vm.section_ingredientsOptions},on:{"change":_vm.AddIngredient},model:{value:(_vm.selected_option),callback:function ($$v) {_vm.selected_option=$$v},expression:"selected_option"}})],1),_c('div',_vm._l((_vm.listSelectedIngredients),function(listSelectedIngredient,ii){return _c('div',{key:ii,staticClass:"d-flex align-items-center drap-drop-box pl-3"},[_c('div',{staticClass:"w-100"},[_c('b-form-group',{attrs:{"label":"reference du block ingredient"}},[_c('b-form-input',{attrs:{"placeholder":"Nom de la serveur","readonly":""},model:{value:(listSelectedIngredient.text),callback:function ($$v) {_vm.$set(listSelectedIngredient, "text", $$v)},expression:"listSelectedIngredient.text"}})],1)],1),_c('div',{staticClass:"pl-3"},[_c('b-button',{staticClass:"border-0",attrs:{"size":"sm","variant":"outline-danger"},on:{"click":function($event){return _vm.DeleteAssociateIngredient(
                listSelectedIngredient.index_saveur,
                listSelectedIngredient.value
              )}}},[_c('b-icon',{attrs:{"icon":"trash"}})],1)],1)])}),0)],1),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.current_tab == 'manage_block'),expression:"current_tab == 'manage_block'"}]},[_c('b-form-group',{attrs:{"label":"Selectionner la saveur"}},[_c('b-form-select',{attrs:{"options":_vm.variantsOptions1},on:{"change":_vm.AddSaveur},model:{value:(_vm.selected_option),callback:function ($$v) {_vm.selected_option=$$v},expression:"selected_option"}})],1),_c('b-form',_vm._l((_vm.saveurs),function(saveur,i){return _c('div',{key:i,staticClass:"drap-drop-box pl-3"},[_c('div',{staticClass:"d-flex align-items-center"},[_c('div',{staticClass:"w-100"},[_c('b-form-group',{attrs:{"label":"Nom de la sarveur"}},[_c('b-form-input',{attrs:{"placeholder":"Nom de la serveur","readonly":""},model:{value:(saveur.id),callback:function ($$v) {_vm.$set(saveur, "id", $$v)},expression:"saveur.id"}})],1),_c('b-form-group',{staticClass:"d-none",attrs:{"label":"Image de la saveur","description":"l'image doit etre un texte svg"}},[_c('b-form-textarea',{attrs:{"placeholder":"votre texte svg ici","rows":"3","max-rows":"6"},model:{value:(saveur.content),callback:function ($$v) {_vm.$set(saveur, "content", $$v)},expression:"saveur.content"}})],1),_c('image-shopify',{attrs:{"image":saveur.image},on:{"image-save":function($event){return _vm.ImageSave.apply(void 0, [ saveur.image ].concat( $event ))},"ev-delete-file":function($event){return _vm.DeleteFile.apply(void 0, [ saveur.image ].concat( $event ))}}})],1),_c('div',{staticClass:"p-3"},[_c('b-button',{staticClass:"border-0",attrs:{"size":"sm","variant":"outline-danger"},on:{"click":function($event){return _vm.DeleteSaveur(i)}}},[_c('b-icon',{attrs:{"icon":"trash"}})],1)],1)])])}),0)],1),_c('hr'),_c('div',{staticClass:"d-flex justify-content-between"},[_c('ButtonSave',{attrs:{"running":_vm.running},on:{"ev-click":_vm.onSubmit}})],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/GestionSaveurs.vue?vue&type=template&id=13387180&scoped=true&lang=html&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.for-each.js
var es_array_for_each = __webpack_require__("4160");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__("caad");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.index-of.js
var es_array_index_of = __webpack_require__("c975");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.splice.js
var es_array_splice = __webpack_require__("a434");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__("b0c0");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.includes.js
var es_string_includes = __webpack_require__("2532");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__("159b");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"d6facc0e-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Menus/MenusButtonsV2.vue?vue&type=template&id=162c091a&
var MenusButtonsV2vue_type_template_id_162c091a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"d-flex text-center text-white mb-4"},_vm._l((_vm.group_buttons),function(button,index){return _c('div',{key:index,class:{
        'w-100': _vm.v_100
      },attrs:{"data-index":index}},[_c('span',{staticClass:" px-3 py-2 border click-pointer d-block",class:{
          'bg-secondary': _vm.current_onglet !== button.id,
          'bg-primary': _vm.current_onglet === button.id
        },domProps:{"innerHTML":_vm._s(button.value)},on:{"click":function($event){return _vm.select_curent_onglet(button, index)}}})])}),0)])}
var MenusButtonsV2vue_type_template_id_162c091a_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Menus/MenusButtonsV2.vue?vue&type=template&id=162c091a&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js + 1 modules
var objectSpread2 = __webpack_require__("5530");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Menus/MenusButtonsV2.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MenusButtonsV2vue_type_script_lang_js_ = ({
  name: "MenusButtons",
  props: {
    group_buttons: {
      type: Array,
      validator: function validator(menus) {
        if (!menus.length) {
          return true;
        } else {
          return true;
        }
      }
    },
    // pour que les bouton occupe tout l'espace disponible.
    v_100: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      current_onglet: ""
    };
  },
  watch: {
    group_buttons: {
      deep: true,
      handler: function handler(val) {
        if (val[0]) {
          this.select_curent_onglet(val[0], 0);
        }
      }
    }
  },
  computed: {//
  },
  mounted: function mounted() {//console.log("load MenusButtons V2");
  },
  methods: {
    select_curent_onglet: function select_curent_onglet(button, index) {
      this.current_onglet = button.id;
      this.$emit("ev-menu-button", Object(objectSpread2["a" /* default */])({
        index: index
      }, button));
    }
  }
});
// CONCATENATED MODULE: ./src/components/Menus/MenusButtonsV2.vue?vue&type=script&lang=js&
 /* harmony default export */ var Menus_MenusButtonsV2vue_type_script_lang_js_ = (MenusButtonsV2vue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/Menus/MenusButtonsV2.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Menus_MenusButtonsV2vue_type_script_lang_js_,
  MenusButtonsV2vue_type_template_id_162c091a_render,
  MenusButtonsV2vue_type_template_id_162c091a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var MenusButtonsV2 = (component.exports);
// EXTERNAL MODULE: /siteweb/PluginsModules/AppVueJS/wbuutilities/index.js + 12 modules
var wbuutilities = __webpack_require__("7261");

// EXTERNAL MODULE: ./src/components/App/NutribeShopify/configs.js
var configs = __webpack_require__("cc84");

// EXTERNAL MODULE: ./src/components/ModelBlocks/Files/ImageShopify.vue + 4 modules
var ImageShopify = __webpack_require__("7ed1");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/App/NutribeShopify/cmpts/GestionSaveurs.vue?vue&type=script&lang=js&







//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





function DefaultVariation() {
  return {
    id: "",
    //la valeur de l'option au niveau dela variante du produit option1
    content: "",
    // text svg
    image: {
      url: "",
      alt: "",
      ShowCover: false,
      filename: "",
      key: ""
    },
    blocks: [] // les id du blocs de la sections ingrestients.(metafields du produit)

  };
}

/* harmony default export */ var GestionSaveursvue_type_script_lang_js_ = ({
  name: "GestionSaveurs",
  props: {
    entity: {
      type: Object,
      required: true
    },
    typeEntity: {
      type: String,
      required: true,
      validator: function validator(val) {
        return val === "product" ? true : false;
      }
    }
  },
  components: {
    "menus-buttons": MenusButtonsV2,
    ButtonSave: wbuutilities["c" /* ButtonSave */],
    "image-shopify": ImageShopify["a" /* default */]
  },
  data: function data() {
    var keyMetafield = "saveurs";
    return {
      loading_blocs: false,
      loading_association: false,
      current_tab: "manage_block",
      saveurs: [],
      selected_option: "",
      section_ingredients: {},
      SelectedIndredientMenu: {},
      //listSelectedIngredients: [],
      keyMetafield: keyMetafield,
      running: false
    };
  },
  mounted: function mounted() {
    this.GetProductMetafield();
  },
  watch: {//
  },
  computed: {
    variantsOptions1: function variantsOptions1() {
      var options1 = []; //pour eviter les doublons.

      var checkOptions1 = {};

      if (this.entity.variants) {
        for (var i in this.entity.variants) {
          var variant = this.entity.variants[i];

          if (!this.VariantHasSelected(variant.option1) && !checkOptions1[variant.option1]) {
            checkOptions1[variant.option1] = true;
            options1.push({
              text: variant.option1,
              value: variant.option1
            });
          }
        }
      }

      return options1;
    },
    menus: function menus() {
      var menus = [];

      if (this.saveurs.length) {
        for (var i in this.saveurs) {
          var saveur = this.saveurs[i];
          menus.push({
            id: saveur.id,
            value: saveur.id
          });
        }
      }

      return menus;
    },
    section_ingredientsOptions: function section_ingredientsOptions() {
      var options = [];

      if (this.section_ingredients) {
        for (var i in this.section_ingredients) {
          var ingredient = this.section_ingredients[i];
          if (!this.IngredientHasSelected(i)) options.push({
            text: i + " : " + ingredient.titrefp,
            value: i
          });
        }
      }

      return options;
    },
    listSelectedIngredients: function listSelectedIngredients() {
      var _this = this;

      var options = [];

      if (this.saveurs.length) {
        var _loop = function _loop(i) {
          var saveur = _this.saveurs[i];

          if (saveur.id === _this.SelectedIndredientMenu.id) {
            saveur.blocks.forEach(function (blockId) {
              var ingredient = _this.section_ingredients[blockId];
              if (ingredient) options.push({
                text: blockId + " : " + ingredient.titrefp,
                value: blockId,
                index_saveur: parseInt(i)
              });
            });
          }
        };

        for (var i in this.saveurs) {
          _loop(i);
        }
      }

      return options;
    }
  },
  methods: {
    evMenuButton: function evMenuButton(menu) {
      this.SelectedIndredientMenu = menu; //this.AddIngredient();
    },
    AddSaveur: function AddSaveur(option1) {
      var saveur = DefaultVariation();
      saveur.id = option1;
      this.saveurs.push(saveur);
    },

    /**
     * permet d'afficher la liste des ingredients selectionner et ajoute un block si ce dernier est definit.
     */
    AddIngredient: function AddIngredient() {
      var BlockId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      for (var i in this.saveurs) {
        var saveur = this.saveurs[i];

        if (saveur.id === this.SelectedIndredientMenu.id) {
          if (BlockId) this.saveurs[i].blocks.push(BlockId);
          /**
          this.buildListSelectedIngredients(
            this.saveurs[i].blocks,
            parseInt(i)
          );
          /**/

          return;
        }
      }
    },
    buildListSelectedIngredients: function buildListSelectedIngredients(blocks, index_saveur) {
      var _this2 = this;

      this.listSelectedIngredients = [];
      blocks.forEach(function (blockId) {
        if (_this2.section_ingredients[blockId]) {
          var ingredient = _this2.section_ingredients[blockId];

          _this2.listSelectedIngredients.push({
            text: blockId + " : " + ingredient.titrefp,
            value: blockId,
            index_saveur: index_saveur
          });
        }
      });
    },
    select_curent_tabs: function select_curent_tabs(current_tab) {
      this.current_tab = current_tab;
    },

    /**
     * @return true si la valeur est deja selectionné.
     */
    IngredientHasSelected: function IngredientHasSelected(blockId) {
      for (var i in this.saveurs) {
        var ingredient = this.saveurs[i].blocks;

        if (ingredient.includes(blockId)) {
          return true;
        }

        var ii = parseInt(i) + i;

        if (ii == this.saveurs.length) {
          return false;
        }
      }
    },

    /**
     * @return true si la valeur est deja selectionné.
     */
    VariantHasSelected: function VariantHasSelected(option1) {
      if (!this.saveurs.length) {
        return false;
      }

      for (var i in this.saveurs) {
        var saveur = this.saveurs[i];

        if (saveur.id === option1) {
          return true;
        }

        var ii = parseInt(i) + 1;

        if (this.saveurs.length === ii) {
          return false;
        }
      }
    },
    onSubmit: function onSubmit() {
      var _this3 = this;

      this.running = true;
      configs["a" /* default */].SaveMetaFieldProduct(this.saveurs, this.keyMetafield, this.entity.id).then(function () {
        _this3.running = false;
      });
    },
    GetProductMetafield: function GetProductMetafield() {
      var _this4 = this;

      if (this.entity.id) configs["a" /* default */].GetProductMetafield(this.entity.id).then(function (reponse) {
        for (var i in reponse) {
          var metafield = reponse[i];

          switch (metafield.key) {
            case "section_ingredients":
              if (metafield.value !== "") {
                _this4.section_ingredients = JSON.parse(metafield.value);
              }

              break;

            case "saveurs":
              if (metafield.value !== "") {
                _this4.saveurs = JSON.parse(metafield.value);
              }

              break;
          }
        }
      });
    },
    DeleteSaveur: function DeleteSaveur(i) {
      if (this.saveurs[i]) this.saveurs.splice(i, 1);
    },
    DeleteAssociateIngredient: function DeleteAssociateIngredient(i, blockId) {
      console.log("DeleteAssociateIngredient : ", i, "   ", blockId);

      if (this.saveurs[i]) {
        var ii = this.saveurs[i].blocks.indexOf(blockId);
        if (ii !== undefined) this.saveurs[i].blocks.splice(ii, 1);
      }
    },
    ImageSave: function ImageSave(image, ev) {
      image.ShowCover = true;
      configs["a" /* default */].SaveImage(ev).then(function (reponse) {
        image.ShowCover = false;

        if (reponse && reponse.key) {
          image.key = reponse.key;
          image.url = reponse.public_url;
          image.filename = ev.name;
        }
      });
    },
    DeleteFile: function DeleteFile(image, ev) {
      image.ShowCover = true;
      configs["a" /* default */].DeleteFile(ev).then(function (reponse) {
        image.ShowCover = false;

        if (reponse) {
          image.key = "";
          image.url = "";
          image.filename = "";
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/GestionSaveurs.vue?vue&type=script&lang=js&
 /* harmony default export */ var cmpts_GestionSaveursvue_type_script_lang_js_ = (GestionSaveursvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/App/NutribeShopify/cmpts/GestionSaveurs.vue





/* normalize component */

var GestionSaveurs_component = Object(componentNormalizer["a" /* default */])(
  cmpts_GestionSaveursvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "13387180",
  null
  
)

/* harmony default export */ var GestionSaveurs = __webpack_exports__["default"] = (GestionSaveurs_component.exports);

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
//# sourceMappingURL=NutribeShopify.common.2.js.map