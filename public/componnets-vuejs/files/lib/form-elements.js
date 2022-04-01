jQuery(document).ready(function($) {
  /**
   * input_text
   */
  Vue.component('input_text_v2', { 
    delimiters: ['${', '}'],
    props: {
      label: {
        type: [String, Boolean],
        default: "input type text"
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext"
      },
      classe: {
        type: String,
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      input: {
        type: [Object, Array],
        default: function() {
          return {
            'value': ''
          };
        }
      },
      placeholder: {
        type: [String, Number],
        default: ""
      },
    },
    template: '#form-template-input-v2',
	methods: {
      event_input: function() {
        this.$emit('ev_input', this.input.value); // by default
      }
    }
  });
  /**
   * input_text
   */
  Vue.component('input_radio_v2', {
    delimiters: ['${', '}'],
    props: {
      label: {
        type: [String, Boolean],
        default: "input type text"
      },
      id_html: {
        type: String,
        default: "edit-inputradiotext"
      },
      classe: {
        type: String,
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      input: {
        type: [Object, Array],
        default: function() {
          return {
            'value': false
          };
        }
      },
      placeholder: {
        type: [String, Number],
        default: ""
      },
    },
    template: '#form-template-radio-v2',
  });

  // component
  Vue.component('input_radio', {
    delimiters: ['${', '}'],
    props: {
      field: [Object, Array],
      model: [Object, Array],
    },
    template: '#form-template-input-radio',
    data: function() {
      return {
        name: this.field.model,
        value_on: true,
        value_off: false,
      }
    },
    computed: {
      id_html: {
        get: function() {
          // console.log(this.field);
          return 'edit-' + this.field.model
        }
      },
      id_html_off: {
        get: function() {
          // console.log(this.field);
          return 'edit-off-' + this.field.model
        }
      },
    },
  });

  /**
   * input_select
   */
  Vue.component('input_select_v2', {
    delimiters: ['${', '}'],
    props: {
      label: {
        type: String,
        default: "input type text"
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext"
      },
      classe: {
        type: String,
        default: ""
      },
      input: {
        type: [Object, Array],
        default: function() {
          return {
            'value': ''
          };
        }
      },
      size_option: {
        type: [Number, String],
        default: 0
      },
      show_empty_option: {
        type: [Boolean],
        default: true
      },
      options: {
        type: [Object, Array],
        default: function() {
          return {
            'val1': 'option 1',
            'val2': 'option 2',
            'valn': 'option n'
          };
        }
      }
    },
    template: '#form-template-select-v2',
    methods: {
      event_input: function() {
        this.$emit('ev_input', this.input.value); // by default
      }
    }
  });

  /**
   * input_select
   */
  Vue.component('input_radios_v2', {
    delimiters: ['${', '}'],
    props: {
      label: {
        type: String,
        default: "input type text"
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext"
      },
      classe: {
        type: String,
        default: ""
      },
      name: {
        type: String,
        default: "input_radio"
      },
      input: {
        type: [Object, Array],
        default: function() {
          return {
            'value': ''
          };
        }
      },
      size_option: {
        type: [Number, String],
        default: 0
      },
      show_empty_option: {
        type: [Boolean],
        default: true
      },
      options: {
        type: [Object, Array],
        default: function() {
          return {
            'val1': 'Oui',
            'val2': 'Non'
          };
        }
      }
    },
    template: '#form-template-radios-v2',
    methods: {
      event_input: function() {
        this.$emit('ev_input', this.input.value); // by default
      },
      generate_radio: function(index) {
        index = index.replace(/[^a-zA-Z 0-9]+/g, '');
        return 'radio' + index;
      }
    }
  });


  // / textarea_html
  Vue.component('input_textarea_html', {
    delimiters: ['${', '}'],
    props: {
      label: {
        type: String,
        default: "input type text"
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext"
      },
      name: [Object, Array],
    },
    template: '#form-template-textarea-html',
    data: function() {
      return {}
    },
  });

  // / textarea_html
  Vue.component('input_textarea_string', {
    delimiters: ['${', '}'],
    props: {
      label: {
        type: String,
        default: "input type text"
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext"
      },
      name: [Object, Array],
    },
    template: '#form-template-textarea-string',
    data: function() {
      return {}
    },
    methods: {
      event_input: function() {
        this.$emit('ev_input', this.name.value); // by default
      }
    }
  });

  /**
   * Le format de l'input doit etre en Anglais.
   * Component input_datepickere. Format d'entre FR ou AN (2020-04-15 ou
   * 15-04-2020). Format afficher FR (15-04-2020). Format retourner AN
   * (2020-04-15) __ fontionne à la selection.
   */
  Vue.component('input-datepicker-v2', {
    delimiters: ['${', '}'],
    props: {
      label: {
        type: String,
        default: "input type text"
      },
      id_html: {
        type: String,
        default: "edit-inputtypetext"
      },
      input: {
        type: [Object, Array],
        default: function() {
          return {
            'value': ''
          };
        }
      },
      formatdate: {
        type: String,
        default: "dd-mm-yy"
      },
      /**
       * permet de determiner si la date à changer via la saisie ou via un
       * select sur le calendar.
       */
      // date_change_par_saisie: true,
    },
    template: '#form-template-input-datepicker-2',
    data: function() {
      return {
        /**
         *
         */
        typingTimer: null,
        doneTypingInterval: 1200,

      };
    },
    mounted: function() {
      var self = this;
      /**
       * Ajoute le plugin calendar à l'input.
       */
      $('#' + self.id_html).datepicker({
        dateFormat: self.formatdate,
        onSelect: function(currentDate, obj) {
          var month = (obj.currentMonth + 1).toString().padStart(
            2, '0');
          var DateInEN = obj.currentYear + '-' + month + '-' +
            obj.currentDay;
          self.$emit('input', DateInEN);
          /**
           * Date un format anglais
           */
          self.input.value = DateInEN;
        },

      });
      /**
       * pour afficher la calendrier si on clique sur l'icone calendar.
       */
      $('#trigger-' + self.id_html).click(function() {
        if ($('#' + self.id_html).datepicker("widget").is(
            ":visible")) {
          $('#' + self.id_html).datepicker("hide");
        } else {
          console.log('is hidden');
          $('#' + self.id_html).datepicker("show");
        }
      });
      // self.waitUserTyping();
    },
    methods: {
      /**
       * permet de formater la sortie, apres quelques secondes.
       *
       */
      waitUserTyping: function() {
        var self = this;
        $('#' + self.id_html).keyup(function() {
          clearTimeout(self.typingTimer);
          if ($('#' + self.id_html).val()) {
            self.typingTimer = setTimeout(doneTyping, self.doneTypingInterval);
          }
        });
        // user is "finished typing," do something
        function doneTyping() {
          // do something
          console.log('saisie ok');
          // self.input.value = getDateMySql(self.input.value);
        }
      }
    },
    computed: {
      id_html_trigger: {
        get: function() {
          return 'trigger-' + this.id_html;
        }
      },
      set_date_first: {
        get: function() {
          /**
           * Formate la sortie instantatement
           */
          //console.log('donnée fournie :: ', this.input.value);
          return getDateFrench(this.input.value);
          // return this.input.value;
        },
        /**
         * Lors de la saisie, copier/coller des données directement dans
         * l'input. On recupere le contenue on format en Anglais et on MAJ
         * this.input.value.
         */
        set: function(newValue) {
          var self = this;
          //console.log('Saisie donnée : ', newValue);
          /**
           * Si le contenu est vide
           */
          if (newValue == '') {
            self.input.value = '';
          }
          /**
           * Si le contenu n'est pas vide. on formate le contenu avec un
           * delai.
           */
          $('#' + self.id_html).keyup(function() {
            clearTimeout(self.typingTimer);
            if (newValue) {
              self.typingTimer = setTimeout(doneTyping, self.doneTypingInterval);
            }
          });
          // user is "finished typing," do something
          function doneTyping(newValue) {
            var newValue = $('#' + self.id_html).val();
            // console.log('saisie ok :: ', newValue);
            self.input.value = getDateMySql(newValue);
          }
        }
      }
    },
  });
  /**
   * Enregistre une donnée en session.
   */
  function saveSession(key, value) {
    return Cookies.set(key, value);
  }

  /**
   * Retourne la valeur d'un cookie.
   */
  function getSession(key) {
    return Cookies.get(key);
  }
  /**
   * Le format d'entre (2020-03-27 ou 27-03-2020 ) le format de retour doit
   * etre YY-MM-DD (2020-03-27)
   */
  function getDateMySql(val, hour = '23:59:59') {
    var dataiso = '';
    if (val) {
      val = val.split('-');
      if (parseInt(val[2]) > 2000) {
        if (val[2]) {
          dataiso += val[2].toString().padStart(2, '0');
        }
        if (val[1]) {
          dataiso += '-' + val[1].toString().padStart(2, '0');
        }
        if (val[0]) {
          dataiso += '-' + val[0].toString().padStart(2, '0');
        }
      } else {
        if (val[0]) {
          dataiso += val[0].toString().padStart(2, '0');
        }
        if (val[1]) {
          dataiso += '-' + val[1].toString().padStart(2, '0');
        }
        if (val[2]) {
          dataiso += '-' + val[2].toString().padStart(2, '0');
        }
      }
      return dataiso;
    }
  }

  /**
   * Le format d'entre (2020-03-27 ou 27-03-2020 ) le format de retour doit
   * etre YY-MM-DD (27-03-2020)
   */
  function getDateFrench(value, hour = '23:59:59') {
    var dataiso = '';
    if (value) {
      val = value.split('-');
      if (val.length == 3) {
        if (parseInt(val[0]) > 2000) {
          if (val[2]) {
            dataiso += val[2].toString().padStart(2, '0');
          }
          if (val[1]) {
            dataiso += '-' + val[1].toString().padStart(2, '0');
          }
          if (val[0]) {
            dataiso += '-' + val[0].toString().padStart(2, '0');
          }
        } else {
          if (val[0]) {
            dataiso += val[0].toString().padStart(2, '0');
          }
          if (val[1]) {
            dataiso += '-' + val[1].toString().padStart(2, '0');
          }
          if (val[2]) {
            dataiso += '-' + val[2].toString().padStart(2, '0');
          }
        }
        return dataiso;
      }
    }
    return value;
  }

  function getMonthInFrench(index = null) {
    var Month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai,', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    if (index >= 0) {
      return Month[parseInt(index)];
    }
    return Month;
  }

  function addDay(date, number_day) {
    var new_date = new Date(date);
    var day = new_date.getDate();
    new_date.setDate(day + number_day);
    return new_date;
  }

  function convertObjectDateToMysqlDate(date = false) {
    if (!date) {
      date = new Date();
    }
    var date_string = '';
    var new_date = new Date(date);
    date_string = new_date.getFullYear();
    date_string += '-';
    date_string += (new_date.getMonth() + 1).toString().padStart(2, '0');
    date_string += '-';
    date_string += (new_date.getDate()).toString().padStart(2, '0');
    return date_string;
  }
});
