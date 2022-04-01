jQuery(document).ready(function ($) {
  //
  Vue.filter("numberFrench", function (nombre) {
    if (!nombre) return "";
    return new Intl.NumberFormat("fr-FR").format(nombre);
  });

  // Tableau-gestion **************************************************
  var props_tableau = {
    rows: [Object, Array],
    headers: [Object, Array],
    footers: [Object, Array],
    show_header: {
      type: Boolean,
      default: true,
    },
    show_footer: {
      type: Boolean,
      default: true,
    },
    show_action: {
      type: Boolean,
      default: false,
    },
    table_footer_actif: {
      type: Boolean,
      default: false,
    },
    waitingload: {
      type: Boolean,
      default: false,
    },
    show_title: {
      type: Boolean,
      default: false,
    },
    show_reel_index: {
      type: Boolean,
      default: true,
    },
    table_title: {
      type: String,
      default: "",
    },
    template_footer: {
      type: String,
      default: "",
    },
    align_header: {
      type: Boolean,
      default: false,
    },
    empty_message: {
      type: String,
      default: "Aucun contenu disponible",
    },
    model: [Object, Array],
    fields: [Object, Array],
    field: [Object, Array],
    show_id: {
      type: Boolean,
      default: true,
    },
    action: {
      type: [Object, Array],
      default: function () {
        return {
          update: false,
          delete: false,
          move: false,
          drap: false,
        };
      },
    },
  };

  /**
   *
   */
  Vue.component("tableau_gestion", {
    delimiters: ["${", "}"],
    props: props_tableau,
    template: "#tableau-template-gestion",
    data: function () {
      return {
        arrayStructure: {
          type: "",
        },
        aleatoirevalue: Math.floor(Math.random() * 99),
        key: 0,
      };
    },
    methods: {
      move: function (index) {
        console.log("move : " + index);
        // this.$emit('ev_move', {'index':index, lignes:this.rows});
      },
      modifier: function (index) {
        console.log("modifier : " + index);
        id = "dp" + index + "-" + this.aleatoirevalue;
        console.log(id);
        $("#" + id).toggleClass(" open ");
      },
      supprimer: function (index) {
        console.log("supprimer : " + index);
        this.$emit("ev_delete", index);
      },
      move_to_top: function (index) {
        console.log("move_to_top : " + index);
        this.$emit("ev_restore", index);
      },
      numberlevel: function () {
        if (this.rows && this.rows != {}) {
          var firstvalue = this.rows;
          firstvalue = firstvalue[Object.keys(firstvalue)[0]];
          // console.log('firstvalue');
          // console.log(firstvalue);
          if (typeof firstvalue === "string" || firstvalue instanceof String) {
            this.arrayStructure.type = "string";
            return "string";
          }
          this.arrayStructure.type = "object";
          return "array";
        }
      },
      select_and_close: function (index) {
        if (this.arrayStructure.type == "string") {
          this.model[this.field.model].target_ids = index;
          this.model[this.field.model].label_node = this.rows[index];
          // close modal
          $("#modal-" + this.field.model).modal("hide");
        }
      },
      savedatas: function () {
        console.log(" execute savedatas : tableau_gestion");
        this.$emit("ev_savedatas", this.rows);
      },
      dropdowncustom: function (index) {
        return "dp" + index + "-" + this.aleatoirevalue;
      },
      close_dropdown: function (params) {
        console.log(params);
        $("#dp" + params + "-" + this.aleatoirevalue).removeClass("open");
      },
      renderHeader: function (index) {
        // console.log('col header');
        // console.log(index);
        if (index instanceof Array || index instanceof Object) {
          return index.label;
        }
        return index;
      },
      renderIndex: function (index) {
        if (this.show_reel_index) {
          return index;
        }
        console.log(this.key);
        // this.key=this.key + 1;
        return this.key;
      },
      buildClass_TR: function (row) {
        var self = this;
        var classe = "";
        // console.log(' buildClass : ');
        // console.log(this.headers);
        $.each(this.headers, function (i, f) {
          // console.log('index : '+i);
          if (f.addclass_tr) {
            classe += f.addclass_tr.before ? f.addclass_tr.before : "";
            classe += row[i] ? row[i] : "";
            classe += f.addclass_tr.after ? f.addclass_tr.after : "";
            classe += " ";
            if (f.addclass_tr.custom) {
              classe += " " + f.addclass_tr.custom + " ";
            }
          }
        });
        // console.log(row);
        return classe;
      },
      buildClass_TD: function (index, header = false, colonne = []) {
        var self = this;
        var classe = "";
        if (header) {
          // console.log(this.headers[index]);
          if (this.headers[index].addclass_td) {
            // classe
            // +=(this.headers[index].addclass_td.before)?this.headers[index].addclass_td.before
            // : ' ';
            if (
              this.headers[index].addclass_td.before &&
              this.headers[index].addclass_td.before != "" &&
              colonne[index]
            ) {
              classe +=
                this.headers[index].addclass_td.before + "" + colonne[index];
              classe += " ";
            }
            // classe += ( this.headers[index].addclass_td.after )?
            // this.headers[index].addclass_td.after : '';

            if (this.headers[index].addclass_td.custom) {
              classe += this.headers[index].addclass_td.custom + " ";
            }
            if (this.headers[index].addclass_td.tbody && colonne[index]) {
              classe += this.headers[index].addclass_td.tbody + " ";
            }
          }
        }
        return classe;
      },
      footers_build: function () {
        // console.log('build footers');
        var self = this;
        console.log(self.footers);
        var colSpan = 1,
          empty = 1,
          new_footers = {};
        $.each(self.headers, function (i, f) {
          console.log(i);
          if (self.footers[i]) {
            colSpan = 0;
            new_footers[i] = {};
            new_footers[i] = {
              label: self.footers[i].label,
              colspan: colSpan,
            };
            empty += 1;
          } else {
            colSpan += 1;
            new_footers["empty" + empty] = {};
            new_footers["empty" + empty] = {
              label: "",
              colspan: colSpan,
            };
          }
        });

        console.log(new_footers);
        return new_footers;
      },
      create_invoice: function (index, plateforme) {
        // console.log(index);
        this.$emit("ev_create_invoice", {
          id_order: index,
          plateforme: plateforme,
        });
      },
      text_before: function (colonnes) {
        // console.log(colonnes);
        var textShow = "";
        if (colonnes.qb_doc_number) {
          textShow += colonnes.qb_doc_id
            ? ' <a class="button-link" href="https://c34.qbo.intuit.com/app/invoice?txnId=' +
              colonnes.qb_doc_id +
              '" target="_blank">F</a>'
            : " F ";
        }
        if (colonnes.qb_payment_number) {
          textShow += colonnes.qb_payment_id
            ? ' <a class="button-link" href="https://c34.qbo.intuit.com/app/recvpayment?txnId=' +
              colonnes.qb_payment_id +
              '" target="_blank">P</a> '
            : " P ";
        }
        if (colonnes.qb_doc_number_test) {
          textShow += colonnes.qb_doc_id_test
            ? '<a class="button-link" href="https://c34.qbo.intuit.com/app/invoice?txnId=' +
              colonnes.qb_doc_id_test +
              '" target="_blank">F</a>'
            : " F ";
        }
        if (colonnes.qb_payment_number_test) {
          textShow += colonnes.qb_payment_id_test
            ? '<a class="button-link" href="https://c34.qbo.intuit.com/app/recvpayment?txnId=' +
              colonnes.qb_payment_id_test +
              '" target="_blank">P</a> '
            : " P ";
        }
        if (parseInt(colonnes.qb_voided)) {
          textShow += ' <span class="text-danger">A</span> ';
        }
        if (parseInt(colonnes.qb_voided_test)) {
          textShow += ' <span class="text-danger">A</span> ';
        }
        return textShow;
      },
    },
    computed: {
      // hide table if header or body is empty
      table_actif: {
        get: function () {
          if (
            (this.headers && Object.keys(this.headers).length > 0) ||
            (this.rows && Object.keys(this.rows).length > 0)
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      show_empty_message: {
        get: function () {
          if (
            (this.headers && Object.keys(this.headers).length > 0) ||
            (this.rows && Object.keys(this.rows).length > 0)
          ) {
            return false;
          } else {
            return true;
          }
        },
      },
    },
  });

  // component input_submit **************************************************
  Vue.component("inputsubmit", {
    delimiters: ["${", "}"],
    props: {
      label: {
        type: String,
        default: "enregistrer",
      },
      custom_class: {
        type: String,
        default: "btn-outline-success",
      },
      icone: {
        type: String,
        default: "fas fa-save",
      },
    },
    template: "#form-template-inputsubmit",
    methods: {
      savef: function () {
        this.$emit("ev_savedatas_submit");
        // console.log(this.type);
      },
    },
  });

  // component tableau-trash
  // **************************************************
  props_tableau.datas_rows = [Object, Array];
  props_tableau.datas_trash = [Object, Array];
  props_tableau.table_title_trash = {
    type: String,
    default: "",
  };
  props_tableau.action_table_active = [Object, Array];
  delete props_tableau.rows;
  Vue.component("tableau-trash", {
    delimiters: ["${", "}"],
    props: props_tableau,
    template: "#template-tableau-trash",
    data: function () {
      return {};
    },
    mounted: function () {},
    created: function () {},
    /***************************************************************************
     * computed: { poubeles:{ get: function(){ if(this.r_poubeles.length > 0 )
     * {return this.r_poubeles;} return this.datas_trash; }, set: function(){
     * this.r_poubeles; } }, },/
     **************************************************************************/
    methods: {
      action_move: function () {
        console.log("execute action_move fdgdfgmo, kj");
      },
      action_restore: function (index) {
        var self = this;
        console.log("execute action_restore");
        // _supprimer_ligne(index, this.datas_trash, this.datas_rows,
        // put_in_trash=true);
        // this.supprimer_ligne(index, this.datas_trash, this.datas_rows,
        // put_in_trash=true); console.log('zfter move');
        // this.datas_trash = Object.assign({}, this.someObject, { a: 1, b: 2
        // });
        // /Vue.set(object, index, value)
        // this.r_poubeles = Object.assign({}, { a: 1, b: 2 });
        // Vue.set(this.poubeles, index, { a: 1, b: 2 })
        // Vue.delete(this.datas_trash, index);
        // delete this.datas_trash[index];
        // this.datas_rows={};
        // Object.assign(this.datas_rows, { a: 1, b: 2 });
        // Vue.delete(this.datas_trash, index);
        // Vue.set(this.datas_trash, 'iyollee', this.datas_trash[index]);
        Vue.set(this.datas_rows, index, this.datas_trash[index]);
        Vue.delete(this.datas_trash, index);
      },
      action_delete: function (index) {
        console.log("execute action_delete");
        Vue.set(this.datas_trash, index, this.datas_rows[index]);
        Vue.delete(this.datas_rows, index);
      },
      savedatas: function (params) {
        console.log(" execute savedatas : tableau-trash");
        this.$emit("ev_savedatas", params);
      },
      supprimer_ligne: function (
        index,
        lignes,
        poubeles = [],
        put_in_trash = false
      ) {
        console.log("move in compoment");
        if (put_in_trash) {
          if (lignes instanceof Array) {
            console.log("lignes est un ARRAY");
            poubeles.push(lignes[index]);
          } else if (lignes instanceof Object) {
            console.log("lignes est un Object");
            // poubeles[index]=lignes[index];
            Vue.set(poubeles, index, lignes[index]);
          }
        }
        delete lignes[index];
        Vue.delete(lignes, index);
        // return {'lignes':lignes, 'poubeles':poubeles};
      },
    },
  });

  // component prepareform **************************************************
  Vue.component("prepareform_table", {
    delimiters: ["${", "}"],
    props: {
      datas: [Object, Array],
      identifiant: {
        type: String,
        default: "",
      },
    },
    data: function () {
      return {
        submit: {
          label: "modifier",
          callback: "ev_saveform",
          classe: "btn-outline-success btn-sm",
        },
        fields: [],
        model: [],
      };
    },
    template: `<div>
      <formgenerate v-if="buildfield" :submit="submit" :fields="fields" :model0="model" @ev_saveform="saveform"></formgenerate>

    </div>`,
    mounted: function () {
      var self = this;
      console.log(self.datas);
      $.each(self.datas, function (key, value) {
        console.log(key);
        self.fields.push({
          type: "input",
          inputType: "text",
          label: key,
          model: key,
        });
        self.model[key] = {
          value: value,
        };
      });
    },
    methods: {
      buildfield: function () {
        console.log("build filed for form");
        console.log(this.datas);
        alert("");
        return false;
      },
      saveform: function () {
        var self = this;
        console.log("execute form presave");
        var model = $.extend({}, this.model);
        console.log(model);
        // update ligne

        $.each(model, function (key, valeur) {
          if (self.datas[key]) {
            console.log(valeur);
            Vue.set(self.datas, key, valeur.value);
          }
        });
        self.$emit("ev_close_dropdown", self.identifiant);
      },
    },
  });

  // component formgenerate **************************************************
  var props_formgenerate = {
    fields: [Object, Array],
    model0: [Object, Array],
    submit: {
      type: [Object, Array],
      default: function () {
        return {
          label: "enregistre",
          callback: "ev_saveform",
          classe: "btn-outline-success",
          show: true,
        };
      },
    },
    classe: {
      type: String,
      default: "form-builder my-1",
    },
  };
  Vue.component("formgenerate", {
    delimiters: ["${", "}"],
    template: "#form-template",
    props: props_formgenerate,
    data: function () {
      return {};
    },
    methods: {
      save_f2: function () {
        console.log(
          " Déclenche le parent Niveau superieur : " + this.submit.callback
        );
        this.$emit(this.submit.callback);
      },
      saveImage2: function (params) {
        console.log(" save image 2 : ");
        this.$emit("ev_saveimage_by_parent", params);
      },
    },
    components: {
      formfield: {
        props: {
          renderfield: [Object, Array],
          model: [Object, Array],
          settings: [Object, Array],
          // type:String,
        },
        template: ` <component v-bind:is="template_input" class="form-group" :field="renderfield" :model="model"  @ev_saveimage="saveImage" :label="renderfield.label" :name="model[renderfield.model]" :id_html="build_id_html"></component>
        `,
        created: function () {
          if (this.renderfield.multiple && this.renderfield.multiple.number) {
            this.$options.template =
              '<fieldset class="form-group">' +
              this.$options.template +
              "</fieldset>";
          }
        },
        methods: {
          saveImage: function (params) {
            console.log("save image");
            this.$emit("ev_saveimage_by_parent", params);
          },
        },
        computed: {
          template_input: {
            get: function () {
              if (this.renderfield.type === "input") {
                var component_name = "input_" + this.renderfield.inputType;
              } else {
                var component_name = "input_" + this.renderfield.type;
              }
              isComponentExists = component_name in Vue.options.components;
              if (isComponentExists) {
                console.log(" Template is define ok : " + component_name);
                return component_name;
              } else {
                console.log(" Template not define Error : " + component_name);
              }
            },
          },
          build_id_html: {
            get: function () {
              return "edit-" + this.renderfield.model;
            },
          },
        },
      },
    },
  });

  // /component input_text **************************************************
  props_formgenerate.bundle = {
    type: String,
    default: "acticle",
  };
  Vue.component("formgenerate_node", {
    delimiters: ["${", "}"],
    props: props_formgenerate,
    template: `<formgenerate :fields="formdatas.fields" :model0="formdatas.model" :submit="formdatas.submit"  @ev_saveform="saveform" :classe="classe" @ev_saveimage_by_parent="saveImage" ></formgenerate>`,
    data: function () {
      return {
        formdatas: {
          fields: [],
          model: {},
          submit: {
            label: "Enregistrer",
            callback: "ev_saveform",
            show: false,
            classe: "btn-outline-success float-right mt-4",
          },
          settings: {
            type: [
              {
                target_id: this.bundle,
                target_type: "node_type",
              },
            ],
          },
        },
      };
    },
    mounted: function () {
      var self = this;
      console.log("Content type");
      console.log(self.bundle);
      $.ajax({
        url: "/api/custom/node/" + self.bundle + "/definition/false",
        method: "GET",
        // async : false,
        success: function (data) {
          console.log(data);
          if (data.error) {
            console.log("close");
            self.$emit("ev_actionparent");
          } else {
            var fieldsAll = generate_schema_form(data.fields);
            self.formdatas.model = fieldsAll.model;
            self.formdatas.fields = fieldsAll.fields;
            self.$emit("ev_actionparent");
            self.formdatas.submit.show = true;
          }
        },
        error: function (error) {
          console.log("false");
          console.log(error);
        },
      });
    },
    methods: {
      saveform: function () {
        console.log("Custom methode : saveform");
        var newNode = buildNode(this.formdatas);
        getCsrfToken(function (csrfToken) {
          console.log("Before save Node");
          console.log(newNode);
          postEntity(callback2, csrfToken, newNode);
        });
      },
      saveImage: function (params) {
        var file = params.file;
        var self = this;
        /*
         */
        console.log(" Save image ");
        console.log(file);
        var entity_type_id = "node";
        var bundle = "",
          field = "";
        var filename = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
        filename = filename.toLowerCase();
        field = params.name;
        if (this.formdatas.settings.type[0].target_type == "node_type") {
          entity_type_id = "node";
        }
        var formData = new FormData();
        formData.append("data", file);
        if (this.formdatas.settings.type[0].target_id) {
          bundle = this.formdatas.settings.type[0].target_id;
        }
        getCsrfToken(function (csrfToken) {
          var url =
            "/file/upload/" +
            entity_type_id +
            "/" +
            bundle +
            "/" +
            field +
            "?_format=json";
          console.log(url);
          $.ajax({
            type: "POST",
            url: url,
            data: file,
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function (xhr) {
              xhr.setRequestHeader("X-CSRF-Token", csrfToken);
              xhr.setRequestHeader(
                "Content-Disposition",
                'file; filename="' + filename + '"'
              );
              xhr.setRequestHeader("Content-Type", "application/octet-stream");
            },
            success: function (datas) {
              console.log(datas);
              presave_image_fid(datas);
            },
            error: function (error) {
              console.log("false");
              console.log(error);
            },
          });
        });

        function presave_image_fid(datas) {
          console.log("image haved save succes, and retuen fid ");
          console.log(self.formdatas.model[params.name].target_ids);
          self.formdatas.model[params.name].target_ids.push({
            target_id: datas.fid[0].value,
            alt: "",
          });
          console.log(self.formdatas.model);
        }
      },
    },
  });

  // /component input_text **************************************************
  Vue.component("input_text", {
    delimiters: ["${", "}"],
    props: {
      label: {
        type: String,
        default: "input type text",
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext",
      },
      name: {
        type: String,
        default: "edit-inputtypetext",
      },
    },
    template: "#form-template-input-text",
  });

  // /component input_datepickere
  // **************************************************
  Vue.component("input_datepicker", {
    delimiters: ["${", "}"],
    props: {
      label: {
        type: String,
        default: "input type text",
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext",
      },
      name: {
        type: String,
        default: "edit-inputtypetext",
      },
      defaultvalue: {
        type: String,
        default: "",
      },
      input: {
        type: [Object, Array],
        default: function () {
          return {
            value: "",
          };
        },
      },
      formatdate: {
        type: String,
        default: "dd-mm-yy",
      }, // yy-mm-dd
    },
    methods: {
      oninput: function (event) {
        var self = this;
        var date = $("#" + self.id_html).datepicker("getDate");
        var month = (date.getMonth() + 1).toString().padStart(2, "0");
        var year = date.getFullYear();
        var day = date.getDate().toString().padStart(2, "0");
        this.$emit("input", year + "-" + month + "-" + day); // by default
      },
    },
    template: "#form-template-input-datepicker",
    watch: {
      defaultvalue: function () {
        console.log("retaurer : ", this.defaultvalue);
        if (this.defaultvalue == "" || this.defaultvalue == "none") {
          $("#" + this.id_html).datepicker("setDate", new Date());
          $("#" + this.id_html).val("");
        } else if (this.defaultvalue && this.defaultvalue != "none") {
          $("#" + this.id_html).datepicker(
            "setDate",
            new Date(this.defaultvalue)
          );
        }
      },
    },
    mounted: function () {
      var self = this;
      // console.log('defaultvalue : ', this.defaultvalue);
      if (this.defaultvalue != "") {
        $("#" + self.id_html).val(this.defaultvalue);
      }
      // add plugin datepicker in tag
      $("#" + self.id_html).datepicker({
        dateFormat: self.formatdate,
        onSelect: function (currentDate, obj) {
          var month = (obj.currentMonth + 1).toString().padStart(2, "0");
          DateInEN = obj.currentYear + "-" + month + "-" + obj.currentDay;
          self.$emit("input", DateInEN);
        },
      });
      $("#trigger-" + self.id_html).click(function () {
        if (
          $("#" + self.id_html)
            .datepicker("widget")
            .is(":visible")
        ) {
          $("#" + self.id_html).datepicker("hide");
        } else {
          console.log("is hidden");
          $("#" + self.id_html).datepicker("show");
        }
      });
    },
    computed: {
      id_html_trigger: {
        get: function () {
          return "trigger-" + this.id_html;
        },
      },
      set_date_first: {
        get: function () {
          alert(this.set_date_first);
          return this.set_date_first;
        },
      },
    },
  });

  // /component input_text **************************************************
  Vue.component("waitingload_multibuoule", {
    delimiters: ["${", "}"],
    props: {
      waitingload: {
        type: Boolean,
        default: false,
      },
    },
    template: "#template-waitingload",
  });

  // /component input_checkbox
  // **************************************************
  Vue.component("input_checkbox", {
    delimiters: ["${", "}"],
    props: {
      label: {
        type: String,
        default: "input type checkbox",
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext",
      },
      value: [String, Boolean],
    },
    template: "#form-template-input-checkbox",
    data: function () {
      return {};
    },
    methods: {
      changeaction: function ($event) {
        // console.log($event.target.checked);
        this.$emit("input", $event.target.checked);
        this.$emit("ev_reload_row", $event.target.checked);
      },
    },
    /*
     * beforeUpdate (){ console.log(this.name); },
     */
  });

  // component
  Vue.component("input_radio", {
    delimiters: ["${", "}"],
    props: {
      field: [Object, Array],
      model: [Object, Array],
    },
    template: "#form-template-input-radio",
    data: function () {
      return {
        name: this.field.model,
        value_on: true,
        value_off: false,
      };
    },
    computed: {
      id_html: {
        get: function () {
          // console.log(this.field);
          return "edit-" + this.field.model;
        },
      },
      id_html_off: {
        get: function () {
          // console.log(this.field);
          return "edit-off-" + this.field.model;
        },
      },
    },
  });

  // component input_select
  Vue.component("input_select", {
    delimiters: ["${", "}"],
    props: {
      field: [Object, Array],
      model: [Object, Array],
      id_html: {
        type: String,
        default: "edit-inputtypetext",
      },
    },
    template: "#form-template-input-select",
    data: function () {
      return {};
    },
  });

  // component input_autocomplete
  Vue.component("input_autocomplete", {
    delimiters: ["${", "}"],
    props: {
      field: [Object, Array],
      model: [Object, Array],
    },
    template: "#form-template-input-autocomplete",
    data: function () {
      return {
        id_html: "edit-" + this.field.model,
      };
    },
    mounted: function () {
      var self = this;
      $("#edit-" + this.field.model).autocomplete({
        // source: this.availableTags,
        delay: 700,
        select: function (event, ui) {
          event.preventDefault();
          // apply a label ( default is value)
          $("#edit-" + self.field.model).val(ui.item.label);
          self.model[self.field.model].target_ids = [];
          self.model[self.field.model].target_ids.push({
            target_id: ui.item.value,
          });
          self.model[self.field.model].label_term = ui.item.label;
          console.log("After update taxasomy term ");
          console.log(self.model);
        },
        focus: function (event, ui) {
          event.preventDefault();
          $("#edit-" + self.field.model).val(ui.item.label);
        },
      });
    },
    methods: {
      autocomplete_function: function (event) {
        var self = this;
        var search = $("#edit-" + this.field.model).val();
        var obj = this.field.settings.handler_settings.target_bundles;
        obj = obj[Object.keys(obj)[0]]; // console.log(obj);
        if (search != "") {
          $.ajax({
            url: "/api/custom/taxonomy_term/" + obj + "/listes/" + search,
            method: "GET",
            success: function (data) {
              // console.log(data);
              var tags = [];
              $.each(data, function (index, value) {
                tags.push({
                  label: value,
                  value: index,
                });
              });
              $("#edit-" + self.field.model).autocomplete(
                "option",
                "source",
                function (request, response) {
                  // data :: JSON list defined
                  response(tags);
                }
              );
            },
            error: function (error) {
              console.log(error);
            },
          });
        }
        // console.log(event);
        // console.log(search);
      },
    },
    /*
     * computed: { id_html: { get: function (){ return 'edit-'+this.field.model } } },
     */
  });

  // component input_select_in_modal
  Vue.component("input_select_in_modal", {
    delimiters: ["${", "}"],
    props: {
      field: [Object, Array],
      model: [Object, Array],
      // name:[Object, Array],
    },
    template: "#form-template-select-in-modal",
    data: function () {
      return {
        // id_html: this.field.model
        loadfirst: true,
        datas: {
          datas: [],
          infos: {
            label: "Ajouter",
          },
        },
      };
    },
    mounted: function () {},
    computed: {
      id_html: {
        get: function () {
          return "edit-" + this.field.model;
        },
      },
    },
    methods: {
      displayOnModal: function () {
        var self = this;
        console.log("display modal");
        $("#modal-" + this.field.model).modal();
        var entity_type = this.field.settings.target_type;
        var bundle = this.field.settings.handler_settings.target_bundles;
        bundle = bundle[Object.keys(bundle)[0]];
        // on effectue une premiere requete
        $.ajax({
          url:
            "/api/custom/" + entity_type + "/" + bundle + "/listes_select/20",
          method: "GET",
          // async : false,
          success: function (data) {
            console.log(data);
            if (data && data.infos && data.infos.label) {
              self.datas = data;
            }
          },
          error: function (error) {
            console.log(error);
          },
        });
      },
    },
    components: {
      "container-modal": {
        template: `<btmodal :body="modalbody" :model="model" :modalid="buildid" :modallabel="buildidlabel" :header="field.label"  :field="field" ></btmodal>`,
        props: {
          modalbody: [Object, Array],
          model: [Object, Array],
          field: [Object, Array],
        },
        computed: {
          buildid: {
            get: function () {
              return "modal-" + this.field.model;
            },
          },
          buildidlabel: {
            get: function () {
              return "label-" + this.field.model;
            },
          },
        },
        methods: {},
      },
    },
  });

  // component modal bootstrap
  Vue.component("btmodal", {
    delimiters: ["${", "}"],
    props: {
      field: [Object, Array],
      header: {
        type: String,
        default: "Modal title",
      },
      body: [Object, Array],
      model: [Object, Array],
      footer: [Object, Array],
      modalid: {
        type: String,
        default: "myModal",
      },
      modallabel: {
        type: String,
        default: "myModalLabel",
      },
      // addcontent:{type: String,default: "Ajouter"},
      // :{type: String,default: "new-vue-custom2"},
    },
    template: "#bs-modal",
    data: function () {
      return {
        showheader: true,
        showfooter: true,
        template_modalbody: "search-box",
        // datas forms news form
        sub_fields: [],
        sub_models: {},
        settings: {
          type: [
            {
              target_id: "",
              target_type: "node_type",
            },
          ],
        },
      };
    },
    methods: {
      changetemplate: function () {
        if (this.template_modalbody == "search-box") {
          var self = this;
          /*
           * var entity_type = self.field.settings.target_type; var bundle =
           * self.field.settings.handler_settings.target_bundles; bundle =
           * bundle[Object.keys(bundle)[0]];
           * self.settings.type[0].target_id=bundle; $.ajax({ url:
           * '/api/custom/'+entity_type+'/'+bundle+'/definition/false',
           * method: 'GET', // async : false, success: function (data) {
           * console.log(data); var fieldsAll =
           * generate_schema_form(data.fields); self.sub_fields =
           * fieldsAll.fields; self.sub_models = fieldsAll.model; }, error:
           * function (error) { console.log(error); } });
           */
          self.template_modalbody = "formgenerate_node"; // 'formgenerate';
        } else {
          var newform = null;
          this.template_modalbody = "search-box";
        }
      },
      saveform: function () {
        // console.log('enregistrement du formaulaire btmodal');
        // console.log(this.sub_models);
        var formdatas = {
          fields: this.sub_fields,
          model: this.sub_models,
          settings: this.settings,
        };
        var newNode = buildNode(formdatas);
        getCsrfToken(function (csrfToken) {
          console.log("Before save Node");
          console.log(newNode);
          postEntity(callback2, csrfToken, newNode);
        });
      },
      execute_action: function (params) {
        console.log("execute_action");
      },
    },
    computed: {
      addcontent: {
        get: function () {
          if (this.template_modalbody == "search-box") {
            return "Ajouter : " + this.field.label;
          } else {
            return "Enregistrer et selectionner";
          }
        },
        set: function (value) {
          // si la valeur est modifie
          console.log(value);
        },
      },
      new_vue_id: {
        get: function () {
          return "newvuejs-" + this.field.model;
        },
      },
      bundle: {
        get: function () {
          var self = this;
          var bundle = self.field.settings.handler_settings.target_bundles;
          bundle = bundle[Object.keys(bundle)[0]];
          return bundle;
        },
      },
    },
  });

  // component search-box
  Vue.component("search-box", {
    delimiters: ["${", "}"],
    props: {
      box_infos: [Object, Array],
      model: [Object, Array],
      field: [Object, Array],
    },
    template: "#template-search-box",
    data: function () {
      return {
        label: "Rechercher ",
        id_html: "custom-id-text",
        nameinput: {
          value: "",
        },
      };
    },
  });

  // component tableau
  Vue.component("tableau", {
    delimiters: ["${", "}"],
    props: {
      headers: [Object, Array],
      rows: [Object, Array],
      show_header: {
        type: Boolean,
        default: true,
      },
      show_action: {
        type: Boolean,
        default: false,
      },
      empty_message: {
        type: String,
        default: "Aucun contenu disponible",
      },
      model: [Object, Array],
      fields: [Object, Array],
      field: [Object, Array],
    },
    template: "#tableau-template",
    data: function () {
      return {
        arrayStructure: {
          type: "",
        },
      };
    },
    methods: {
      move: function (index) {
        console.log("move : " + index);
      },
      modifier: function (index) {
        console.log("move : " + index);
      },
      supprimer: function (index) {
        console.log("move : " + index);
      },
      move_to_top: function (index) {
        console.log("move : " + index);
      },
      numberlevel: function () {
        if (this.rows && this.rows != {}) {
          var firstvalue = this.rows;
          firstvalue = firstvalue[Object.keys(firstvalue)[0]];
          console.log("firstvalue");
          console.log(firstvalue);
          if (typeof firstvalue === "string" || firstvalue instanceof String) {
            this.arrayStructure.type = "string";
            return "string";
          }
          this.arrayStructure.type = "object";
          return true;
        }
      },
      select_and_close: function (index) {
        // console.log('user select ligne');
        // console.log(this.field);
        // console.log(this.model);
        if (this.arrayStructure.type == "string") {
          this.model[this.field.model].target_ids = index;
          this.model[this.field.model].label_node = this.rows[index];
          // close modal
          $("#modal-" + this.field.model).modal("hide");
        }
      },
    },
    computed: {
      // hide table if header or body is empty
      table_actif: {
        get: function () {
          // console.log('tableau datas')
          // console.log(this.rows);
          // console.log(Object.keys(this.rows))
          // console.log(Object.keys(this.rows).length);
          if (
            (this.headers && Object.keys(this.headers).length > 0) ||
            (this.rows && Object.keys(this.rows).length > 0)
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      show_empty_message: {
        get: function () {
          if (
            (this.headers && Object.keys(this.headers).length > 0) ||
            (this.rows && Object.keys(this.rows).length > 0)
          ) {
            return false;
          } else {
            return true;
          }
        },
      },
    },
  });
  // component
  Vue.component("input_image", {
    delimiters: ["${", "}"],
    props: {
      field: [Object, Array],
      model: [Object, Array],
    },
    template: "#form-template-input-image",
    data: function () {
      return {};
    },
    methods: {
      remove_image: function (index) {
        _supprimer_ligne(
          index,
          this.model[this.field.model].image_data,
          (poubeles = []),
          (put_in_trash = false)
        );
      },
      previewImage: function (event) {
        // https://www.javascripture.com/FileReader
        // https://stackoverflow.com/questions/32556664/getting-byte-array-through-input-type-file/32556944
        //

        var self = this;
        // Reference to the DOM input element
        var input = event.target;
        console.log(event);
        // Ensure that you have a file before attempting to read it
        if (input.files && input.files[0]) {
          var params = {
            file: input.files[0],
            name: this.field.model,
          };
          self.$emit("ev_saveimage", params);

          // create a new FileReader to read this image and convert to base64
          // format
          var readerfile = new FileReader();
          // Define a callback function to run, when FileReader finishes its
          // job
          readerfile.onload = (e) => {
            // Note: arrow function used here, so that
            // "this.model[this.field.model].image_data refers to the
            // imageData
            // of Vue component
            // Read image as base64 and set to
            // this.model[this.field.model].image_data
            if (this.field.multiple) {
              this.model[this.field.model].image_data.push(e.target.result);
              // console.log(this.model[this.field.model].image_data);
            } else {
              this.model[this.field.model].image_data = [];
              this.model[this.field.model].image_data.push(e.target.result);
            }
          };
          // Start the reader job - read file as a data url (base64 format)
          readerfile.readAsDataURL(input.files[0]);
        }
      },
    },
  });

  // / textarea_chart
  // https://www.chartjs.org/docs/latest/developers/api.html?h=destr
  Vue.component("chart", {
    delimiters: ["${", "}"],
    props: {
      chart_id: {
        type: String,
        default: "chart_id",
      },
      chart_type: {
        type: String,
        default: "line",
      },
      chart_show_graph: {
        type: Boolean,
        default: false,
      },
      chart_labels: {
        type: [Object, Array],
        default: function () {
          return ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
        },
      },
      chart_datasets: {
        type: [Object, Array],
        default: function () {
          return [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: ["rgba(25, 99, 132, 0.2)"],
              borderColor: ["rgba(25, 99, 132, 0.8)"],
              borderWidth: 1,
            },
          ];
        },
      },
      options: {
        type: Object,
        default: function () {
          return {
            responsive: true,
            maintainAspectRatio: false,
            // graph begin to zero
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          };
        },
      },
    },
    template: "#template-chart",
    data: function () {
      return {
        myChart: null,
      };
    },
    mounted: function () {},
    methods: {
      buildMap: function () {
        // console.log(this.chart_id);
        var ctx = document.getElementById(this.chart_id).getContext("2d");
        this.myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: this.chart_labels,
            datasets: this.chart_datasets,
          },
          options: this.options,
        }); /* */
      },
    },
    computed: {},
    watch: {
      chart_datasets: function () {
        if (this.myChart) {
          this.myChart.destroy();
        }
        this.buildMap();
      },
    },
  });

  // //
  // line-chart
  // https://codepen.io/azs06/pen/KmqyaN?editors=1010

  // //
  Vue.component("card_info", {
    delimiters: ["${", "}"],
    props: {
      card_info_header: {
        type: [String, Number],
        default: "Vente Amazon",
      },
      card_info_header_nombre: {
        type: [String, Number],
        default: "<span>0</span> Vente",
      },
      card_info_infos: {
        type: [String, Number],
        default: "1595,92€",
      },
      card_info_suffix: {
        type: [String, Number],
        default: "Total",
      },
      card_info_suffix_after: {
        type: [String, Number],
        default: "",
      },
      card_info_color: {
        type: [String, Number],
        default: "",
      },
      card_info_show: {
        type: Boolean,
        default: false,
      },
    },
    template: "#template_card_info",
  });

  // component input_submit **************************************************
  Vue.component("modal_simple", {
    delimiters: ["${", "}"],
    props: {
      datas_modal_body: [Object, Array, String, Number],
      datas_modal_footer: [Object, Array, String, Number],
      id_modal: {
        type: String,
        default: "myModal",
      },
      modal_position: {
        type: String,
        default: "modal-dialog-centered",
      },
      // titre_modal:{type: String,default: "titre du modal"},
      titre_modal_preview: {
        type: String,
        default: "",
      },
      template_modal_body: {
        type: String,
        default: "",
      },
      template_modal_footer: {
        type: String,
        default: "",
      },
      actionparent: [Object, Array, String, Number], // trigger action by
      // parent.
    },
    template: "#template-modal-simple",
    data: function () {
      return {};
    },
    mounted: function () {},
    methods: {
      event_modal_simple: function (datas) {
        this.$emit("ev_modal_simple", datas);
      },
    },
    computed: {
      titre_modal: {
        get: function () {
          return decodeURIComponent(this.titre_modal_preview);
        },
      },
    },
  });

  // component input_submit **************************************************
  /**
   * add and remove class show-custom-modal
   */
  Vue.component("modal_costum", {
    delimiters: ["${", "}"],
    props: {
      datas_modal_body: [Object, Array, String, Number],
      datas_modal_footer: [Object, Array, String, Number],
      id_modal: {
        type: String,
        default: "myModal",
      },
      text_apply: {
        type: String,
        default: '<i class="far fa-trash-alt mr-2" ></i> Supprimer',
      },
      text_void: {
        type: String,
        default: '<i class="fas fa-undo-alt mr-2"></i>  Annulée',
      },
      toggle_open: {
        type: String,
        default: "close",
      },
      modal_position: {
        type: String,
        default: "modal-dialog-centered",
      },
      // titre_modal:{type: String,default: "titre du modal"},
      titre_modal_preview: {
        type: String,
        default: "titre du modal",
      },
      template_modal_body: {
        type: String,
        default: "",
      },
      template_modal_footer: {
        type: String,
        default: "",
      },
      actionparent: [Object, Array, String, Number], // trigger action by
      // parent.
    },
    template: "#template-modal-cumstom",
    data: function () {
      return {};
    },
    watch: {
      toggle_open: function () {
        this.open_modal();
      },
    },
    mounted: function () {},
    methods: {
      close_and_false: function () {
        // console.log('Close custom model and return false');
        this.close_modal();
        this.$emit("ev_modal_action_annulee", {
          status: false,
          datas: this.datas_modal_body,
        });
      },
      close_modal: function () {
        $("#" + this.id_modal).removeClass("show-custom-modal");
      },
      close_and_true: function () {
        this.close_modal();
        this.$emit("ev_modal_action_appliquee", {
          status: true,
          datas: this.datas_modal_body,
        });
      },
      open_modal: function () {
        if (this.toggle_open == "open") {
          $("#" + this.id_modal).addClass("show-custom-modal");
        } else {
          $("#" + this.id_modal).removeClass("show-custom-modal");
        }
      },
      confirm_delete: function (datas) {
        console.log(datas);
        if (datas.status) {
          var id_bloc = datas.datas.id_bloc;
          console.log("id to delete : " + id_bloc);
          this.delete_bloc_tab(id_bloc);
        }
      },
    },
    computed: {
      titre_modal: {
        get: function () {
          return decodeURIComponent(this.titre_modal_preview);
        },
      },
    },
  });

  // /component alert message
  // **************************************************
  Vue.component("alert", {
    delimiters: ["${", "}"],
    props: {
      alert_message: {
        type: String,
        default: "alert primary",
      },
      alert_id_html: {
        type: String,
        default: "id-alert",
      },
      show_alert: {
        type: Boolean,
        default: true,
      },
      alert_attribut_class: {
        type: String,
        default: "alert-primary",
      },
      alert_template: {
        type: String,
        default: "",
      },
      datas: {
        type: [Object, Array, String, Number],
        default: "datas_vide",
      },
    },
    template: "#template-alert",
    data: function () {
      return {
        // name:'',
      };
    },
    computed: {
      class_alert: {
        get: function () {
          var classe = "alert alert-dismissible fade show";
          classe += " " + this.alert_attribut_class;
          return classe;
        },
      },
    },
    methods: {
      closeByParent: function () {
        this.$emit("ev_alert_close");
      },
      alert_action: function (datas) {
        this.$emit("ev_alert_action", datas);
      },
    },
  });

  Vue.component("html_pre", {
    delimiters: ["${", "}"],
    template: "<pre>${datas}</pre>",
    props: {
      datas: [Object, Array, String, Number],
    },
    data: function () {
      return {};
    },
  });

  Vue.component("html_div", {
    delimiters: ["${", "}"],
    template: "<div>${datas}</div>",
    props: {
      datas: [Object, Array, String, Number],
    },
    data: function () {
      return {};
    },
  });

  /**
   *
   */
  Vue.component("accordion", {
    delimiters: ["${", "}"],
    props: {
      accordion_id: {
        type: String,
        default: "accordionexample",
      },
      accordions: [Object, Array],
      template_accordion: {
        type: [String, Object],
        default: "",
      },
    },
    template: "#template-accordion",
    data: function () {
      return {
        last_collapse: false,
        data_target: false,
      };
    },
    methods: {
      manage_collapse: function (e) {
        var self = this;
        self.data_target = $(e.target).attr("data-target");
        $("#" + self.accordion_id + " " + self.data_target).collapse("toggle");
        // console.log('Show collapse : '+self.data_target);
        if (self.last_collapse && self.last_collapse != self.data_target) {
          // console.log('hide collapse : '+self.last_collapse);
          $("#" + self.accordion_id + " " + self.last_collapse).collapse(
            "hide"
          );
        }
        self.last_collapse = self.data_target;
      },
    },
    /*
    computed: {
      watch_accordions: {
        get() {
          return this.accordions;
        }
      }
    }
    /**/
  });

  // component input_submit **************************************************
  Vue.component("load_template", {
    delimiters: ["${", "}"],
    props: {
      /**
       * Datas
       */
      datas_page_body: [Object, Array, String, Number],
      datas_page_footer: [Object, Array, String, Number],
      page_title: {
        type: String,
        default: "",
      },
      /**
       * Templates
       */
      template_page_body: {
        type: String,
        default: "",
      },
      template_page_footer: {
        type: String,
        default: "",
      },
      /**
       * Triggers
       */
      actionparent: [Object, Array, String, Number],
    },
    template: "#template-load-template",
    data: function () {
      return {};
    },
    mounted: function () {},
    methods: {
      sous_template_action: function (datas) {
        this.$emit("ev_sous_template_datas", datas);
      },
    },
    computed: {
      page_title_decode: {
        get: function () {
          return decodeURIComponent(this.page_title);
        },
      },
    },
  });

  /**
   * this.params = 'queries=' + JSON.stringify(params); <load_data_ajax_get
   * :url="url_get" :datas="queries" :headers="ajax_headers"
   *
   * @ev_data_from_ajax="data_from_ajax" :trigger_loanding="trigger_loanding"></load_data_ajax_get>
   */
  Vue.component("load_data_ajax_get", {
    delimiters: ["${", "}"],
    props: {
      url: {
        type: [String],
        default: false,
      },
      datas: {
        type: [Object, Array, String, Number],
      },
      headers: {
        type: [String, Object],
        default: "",
      },
      trigger_loanding: [Number],
    },
    data: function () {
      return {};
    },
    watch: {
      trigger_loanding: function () {
        // console.log('Prepare to load by Ajax, url : ', this.url);
        if (
          this.url &&
          this.url != "" &&
          this.trigger_loanding &&
          this.trigger_loanding > 0
        ) {
          this.load_datas();
        }
      },
    },
    methods: {
      load_datas: function () {
        var self = this;
        if (!self.url && self.url != "") {
          self.$emit("ev_data_from_ajax", {
            status: false,
            url: index,
            data: ["URL not define"],
          });
          return false;
        }
        // console.log(self.datas);
        $.ajax({
          url: self.url,
          method: "GET",
          headers: self.headers,
          data: self.datas,
          success: function (data) {
            self.$emit("ev_data_from_ajax", {
              status: true,
              url: self.url,
              data: data,
            });
          },
          error: function (error) {
            self.$emit("ev_data_from_ajax", {
              status: false,
              url: self.url,
              data: error,
            });
          },
        });
      },
    },
    template: '<div class="d-none loadData ajax"></div>',
  });

  /**
   * <send_data_ajax :url="url_post" :headers="headers"
   *
   * @ev_data_from_ajax="data_from_ajax" :datas="post_datas"
   *                                     :trigger_loanding="trigger_post_loanding"></send_data_ajax>
   */
  // <send_data_ajax :url="url_post" :headers="headers"
  // @ev_data_from_ajax="data_from_ajax" :datas="post_datas"
  // :trigger_loanding="trigger_post_loanding"></send_data_ajax>
  Vue.component("send_data_ajax", {
    delimiters: ["${", "}"],
    props: {
      url: {
        type: [String],
        default: false,
      },
      headers: {
        type: [String, Object],
        default: "",
      },
      datas: {
        type: [Object, Array, String, Number],
      },
      protocole: {
        type: [String],
        default: "POST",
      },
      trigger_loanding: [Number],
    },
    data: function () {
      return {};
    },
    watch: {
      trigger_loanding: function () {
        if (
          this.url &&
          this.url != "" &&
          this.trigger_loanding &&
          this.trigger_loanding > 0
        ) {
          this.load_datas();
        }
      },
    },
    methods: {
      load_datas: function () {
        var self = this;
        if (!self.url && self.url != "") {
          self.$emit("ev_data_from_ajax", {
            status: false,
            url: self.url,
            data: ["URL not define"],
          });
          return false;
        }
        var datas = JSON.stringify(self.datas);
        $.ajax({
          url: self.url,
          method: self.protocole,
          headers: self.headers,
          data: datas,
          contentType: "application/json; charset=UTF-8",
          dataType: "json",
          success: function (data) {
            self.$emit("ev_data_from_ajax", {
              status: true,
              url: self.url,
              data: data,
              datapost: self.datas,
            });
          },
          error: function (error) {
            //console.log(error);
            //console.log(error.getAllResponseHeaders())
            self.$emit("ev_data_from_ajax", {
              status: false,
              url: self.url,
              errorajax: error,
              datapost: self.datas,
            });
          },
        });
      },
    },
    template: '<div class="d-none loadData ajax"></div>',
  });
  /**
   *
   */
  Vue.component("read-file-csv", {
    delimiters: ["${", "}"],
    template: "#template-read-file-csv",
    props: {
      id_html: {
        type: [String],
        default: "id-read-file-csv",
      },
      label: {
        type: [String],
        default: "Fichier",
      },
      link_example: {
        type: [String],
        default: "/comptabilte/docs/13933734551017876.csv",
      },
      name_example: {
        type: [String],
        default: "Example de fichier",
      },
      headers_file: [Object, Array],
    },
    data: function () {
      return {};
    },
    methods: {
      read_file: function (event) {
        console.log(event);
      },
    },
  });

  /**
   * methode pour envoyer ou recevoir les données de la app compta.
   */
  Vue.component("route-compta", {
    delimiters: ["${", "}"],
    template: "#template-route-compta",
    props: {
      token: {
        type: [String, Boolean],
        default: function () {
          return false;
        },
      },
      datas: {
        type: [Object, Array, String, Number],
      },
      configs: {
        type: [Object],
      },
      endpoint: {
        type: String,
        default: function () {
          return "/comptabilte/getcommandes.php";
        },
      },
    },
    data: function () {
      return {
        /**
         * Ajax get
         */
        trigger_post_loanding: 0,
        url_post: "",
        post_datas: "",
        headers: {},
      };
    },
    methods: {
      send_data: function (configs_filtre = null, token = null) {
        var config_posts = {};
        var config_token = "";
        /**
         * set config
         */
        if (configs_filtre) {
          config_posts = configs_filtre;
        } else {
          config_posts = this.configs;
        }
        /**
         * set token
         */
        if (token) {
          config_token = token;
        } else {
          config_token = this.token;
        }
        if (!config_token || !this.endpoint || this.endpoint == "") {
          this.error_validation();
          return false;
        }
        this.url_post = this.endpoint;
        this.post_datas = config_posts;
        this.headers = {
          "Content-Type": "application/json",
          "X-CSRF-Token": config_token,
          Accept: "application/json",
        };
        this.trigger_post_loanding++;
      },
      test_send_data: function () {
        console.log("test_send_data");
        return true;
      },
      error_validation: function () {
        console.log("ERROR :: ", this.token, this.endpoint);
        alert("Erreur de Configuration");
      },
      data_from_ajax: function (datas) {
        this.$emit("ev_data_from_ajax", datas);
      },
    },
  });

  /**
   * creer un client sur QB
   */
  Vue.component("filtre-compta-shopify", {
    delimiters: ["${", "}"],
    template: "#template-filtre-compta-shopify",
    props: {
      modal_body: {
        type: [Array, Object],
      },
      configs_filtre: {
        type: [Object],
      },
      template_additional_filter: {
        type: String,
        default: "",
      },
    },
    data: function () {
      return {
        show_popup: false,
        input_date: {
          value: "",
        },
        options_date: {
          all: "Toutes les dates",
          date: "Dates exactes",
          // '2019-11-01': 'Mois en cours',
        },
        passerelle: {
          value: "",
        },
        list_passerelle: {},
        /**
         * Ajax get
         */
        trigger_post_loanding: 0,
        token: "",
        /**
         *
         */
        input_firstday: {
          value: "",
        },
        label_firstday: "Du",
        /**
         *
         */
        input_lastday: {
          value: "",
        },
        label_lastday: "Au",
        /**
         * Mois en cours
         */
        current_Month: false,
        /**
         * verifie si les dates par defaut sont definit.
         */
        check_defaultDate_is_set: false,
        /**
         * Configuration à envoyer vers le parent
         */
        configs_sends: {
          is_click: false,
        },
        //
        component_debug: false,
        /**
         * permet à ce filtre de demander les données au template enfant.
         */
        trigger_ask_data_additional_template: 0,
        /**
         * permet de reset le template enfant
         */
        trigger_reset_data_additional_template: 0,
        /**
         *
         */
        sender_waiting: false,
      };
    },
    watch: {
      configs_filtre: function () {
        if (this.configs_filtre) {
          this.getListsPasserelle();
        }
      },
      input_firstday: {
        handler(val) {
          if (val && val.value !== "") {
            this.input_date.value = "date";
          }
        },
        deep: true,
      },
      input_lastday: {
        handler(val) {
          if (val && val.value !== "") {
            this.input_date.value = "date";
          }
        },
        deep: true,
      },
    },
    mounted: function () {
      this.getCurrentMonth();
      this.getDateByMonth();
      /**
       * si le template est definit, c'est lui qui gere l'evenement
       */
      if (this.template_additional_filter !== "") {
        /**
         * Recuperation des donnnées de templates additionneles.
         */
        this.trigger_ask_data_additional_template++;
      } else {
        this.sendDataParent();
      }
    },
    methods: {
      /**
       * Envoit les donées au component parent.
       */
      sendDataParent: async function () {
        var self = this;
        console_log("debut sendDataParent", this.component_debug);
        async function sender() {
          await self.buildFilters();

          if (!self.sender_waiting) {
            self.$emit("ev_apply_filter", self.configs_sends);
          } else {
            setTimeout(function () {
              console.log("On patiente dés ");
              sender();
            }, 500);
          }
          console_log("FIN sendDataParent", self.component_debug);
        }
        await sender();
      },
      getListsPasserelle: function () {
        this.token = "get_lists_passerelle";
        this.$refs.sendDataAjax.send_data(
          this.configs_filtre,
          "get_lists_passerelle"
        );
      },
      reinitialisation: function () {
        this.input_firstday.value = "";
        this.input_lastday.value = "";
        this.input_date.value = this.current_Month;
        this.passerelle.value = "";
        this.trigger_reset_data_additional_template++;
      },
      select_month: async function (month) {
        if (month !== "date" && month.value !== "all") {
          this.input_firstday.value = "";
          this.input_lastday.value = "";
        }
        await this.buildFilters();
      },
      getdateEndMonth: function (date) {
        var cal_date = new Date(date);
        return new Date(cal_date.getFullYear(), cal_date.getMonth() + 1, 0);
      },
      async data_from_addition_template(datas) {
        var self = this;
        // il faudra faire patiente jusqu'a ce sender_waiting soit à false;
        // car s'il est à true cela signiqfie qu"une autre instance l'utilise.
        this.sender_waiting = true;
        console_log("Debut data_from_addition_template", self.component_debug);
        var setDataInConfig = function () {
          return new Promise((resolve) => {
            console_log(
              "debut setDataInConfig data_from_addition_template",
              self.component_debug
            );
            $.each(datas, function (k, v) {
              if (k !== "filters") {
                self.$set(self.configs_sends, k, v);
              }
            });
            //console.log(self.configs_sends);
            console_log(
              "Fin setDataInConfig data_from_addition_template",
              self.component_debug
            );
            resolve("ok");
          });
        };

        await setDataInConfig();
        console_log("Fin data_from_addition_template", self.component_debug);
        self.sender_waiting = false;
        this.sendDataParent();
      },
      apply_filter() {
        this.configs_sends.is_click = true;
        /**
         * si le template est definit, c'est lui qui gere l'evenement
         */
        if (this.template_additional_filter !== "") {
          /**
           * Recuperation des donnnées de templates additionneles.
           */
          this.trigger_ask_data_additional_template++;
        } else {
          this.sendDataParent();
        }
        this.show_hide_popup();
        /**/
      },
      addFiltersAND: async function (field, value, operator = "=") {
        this.configs_sends.filters.AND.push({
          column: field,
          value: value,
          operator: operator,
        });
      },
      addFiltersOR: async function (field, value, operator = "=") {
        this.configs_sends.filters.OR.push({
          column: field,
          value: value,
          operator: operator,
        });
      },
      buildFilters: async function () {
        console_log("debut buildFilters", this.component_debug);
        this.configs_sends.filters = {
          AND: [],
          OR: [],
        };
        //var results = [];
        //
        if (this.passerelle.value !== "") {
          await this.addFiltersAND("passerelle", this.passerelle.value);
        }
        //
        if (this.input_firstday.value !== "") {
          await this.addFiltersAND(
            "created_at",
            this.input_firstday.value,
            ">="
          );
        }
        //
        if (this.input_lastday.value !== "") {
          let input_lastday = await addDay(this.input_lastday.value, 1);
          input_lastday = await convertObjectDateToMysqlDate(input_lastday);
          this.addFiltersAND("created_at", input_lastday, "<");
        }
        //
        if (
          this.input_date.value !== "date" &&
          this.input_date.value !== "all"
        ) {
          let current_month = new Date(this.input_date.value);
          let reseach =
            current_month.getFullYear() +
            "-" +
            (parseInt(current_month.getMonth()) + 1)
              .toString()
              .padStart(2, "0");
          await this.addFiltersAND("created_at", reseach, "LIKE");
        }
        console_log("Fin buildFilters", this.component_debug);
      },
      show_hide_popup: function () {
        if (this.show_popup) {
          this.show_popup = false;
        } else {
          this.show_popup = true;
        }
      },
      data_from_ajax: function (datas) {
        // console.log(datas);
        if (datas.status) {
          var results = datas.data.return;
          if (results.get_lists_passerelle) {
            this.formatListPasserelle(results.get_lists_passerelle);
          }
        }
      },
      formatListPasserelle: function (lists) {
        var results = {};
        $.each(lists, function (i, v) {
          results[v.name] = v["display-name"];
        });
        this.list_passerelle = results;
      },
      getDateByMonth: function () {
        var self = this;
        var loop_date = true;
        var options_date = self.options_date;
        self.options_date = {};
        var date = new Date(this.current_Month);
        var it = 0;
        while (loop_date) {
          // var month = (date.getMonth() + 1).toString().padStart(2, '0');
          var month = date.getMonth();
          var year = date.getFullYear();
          // options_date[year + '-' + month + '-01'] = year + '-' + month +
          // '-01';
          options_date[year + "-" + (month + 1) + "-01"] =
            getMonthInFrench(month) + " " + year;

          if (it === 1) {
            /**
             * On definit la date par defaut au mois precedent.
             */
            // self.current_Month = year + '-' + (month + 1) + '-01';
            self.input_date.value = self.current_Month;
          }
          if (year === 2018 && month <= 11) {
            loop_date = false;
          }
          date.setMonth(date.getMonth() - 1);
          it++;
        }
        setTimeout(function () {
          // console.log('self.options_date : ', options_date);
          self.options_date = options_date;
        }, 1000);
      },
      getCurrentMonth: function () {
        var date = new Date();
        this.current_Month =
          date.getFullYear() + "-" + (parseInt(date.getMonth()) + 1) + "-01";
      },
    },
  });

  /**
   *
   */
  Vue.component("display-company-infos", {
    delimiters: ["${", "}"],
    template: "#template-display-company-infos",
    props: {
      udtate_status: {
        type: [Boolean],
      },
    },
    data: function () {
      return {
        show_company_infos: false,
        QB_compte_title: "",
        config__manage_connect: {},
      };
    },
    methods: {
      get_compta_configs: function (configs) {
        this.config__manage_connect = configs;
        if (configs.databaseConfig == "prodNutribe") {
          this.QB_compte_title = "Vous etes sur le compte Production (Nutribe)";
          this.show_company_infos = true;
        } else if (configs.databaseConfig == "testNutribe") {
          this.QB_compte_title = "Vous etes sur le compte test (Dummy)";
          this.show_company_infos = true;
        } else {
          this.show_company_infos = false;
          this.QB_compte_title = "";
        }
      },
    },
  });

  /**
   * creer un client sur QB
   */
  Vue.component("override-customer-qb", {
    delimiters: ["${", "}"],
    template: "#override-customer-qb",
    props: {
      modal_body: {
        type: [Array, Object],
      },
    },
    data: function () {
      return {
        displayname: {
          value: "",
        },
      };
    },
  });
  /**
   * creer un client sur QB
   */
  Vue.component("create-customer-qb", {
    delimiters: ["${", "}"],
    template: "#button-create-customer-qb",
    props: {
      configs: {
        type: [Array, Object],
      },
    },
    data: function () {
      return {
        /**
         * Ajax configs
         */
        url_post: "/quickbookstest/quickbook.php",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "create-customer-v2",
          Accept: "application/json",
        },
        post_datas: "",
        trigger_post_loanding: 0,
        event: "",
        /**
         *
         */
        toggle_open_modal: "close",
        titre_modal: "Surcharger les valeurs par defauts",
        template_modal_body: "override-customer-qb",
        datas_modal_body: {
          text: "vrai",
        },
        modal_text_apply: '<i class="fas fa-check"></i> Appliquée',
      };
    },
    methods: {
      create_customer: function (event) {
        this.event = event;
        console.log("configs", this.configs);
        $(".fa-sync", this.event.target).removeClass("d-none");
        this.post_datas = this.configs;
        this.trigger_post_loanding++;
      },
      create_customer_custom_field: function (event) {
        this.event = event;
        console.log("configs", this.configs);
        this.toggle_open_modal = "open";
      },
      data_from_ajax: function (datas) {
        console.log("return ", datas);
        $(".fa-sync", this.event.target).addClass("d-none");
        this.$emit("ev_create_customer_v2", {
          configs: this.configs,
          results: datas,
        });
      },
      modal_action_annulee: function (datas) {
        this.toggle_open_modal = "close";
        console.log("return ", datas);
      },
      modal_action_appliquee: function (datas) {
        this.toggle_open_modal = "close";
        console.log("return ", datas);
      },
    },
  });

  /**
   * permet d'obtenir les parametres de connexion QB et base de donnéelse
   * template-get-configs
   */
  Vue.component("get-configs", {
    delimiters: ["${", "}"],
    template: "#template-get-configs",
    props: {
      configs: {
        type: [Object],
      },
    },
    data: function () {
      return {
        databaseConfig: "",
        current_compagny: "",
      };
    },
    mounted: function () {
      this.current_compagny = getSession(
        "current_compagny",
        "9130347044451506"
      );
      if (this.current_compagny == "9130347038344016") {
        this.databaseConfig = "testNutribe";
      } else if (this.current_compagny == "9130347044451506") {
        this.databaseConfig = "prodNutribe";
      } else {
        this.current_compagny = "9130347038344016";
        this.databaseConfig = "testNutribe";
      }
      this.returnConfig();
    },
    methods: {
      returnConfig: function () {
        this.$emit("ev_get_compta_configs", {
          status: true,
          databaseConfig: this.databaseConfig,
          current_compagny: this.current_compagny,
        });
      },
      validationConfig: function () {
        //
      },
      returnStatusValidation: function () {
        this.$emit("ev_status_configs_validation", true);
      },
    },
  });
  /**
   * Delete payment.
   */
  Vue.component("deletepayment", {
    delimiters: ["${", "}"],
    template: "#template-deletepayment",
    props: {},
    data: function () {
      return {
        datasql: {
          value: "",
        },
        plateforme: {
          value: "amazon",
        },
        plateformes: {
          shopify: "Shopify",
          amazon: "Amazon",
        },
        databaseConfig: "",
        current_compagny: "",
        /**
         *
         */
        root: $("body").attr("data-root"),
        url_post: "",
        headers: "",
        post_datas: "",
        trigger_post_loanding: 0,
        send_to_delete: false,
        /**
         * Message
         */
        message: "",
        class_txt: "",
        /**
         * Commandes valides
         */
        orders: [],
        /**
         * Accordeons
         */
        deletepayment: [],
      };
    },
    mounted: function () {
      this.current_compagny = getSession("current_compagny");
      if (this.current_compagny == "9130347038344016") {
        this.databaseConfig = "testNutribe";
      } else if (this.current_compagny == "9130347044451506") {
        this.databaseConfig = "prodNutribe";
      }
    },
    methods: {
      data_from_ajax: function (datas) {
        console.log(datas);
        if (datas.status) {
          datas = datas.data;
          if (
            datas &&
            datas.return &&
            datas.return.execute_request_select &&
            datas.return.execute_request_select.length > 0
          ) {
            if (this.validStructure(datas.return.execute_request_select)) {
              this.orders = datas.return.execute_request_select;
              this.message =
                "<strong>" +
                datas.return.execute_request_select.length +
                " </strong> commandes dans la requete";
              this.class_txt = "text-success";
              if (this.send_to_delete) {
                this.send_commandes();
                this.send_to_delete = false;
              }
            } else {
              this.message =
                "Le champs <strong>qb_doc_number</strong> est absent";
              this.class_txt = "text-warning";
            }
          } else if (
            datas &&
            datas.return &&
            datas.return.execute_request_select &&
            datas.return.execute_request_select.length == 0
          ) {
            this.orders = [];
            this.message = "0 commande";
            this.class_txt = "text-success";
          } else if (datas && datas.deletes) {
            if (
              datas.deletes.void &&
              (datas.deletes.void.length > 0 || datas.deletes.void.length == 0)
            ) {
              var Void = {
                title: "Paiements annulés : " + datas.deletes.void.length,
                body: this.getInfosFromVoid(datas.deletes.void),
              };
              this.deletepayment.push(Void);
            }
            if (
              datas.deletes.voided &&
              (datas.deletes.voided.length > 0 ||
                datas.deletes.voided.length == 0)
            ) {
              var voided = {
                title:
                  "Paiements deja annulés : " + datas.deletes.voided.length,
                body: this.getInfosFromVoid(datas.deletes.voided),
              };
              this.deletepayment.push(voided);
            }
          }
        } else {
          this.class_txt = "text-warning";
          this.message = "Une erreur s'est produite";
        }
      },
      test_request: function () {
        this.class_txt = "";
        this.message = "";
        this.deletepayment = [];
        if (this.datasql.value == "") {
          alert("Le champs requete sql est vide");
        } else {
          this.url_post = this.root + "/getcommandes.php";
          this.headers = {
            "X-CSRF-Token": "execute_request_select",
          };
          this.post_datas = {
            databaseConfig: this.databaseConfig,
            sql: this.datasql.value,
          };
          this.trigger_post_loanding++;
        }
      },
      void_payment: function () {
        this.send_to_delete = true;
        this.orders = [];
        if (!this.orders.length || this.orders.length == 0) {
          this.test_request();
        } else {
          this.send_commandes();
        }
      },
      send_commandes: function () {
        this.url_post = "/quickbookstest/quickbook.php";
        var id_order =
          this.orders[0] && this.orders[0].id_order
            ? this.orders[0].id_order
            : 1;
        var plateforme = this.plateforme.value;
        this.headers = {
          "X-CSRF-Token": "void_multiple_payment",
        };
        this.post_datas = {
          databaseConfig: this.databaseConfig,
          id_order: id_order,
          plateforme: plateforme,
          default: {
            payment_delete: this.orders,
          },
          current_compagny: this.current_compagny,
          dev_evolution: getSession("dev_evolution"),
        };
        this.trigger_post_loanding++;
      },
      validStructure: function (datas) {
        var status = true;
        $.each(datas, function (i, v) {
          if (v.qb_doc_number) {
            // return true;
          } else {
            status = false;
          }
        });
        return status;
      },
      textarea_input: function (datas) {
        this.orders = [];
        this.message = "";
        this.class_txt = "";
      },
      getInfosFromVoid: function (Payments) {
        var info = "PaymentRefNums :";
        $.each(Payments, function (i, data) {
          // console.log('Payment : ', data, data.Payment, data.Payment
          // .PaymentPaymentRefNum);
          if (data.Payment && data.Payment.PaymentRefNum) {
            info += " " + data.Payment.PaymentRefNum + "; ";
          }
        });
        return info;
      },
    },
  });

  /**
   * Gere la connextion à QB.
   */
  Vue.component("manage-connect", {
    delimiters: ["${", "}"],
    template: "#template-manage-connect",
    props: {
      accordion_id: {
        type: [String],
        default: "accordion_requests_datas",
      },
      template_accordion: {
        type: [String],
        default: "html_div",
      },
      requests: {
        type: [Object, Array],
      },
      template_additional_filter: {
        type: String,
        default: "",
      },
      show_button_filter: {
        type: Boolean,
        default: true,
      },
      show_select_qb: {
        type: Boolean,
        default: true,
      },
      custom_class: {
        type: String,
        default: "bg-light p-3 mt-5",
      },
      custom_class_block_filter: {
        type: String,
        default: "col-md-6",
      },
    },
    data: function () {
      return {
        /**
         * champs date de debut
         */
        defaultvalue_firstday: getDateFrench(getSession("input_firstday")),
        label_firstday: "Date de début",
        input_firstday: "",
        /**
         * champs date de fin
         */
        input_lastday: "",
        label_lastday: "Date de fin",
        defaultvalue_lastday: getDateFrench(getSession("input_lastday")),
        /**
         * configs de base en cours.
         */
        compta_configs: {},
        /**
         * Status debug.
         */
        modedebug: -1,
        /**
         * Data for module config.
         */
        actionparent_config: 0,
        configs: {},
        titre_config: "Configuration de QB.",
        /**
         * permet de s'assurer que la configuration du module <get-configs> est
         * totalement charger.
         */
        check__get_configs: false,
        /**
         * permet de s'assurer que les elments du component
         * <filtre-compta-shopify> est chargé.
         */
        check__filtre_compta_shopify: false,
      };
    },
    mounted: function () {
      this.sendDefaultData();
    },
    methods: {
      /**
       * Patiente jusqu'à ce k les données de configurations soit prete
       * ensuite elle transmet au component parent.
       */
      sendDefaultData: async function () {
        var self = this;
        async function sender() {
          if (self.check__get_configs && self.check__filtre_compta_shopify) {
            console.log("sendDefaultData : ", self.compta_configs);
            self.$emit("ev_getconfig__manage_connect", self.compta_configs);
          } else {
            setTimeout(function () {
              sender();
            }, 300);
          }
        }
        await sender();
      },
      apply_input_firstday: function (date) {
        this.input_firstday = date;
      },
      apply_input_lastday: function (date) {
        this.input_lastday = date;
      },
      inputsubmit: function () {
        console.log("inputsubmit perform mange-connect-qb ");
        this.saveDateSelectInCookie();
        this.merge_config();
        // this.compta_configs.input_firstday = this.input_firstday;
        // this.compta_configs.input_lastday = this.input_lastday;
        this.compta_configs.is_click = true;
        // this.compta_configs.modedebug = this.modedebug;
        this.$emit("ev_getconfig__manage_connect", this.compta_configs);
        // this.getdatas();
      },
      saveDateSelectInCookie: async function () {
        var input_firstday = getDateFrench(this.input_firstday);
        var input_lastday = getDateFrench(this.input_lastday);
        saveSession("input_firstday", input_firstday);
        saveSession("input_lastday", input_lastday);
      },
      open_config_modal: function () {
        var self = this;
        var id_modal = "model-confis";
        $("#" + id_modal).modal({});
        self.actionparent_config = self.actionparent_config + 1;
      },
      select_tab: function (e) {
        var self = this;
        var attr_mode = parseInt($(e.target).attr("data-modedebug"));
        if (attr_mode < 0) {
          // console.log('attr_mode : ',attr_mode);
          self.modedebug = -1;
          console.log("modedebug false ");
        } else {
          self.modedebug = 1;
          // console.log('modedebug true ');
        }
        /**
         * save mode
         */
        saveSession("manage_connect__modedebug", self.modedebug);
        /**
         * send action value to parent
         */
        this.merge_config();
        this.$emit("ev_getconfig__manage_connect", this.compta_configs);
      },
      /**
       * cette function est utilise car les données envoyer par emit s'execute
       * avant mounted. Par la suite cette function est appéle à la suite de
       * l'event d'emit.
       */
      applyDefaultValue: async function () {
        console_log("Debut applyDefaultValue");
        if (
          this.defaultvalue_firstday != "" ||
          this.defaultvalue_lastday != ""
        ) {
          this.input_firstday = this.defaultvalue_firstday;
          this.input_lastday = this.defaultvalue_lastday;
        }

        this.modedebug = parseInt(getSession("manage_connect__modedebug", -1));
        /**/
        console_log("Fin applyDefaultValue");
      },
      /**
       * Permet d'avoir les paramettres par defaut du component <get-configs>,
       * comportement par defaut.
       */
      get_compta_configs: async function (datas) {
        await this.applyDefaultValue();
        await this.merge_config(datas);
        this.compta_configs.is_click = false;
        this.check__get_configs = true;
      },
      merge_config: async function (datas = null) {
        console_log("debut merge_config");
        if (datas) {
          this.compta_configs = datas;
        }
        this.compta_configs.modedebug = this.modedebug;
        console.log("this.compta_configs.modedebug ", this.modedebug);
        console_log("fin merge_config");
      },
      // Executer par defaut par le filtre plus d'options.
      apply_filter: async function (datas) {
        var self = this;
        $.each(datas, function (k, v) {
          self.$set(self.compta_configs, k, v);
        });
        this.compta_configs.force_update = true;
        //
        await this.saveDateSelectInCookie();
        await this.merge_config();
        //
        if (datas.is_click) {
          this.sendDefaultData();
        }
        //
        this.check__filtre_compta_shopify = true;
      },
    },
  });

  /*
   * ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   * ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */
  /**
   *
   */
  function generate_schema_form(data) {
    // more infos
    // https://icebob.gitbooks.io/vueformgenerator/content/installation.html
    // https://blog.rangle.io/how-to-create-data-driven-user-interfaces-in-vue/
    // https://vuejsfeed.com/blog/generate-forms-using-json-schema-and-vue-js
    // https://jsfiddle.net/mani04/5zyozvx8/
    // https://stackoverflow.com/questions/49106045/preview-an-image-before-it-is-uploaded-vuejs
    // https://github.com/vue-generators/vue-form-generator/issues/226 (
    // how to add bouton "add more" )
    // https://antonreshetov.github.io/vue-form-components/#/components/input
    // (genrateur de form beau design )
    //

    var fields = [];
    var model = {};
    var configs = defaultFieldNotDisplay();
    $.each(data, function (key, value) {
      // put filed config
      if (configs[value.name]) {
        configs[value.name] = value;
      } else if (value.type == "string") {
        fields.push({
          type: "input",
          inputType: "text",
          label: value.label,
          model: value.name,
          settings: value.settings,
        });
        model[value.name] = {
          value: "",
        };
      } else if (value.type == "boolean") {
        model[value.name] = {
          value: "",
        };
        if (value.defaults[0]) {
          if (value.defaults[0].value) {
            model[value.name] = {
              value: true,
            };
          } else {
            model[value.name] = {
              value: false,
            };
          }
        }
        fields.push({
          type: "radio",
          label: value.label,
          model: value.name,
          multi: true,
          textOn: value.settings.on_label,
          textOff: value.settings.off_label,
          settings: value.settings,
        });
      } else if (value.type == "list_string") {
        model[value.name] = {
          value: "",
        };
        fields.push({
          type: "select",
          label: value.label,
          model: value.name,
          values: value.settings.allowed_values,
          settings: value.settings,
        });
      } else if (value.type == "entity_reference") {
        if (value.settings.target_type == "taxonomy_term") {
          model[value.name] = {
            target_ids: [],
            label_term: "",
          };
          fields.push({
            type: "autocomplete",
            label: value.label,
            model: value.name,
            values: value.settings.allowed_values,
            settings: value.settings,
          });
        } else if (value.settings.target_type == "node") {
          model[value.name] = {
            target_ids: [],
            label_node: "",
            target_type: "node",
          };
          fields.push({
            type: "select_in_modal",
            label: value.label,
            model: value.name,
            values: value.settings.allowed_values,
            settings: value.settings,
          });
        }
      } else if (value.type == "image") {
        model[value.name] = {
          image_data: [],
          target_ids: [],
        };
        fields.push({
          type: "image",
          label: value.label,
          model: value.name,
          preview: true,
          multiple: {
            number: true,
            infiny: true,
          },
          settings: value.settings,
        });
      } else if (value.type == "text_long") {
        fields.push({
          type: "textarea_html",
          inputType: "text_long",
          label: value.label,
          model: value.name,
          settings: value.settings,
        });
        model[value.name] = {
          value: "", // valeur filtrer
          format: "full_html", // format
        };
      } else if (value.type == "string_long") {
        fields.push({
          type: "textarea_string",
          inputType: "string_long",
          label: value.label,
          model: value.name,
          settings: value.settings,
        });
        model[value.name] = {
          value: "",
        };
      }
    });

    return {
      fields,
      model,
    };
  }

  /**
   *
   */
  function getCsrfToken(callback) {
    jQuery.get(Drupal.url("rest/session/token")).done(function (data) {
      var csrfToken = data;
      callback(csrfToken);
    });
  }

  /**
   *
   */
  function defaultFieldNotDisplay() {
    return {
      sticky: true,
      revision_default: true,
      promote: true,
      default_langcode: true,
      content_translation_outdated: true,
      revision_log: true,
    };
  }
  /**
   *
   */
  function postEntity(
    callback2,
    csrfToken,
    entity,
    url = "/node?_format=json"
  ) {
    // console.log(entity);
    var datas;
    var headers = {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    };
    datas = JSON.stringify(entity);
    jQuery.ajax({
      url: url,
      method: "POST",
      headers: headers,
      data: datas,
      success: function (datas) {
        callback2(datas);
        console.log(datas);
      },
      error: function (error) {
        console.log("false");
        console.log(error);
      },
    });
  }

  /**
   *
   */
  function buildNode(formdatas) {
    var node = {};
    node["type"] = formdatas.settings.type;
    $.each(formdatas.model, function (index, valeur) {
      // save image
      if (valeur.image_data == "" || valeur.image_data) {
        if (valeur.target_ids.length > 0) {
          // add default alt
          $.each(valeur.target_ids, function (key, element) {
            if (valeur.target_ids[key].alt == "") {
              valeur.target_ids[key].alt = formdatas.model["title"].value;
            }
          });
          node[index] = valeur.target_ids;
        }
      }
      // save term taxonomies
      else if (valeur.label_term == "" || valeur.label_term) {
        if (valeur.target_ids.length > 0) {
          node[index] = valeur.target_ids;
        }
      }
      // save textarea
      else if ((valeur.format && valeur.format != "") || valeur.processed) {
        node[index] = [
          {
            value: valeur.processed,
            format: valeur.format,
          },
        ];
      }
      // save reference entity
      else if (valeur.label_node == "" || valeur.label_node) {
        if (valeur.target_ids && valeur.target_ids.length > 0) {
          node[index] = [
            {
              target_id: valeur.target_ids,
              target_type: valeur.target_type,
            },
          ];
        } else {
          node[index] = "";
        }
      } else {
        node[index] = valeur;
      }
    });
    return node;
  }

  /**
   *
   */
  function callback2(datas) {
    console.log("form haved save with succes");
    // console.log(datas);
  }

  /**
   * Enregistre une donnée en session.
   */
  function saveSession(key, value) {
    return Cookies.set(key, value);
  }

  /**
   * Retourne la valeur d'un cookie.
   */
  function getSession(key, defautValue = null) {
    if (defautValue === null) {
      return Cookies.get(key);
    } else {
      var result = Cookies.get(key);
      //console.log('getSession : ', result);
      if (result === undefined) {
        //console.log('getSession i.e undefined : ', result);
        saveSession(key, defautValue);
        return defautValue;
      } else {
        return result;
      }
    }
  }
  /**
   * Le format d'entre (2020-03-27 ou 27-03-2020 ) le format de retour doit
   * etre YY-MM-DD (2020-03-27)
   */
  function getDateMySql(val, hour = "23:59:59") {
    var dataiso = "";
    if (val) {
      val = val.split("-");
      if (parseInt(val[2]) > 2000) {
        if (val[2]) {
          dataiso += val[2].toString().padStart(2, "0");
        }
        if (val[1]) {
          dataiso += "-" + val[1].toString().padStart(2, "0");
        }
        if (val[0]) {
          dataiso += "-" + val[0].toString().padStart(2, "0");
        }
      } else {
        if (val[0]) {
          dataiso += val[0].toString().padStart(2, "0");
        }
        if (val[1]) {
          dataiso += "-" + val[1].toString().padStart(2, "0");
        }
        if (val[2]) {
          dataiso += "-" + val[2].toString().padStart(2, "0");
        }
      }
      return dataiso;
    }
  }

  /**
   * Le format d'entre (2020-03-27 ou 27-03-2020 ) le format de retour doit
   * etre YY-MM-DD (27-03-2020)
   */
  function getDateFrench(val, hour = "23:59:59") {
    var dataiso = "";
    if (val) {
      val = val.split("-");
      if (parseInt(val[0]) > 2000) {
        if (val[2]) {
          dataiso += val[2].toString().padStart(2, "0");
        }
        if (val[1]) {
          dataiso += "-" + val[1].toString().padStart(2, "0");
        }
        if (val[0]) {
          dataiso += "-" + val[0].toString().padStart(2, "0");
        }
      } else {
        if (val[0]) {
          dataiso += val[0].toString().padStart(2, "0");
        }
        if (val[1]) {
          dataiso += "-" + val[1].toString().padStart(2, "0");
        }
        if (val[2]) {
          dataiso += "-" + val[2].toString().padStart(2, "0");
        }
      }
      return dataiso;
    }
  }

  function getMonthInFrench(index = null) {
    var Month = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai,",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    if (index >= 0) {
      return Month[parseInt(index)];
    }
    return Month;
  }

  async function addDay(date, number_day) {
    var new_date = new Date(date);
    var day = new_date.getDate();
    new_date.setDate(day + number_day);
    return new_date;
  }

  async function convertObjectDateToMysqlDate(date = false) {
    if (!date) {
      date = new Date();
    }
    var date_string = "";
    var new_date = new Date(date);
    date_string = new_date.getFullYear();
    date_string += "-";
    date_string += (new_date.getMonth() + 1).toString().padStart(2, "0");
    date_string += "-";
    date_string += new_date.getDate().toString().padStart(2, "0");
    return date_string;
  }

  async function getDateEndMonth(date) {
    var cal_date = new Date(date);
    return new Date(cal_date.getFullYear(), cal_date.getMonth() + 1, 0);
  }

  const debug = true;

  function console_log(logs, component_debug = true) {
    if (debug && component_debug) console.log(logs);
  }
});
