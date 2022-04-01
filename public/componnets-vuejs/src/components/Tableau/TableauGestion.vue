<!-- tableau -->
<template>
  <div class="tables">
    <div class="bs-example widget-shadow">
      <h4 v-if="show_title">{{ table_title }}</h4>
      <table class="table table-striped" v-if="table_actif">
        <thead v-if="show_header" class="thead-light">
          <tr>
            <th v-if="show_action && !display_position_left">
              <component
                v-bind:is="template_tableau_action_header"
                :lignes="rows"
                @ev_template_tableau_action_header="
                  action_ev_template_tableau_action_header
                "
              ></component>
            </th>
            <th v-if="show_id">#</th>
            <th
              v-for="(colonne, index) in headers"
              :key="index"
              :class="buildClass_TD(index, true)"
            >
              {{ renderHeader(colonne) }}
            </th>
            <th v-if="show_action && display_position_left">#Action</th>
          </tr>
        </thead>
        <tfoot v-if="show_footer" class="thead-light">
          <tr>
            <th
              v-for="(footer, index_footer) in footers_build()"
              :key="index_footer"
              :colspan="footer.colspan"
            >
              {{ footer.label }}
            </th>
            <th v-if="show_action"></th>
          </tr>
        </tfoot>
        <tbody v-if="numberlevel() == 'array' && align_header" align="entete">
          <tr
            v-for="(colonnes, index) in rows"
            :class="buildClass_TR(colonnes)"
            :key="index"
          >
            <td v-if="show_action && !display_position_left">
              <component
                v-bind:is="template_tableau_action"
                :ligne="colonnes"
                :datas_receive="datas_receive"
                @ev_template_tableau_action="action_ev_template_tableau_action"
              ></component>
            </td>
            <td v-if="show_id">
              <span
                v-if="action.drap"
                class="text-info btn-sm pt-0 pl-0"
                @click="move(index)"
                ><i class="fas fa-expand-arrows-alt"></i
              ></span>
              <span class="pr-2 text-muted d-inline-block">{{
                renderIndex(index)
              }}</span>
            </td>
            <td
              v-for="(colonne, key) in headers"
              v-html="colonnes[key]"
              :class="buildClass_TD(key, true, colonnes)"
              :key="key"
            ></td>
            <td v-if="show_action && display_position_left">
              <!-- le template `template_tableau_action` doit son actionau tableau via ev_template_tableau_action, au niveau du tableau,la function action_ev_template_tableau_action emet au parent du tableau via `ev_action_ev_template_tableau_action`.-->
              <component
                v-bind:is="template_tableau_action"
                :ligne="colonnes"
                @ev_template_tableau_action="action_ev_template_tableau_action"
              ></component>
              <component
                v-bind:is="template_tableau_action_v2(colonnes)"
                :ligne="colonnes"
                @ev_template_tableau_action="action_ev_template_tableau_action"
              ></component>
            </td>
          </tr>
        </tbody>
        <tbody v-if="numberlevel() == 'array' && align_header === 'false'">
          <tr
            v-for="(colonnes, index) in rows"
            @click="select_and_close(index)"
            :key="index"
          >
            <td>
              <span
                v-if="action.drap"
                class="text-info btn-sm pt-0 pl-0"
                @click="move(index)"
                ><i class="fas fa-expand-arrows-alt"></i
              ></span>
              <span class="pr-2 text-muted d-inline-block">{{ index }}</span>
            </td>
            <td v-for="(colonne, key) in colonnes" :key="key">
              {{ key }} : {{ colonne }}
            </td>
            <td v-if="show_action">
              <span
                v-if="action.update"
                class="text-info btn-sm pt-0 pl-0"
                @click="modifier(index)"
                ><i class="far fa-edit"></i
              ></span>
              <span
                v-if="action.delete"
                class="text-danger btn-sm pt-0 pl-0"
                @click="supprimer(index)"
                ><i class="far fa-trash-alt"></i
              ></span>
              <span
                v-if="action.move"
                class="text-primary btn-sm pt-0 pl-0"
                @click="move_to_top(index)"
                data-original-title="activé / restorer"
                title="activé / restorer"
                data-toggle="tooltip"
                ><i class="fas fa-arrows-alt-v"></i
              ></span>
              <div
                class="dropdown "
                :id="dropdowncustom(index)"
                v-if="action.update"
              >
                <div class="dropdown-menu">
                  <prepareform_table
                    :datas="colonnes"
                    :identifiant="index"
                    @ev_close_dropdown="close_dropdown"
                  ></prepareform_table>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="numberlevel() == 'string'">
          <tr
            v-for="(colonnes, index) in rows"
            @click="select_and_close(index)"
            :key="index"
          >
            <td>
              <span class="pr-2 text-muted d-inline-block">{{ index }}</span>
              <span
                v-if="show_action"
                class="text-info btn-sm pt-0 pl-0"
                @click="move(index)"
                ><i class="fas fa-expand-arrows-alt"></i
              ></span>
            </td>
            <td>{{ colonnes }}</td>
            <td v-if="show_action">
              <span class="text-info btn-sm pt-0 pl-0" @click="modifier(index)"
                ><i class="far fa-edit"></i
              ></span>
              <span
                class="text-danger btn-sm pt-0 pl-0"
                @click="supprimer(index)"
                ><i class="far fa-trash-alt"></i
              ></span>
              <span
                class="text-primary btn-sm pt-0 pl-0"
                @click="move_to_top(index)"
                data-original-title="activé / restorer"
                title="activé / restorer"
                data-toggle="tooltip"
                ><i class="fas fa-arrows-alt-v"></i
              ></span>
            </td>
          </tr>
        </tbody>
      </table>
      <component
        v-bind:is="template_footer"
        @ev_savedatas="savedatas"
      ></component>
    </div>
    <!-- <waitingload_multibuoule :waitingload="waitingload"></waitingload_multibuoule> -->
    <div v-if="show_empty_message" class="alert alert-info mt-3" role="alert">
      {{ empty_message }}
    </div>
  </div>
</template>
<script>
/**
 * jequery doit etre definie;
 */
var $;
if (window.jQuery) {
  $ = window.jQuery;
} else if (window.$) {
  $ = window.$;
}
export default {
  name: "TableauGestion",
  props: {
    rows: {
      type: [Object, Array]
    },
    headers: {
      type: [Object, Array]
    },
    footers: {
      type: [Object, Array]
    },
    show_header: {
      type: Boolean,
      default: true
    },
    show_footer: {
      type: Boolean,
      default: true
    },
    show_action: {
      type: Boolean,
      default: false
    },
    table_footer_actif: {
      type: Boolean,
      default: false
    },
    waitingload: {
      type: Boolean,
      default: false
    },
    show_title: {
      type: Boolean,
      default: false
    },
    show_reel_index: {
      type: Boolean,
      default: true
    },
    table_title: {
      type: String,
      default: ""
    },
    template_footer: {
      type: String,
      default: ""
    },
    align_header: {
      type: Boolean,
      default: false
    },
    empty_message: {
      type: String,
      default: "Aucun contenu disponible"
    },
    model: [Object, Array],
    fields: [Object, Array],
    field: [Object, Array],
    show_id: {
      type: Boolean,
      default: true
    },
    template_tableau_action: {
      type: String,
      default: ""
    },
    template_tableau_action_header: {
      type: String,
      default: ""
    },
    datas_receive: [Object, Array, String],
    display_position_left: {
      type: Boolean,
      default: true
    },
    action: {
      type: [Object, Array],
      default: function() {
        return {
          update: false,
          delete: false,
          move: false,
          drap: false
        };
      }
    }
  },
  data: function() {
    return {
      arrayStructure: {
        type: ""
      },
      aleatoirevalue: Math.floor(Math.random() * 99),
      key: 0
    };
  },
  methods: {
    /**
     * permet de transmettre les données au parent, id en dehors du tableau
     */
    action_ev_template_tableau_action: function(datas) {
      this.$emit("ev_action_ev_template_tableau_action", datas);
    },
    action_ev_template_tableau_action_header: function(datas) {
      this.$emit("ev_action_ev_template_tableau_action_header", datas);
    },
    move: function(index) {
      console.log("move : " + index);
      // this.$emit('ev_move', {'index':index, lignes:this.rows});
    },
    modifier: function(index) {
      //console.log('modifier : ' + index);
      var id = "dp" + index + "-" + this.aleatoirevalue;
      //console.log(id);
      $("#" + id).toggleClass(" open ");
    },
    supprimer: function(index) {
      console.log("supprimer : " + index);
      this.$emit("ev_delete", index);
    },
    move_to_top: function(index) {
      console.log("move_to_top : " + index);
      this.$emit("ev_restore", index);
    },
    numberlevel: function() {
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
    select_and_close: function(index) {
      if (this.arrayStructure.type == "string") {
        this.model[this.field.model].target_ids = index;
        this.model[this.field.model].label_node = this.rows[index];
        // close modal
        $("#modal-" + this.field.model).modal("hide");
      }
    },
    savedatas: function() {
      console.log(" execute savedatas : tableau_gestion");
      this.$emit("ev_savedatas", this.rows);
    },
    dropdowncustom: function(index) {
      return "dp" + index + "-" + this.aleatoirevalue;
    },
    close_dropdown: function(params) {
      console.log(params);
      $("#dp" + params + "-" + this.aleatoirevalue).removeClass("open");
    },
    renderHeader: function(index) {
      // console.log('col header');
      // console.log(index);
      if (index instanceof Array || index instanceof Object) {
        return index.label;
      }
      return index;
    },
    renderIndex: function(index) {
      if (this.show_reel_index) {
        return index;
      }
      console.log(this.key);
      // this.key=this.key + 1;
      return this.key;
    },
    buildClass_TR: function(row) {
      var classe = "";
      // console.log(' buildClass : ');
      // console.log(this.headers);
      $.each(this.headers, function(i, f) {
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
    buildClass_TD: function(index, header = false, colonne = []) {
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
    footers_build: function() {
      // console.log('build footers');
      var self = this;
      console.log(self.footers);
      var colSpan = 1,
        empty = 1,
        new_footers = {};
      $.each(self.headers, function(i) {
        if (self.footers[i]) {
          colSpan = 0;
          new_footers[i] = {};
          new_footers[i] = {
            label: self.footers[i].label,
            colspan: colSpan
          };
          empty += 1;
        } else {
          colSpan += 1;
          new_footers["empty" + empty] = {};
          new_footers["empty" + empty] = {
            label: "",
            colspan: colSpan
          };
        }
      });

      console.log(new_footers);
      return new_footers;
    },
    create_invoice: function(index, plateforme) {
      // console.log(index);
      this.$emit("ev_create_invoice", {
        id_order: index,
        plateforme: plateforme
      });
    },
    text_before: function(colonnes) {
      // console.log(colonnes);
      var textShow = "";
      if (colonnes.qb_doc_number) {
        textShow += " F ";
      }
      if (colonnes.qb_payment_number) {
        textShow += " P ";
      }
      if (colonnes.qb_doc_number_test) {
        textShow += " F ";
      }
      if (colonnes.qb_payment_number_test) {
        textShow += " P ";
      }
      if (parseInt(colonnes.qb_voided)) {
        textShow += ' <span class="text-danger">A</span> ';
      }
      if (parseInt(colonnes.qb_voided_test)) {
        textShow += ' <span class="text-danger">A</span> ';
      }
      return textShow;
    },
    /**
     * permet de fournit un template unique #action pour charque ligne
     */
    template_tableau_action_v2(row) {
      //console.log('ligne du tableau : ', row);
      if (row.custom_template_ligne && row.custom_template_ligne !== "") {
        return row.custom_template_ligne;
      }
      return "";
    }
  },
  computed: {
    // hide table if header or body is empty
    table_actif: {
      get: function() {
        if (
          (this.headers && Object.keys(this.headers).length > 0) ||
          (this.rows && Object.keys(this.rows).length > 0)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    show_empty_message: {
      get: function() {
        if (
          (this.headers && Object.keys(this.headers).length > 0) ||
          (this.rows && Object.keys(this.rows).length > 0)
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "/siteweb/PluginsModules/stephane888/wbu-components/scss/style.scss";
</style>
