jQuery(document).ready(function($) {
  /**
   *  --
   */
  Vue.component("createorder", {
    delimiters: ["${", "}"],
    props: {
      modal_body: {
        type: [Object, Array, String, Number],
        default: function() {
          return {
            update: false,
            delete: false,
            move: false,
            drap: false
          };
        }
      },
      show_save: {
        type: Boolean,
        default: true
      },
      // action button
      // show_add:{type: Boolean,default: true,},
      doaction: [Object, Array, String, Number],
      titre_modal: [Object, Array, String, Number]
    },
    data: function() {
      return {
        /**
         *
         */
        modedebug: -1,
        /**
         * Alert message
         */
        alert_message_static: "",
        show_alert_static: false,
        alert_attribut_class_static: "alert-primary",
        /**
         *
         */
        token_url_refresh: null,
        /**
         *
         */
        invoice: {},
        invoice_result: {},
        salereceipt: {},
        salereceipt_result: {},
        cart_header: {
          sku: "Sku",
          price: "Prix",
          qty: "Quantité",
          ttc: "Montent TTC"
        },
        cart_array: [],
        sub_ttc: false,
        sub_discount: false,
        sub_shipping_total: false,
        sub_total: false,
        discount: {},
        order_bd: {},
        status_invoice: false,
        status_payment: false,
        id_invoice: null,
        /**
         * payment
         */
        payments: {},
        /**
         * account
         */
        account: {},
        /**
         *
         */
        flux: 0,
        querys: 0,
        /**
         *
         */
        accordions: [],
        /**
         * Message d'erreur supplementaire
         */
        error_message: "",
        alert_template: "",
        /**
         *
         */
        all_datas_form_cart: {},
        show_void_invoice: false,
        show_text_void: false,
        show_create_invoice: false,
        /**
         * Compte QB actif;
         */
        current_compagny: "",
        /**
         * mode dev
         */
        dev_evolution: "stable",
        /**
         * Customer_account
         */
        customer_account_shopify: false,
        customer_account_amazon: false,
        SalesTermRef: false,
        DepositToAccountRef_compte_principal: false,
        DepositToAccountRef_compte_paypal: false,
        ModeCalculDiscountGlobal: false,
        use_next_code_DocNumber: 0
      };
    },
    mounted: function() {
      if (!this.token_url_refresh) {
        var event = $(".modal-header");
        this.get_token(event);
      }
      /**
       * Get mode
       */
      this.modedebug = parseInt(getSession("createorder_modedebug", -1));
      console.log("init this.modedebug ", this.modedebug);
    },
    template: "#template-createorder",
    watch: {
      doaction: function() {
        // applique la configurationen function de la compagny QB.
        this.appliConfig();
        this.cart_array = [];
        this.account = {};
        this.getCart();
        this.resetFields();
        // console.log('datas to send or config : ', this.modal_body);
        // console.log('get_modedebug : ', this.get_modedebug);
      }
    },
    methods: {
      appliConfig: function() {
        /**
         * get current compte QB.
         */
        var current_compagny = this.modal_body.current_compagny;
        if (current_compagny) {
          this.current_compagny = current_compagny;
        }

        if (this.current_compagny == "9130347038344016") {
          this.customer_account_shopify = 100;
          this.customer_account_amazon = 101;
          this.SalesTermRef = 5; // 3;
          this.DepositToAccountRef_compte_principal = 66;
          this.DepositToAccountRef_compte_paypal = 102;
          this.ModeCalculDiscountGlobal = true;
        }
        //
        var dev_evolution = getSession("dev_evolution");
        if (dev_evolution && this.current_compagny != "9130347044451506") {
          this.dev_evolution = dev_evolution;
        }
      },
      resetFields: function() {
        this.alert_message_static = "";
        this.show_alert_static = false;
        this.invoice = {};

        this.discount = {};
        this.order_bd = {};
        this.status_invoice = false;
        this.payments = {};
        this.flux = 0;
        this.querys = 0;
        this.accordions = [];
        this.all_datas_form_cart = {};
      },
      create_invoice: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "create_invoice"));
      },
      create_invoice_test: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "create_invoice_test"));
      },
      create_customer_test: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "create_customer_test"));
      },
      create_customer: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        console.log("execution create_customer");
        this.execute_action(event, datas, (action = "create_customer"));
      },
      update_customer_test: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "update_customer_test"));
      },
      update_customer: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "update_customer"));
        console.log("execution update_customer");
      },
      create_invoice_andpayement_test: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(
          event,
          datas,
          (action = "create_invoice_andpayement_test")
        );
      },
      create_invoice_all: function() {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "create_invoice_all"));
      },
      create_invoice_all_next_code_facture: function() {
        this.resetFields();
        var datas = this.modal_body;
        this.use_next_code_DocNumber++;
        datas.use_next_code_DocNumber = this.use_next_code_DocNumber;
        conssole.log("Execution create_invoice_all_next_code_facture");

        this.execute_action(
          event,
          datas,
          (action = "create_invoice_all_next_code_facture")
        );
        /**/
      },

      test_invoice: function() {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "test_invoice"));
      },
      create_salereceipt: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "create_salereceipt"));
      },
      get_token: function(event) {
        var datas = {};
        var DatasReturn = this.execute_action(
          event,
          datas,
          (action = "get_token"),
          false,
          (asyn = true),
          (displayMassage = false)
        );
        if (DatasReturn.results) {
          this.token_url_refresh = DatasReturn.results;
        } else {
          console.log("error token");
        }
      },
      getInvoice: function() {
        var datas = this.modal_body;
        var event = {
          target: $("#model-create-invoice .modal-header")
        };
        this.execute_action(
          event,
          datas,
          (action = "get_invoice"),
          (asyn = true),
          (displayMassage = false)
        );
      },
      getCart: function() {
        var datas = this.modal_body;
        this.show_void_invoice = false;
        this.$emit("ev_loading_header", {status: true, loading: true});
        var event = {
          //target: $('#model-create-invoice .modal-header'),
        };
        this.execute_action(
          event,
          datas,
          (action = "get_cart"),
          (asyn = true),
          (displayMassage = false)
        );
        //
      },
      valider_payment: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "valide_payment"));
      },
      valider_payment_test: function(event) {
        this.resetFields();
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "valider_payment_test"));
      },
      void_invoice: function() {
        var self = this;
        /**
         * add status commande and id facture
         */
        console.log(self.all_datas_form_cart);
        if (self.all_datas_form_cart.cart) {
          this.modal_body["dafault"] = {};
          this.modal_body["dafault"]["id_invoice"] =
            self.all_datas_form_cart.id_invoice;
          this.modal_body["dafault"]["status_invoice"] =
            self.all_datas_form_cart.status_invoice;
        }
        this.resetFields();
        console.log(this.modal_body);
        var datas = this.modal_body;
        this.execute_action(event, datas, (action = "void_invoice"));
      },
      execute_action: function(
        event,
        datas,
        action = "get_invoice",
        asyn = true,
        displayMassage = true
      ) {
        var self = this;
        var DatasReturn = null;
        // display syn
        // console.log('Load content AJAX : '+action);

        if (event && event.target) {
          $(".fa-sync", event.target).removeClass("d-none");
          $(event.target).attr("disabled", "true");
        }

        var headers = {
          "Content-Type": "application/json",
          "X-CSRF-Token": action,
          "X-CSRF-ValueType": self.metafileds_type_field,
          "X-CSRF-Endpoints": self.EndPoints_save,
          Accept: "application/json"
        };
        // console.log(datas);
        var url = "/quickbookstest/quickbook.php";
        var datas_tempon = datas;
        /**
         * Ajout de l'id du compte.
         */
        // datas['current_compagny'] = self.current_compagny;
        datas["customer_account_shopify"] = self.customer_account_shopify;
        datas["customer_account_amazon"] = self.customer_account_amazon;
        datas["SalesTermRef"] = self.SalesTermRef;
        datas["DepositToAccountRef_compte_principal"] =
          self.DepositToAccountRef_compte_principal;
        datas["DepositToAccountRef_compte_paypal"] =
          self.DepositToAccountRef_compte_paypal;
        datas["ModeCalculDiscountGlobal"] = self.ModeCalculDiscountGlobal;
        datas["dev_evolution"] = self.dev_evolution;
        // console.log('Configs QB to send : ', datas);
        datas = JSON.stringify(datas);
        jQuery.ajax({
          url: url,
          method: "POST",
          headers: headers,
          data: datas,
          async: asyn,
          success: function(data) {
            $(".fa-sync", event.target).addClass("d-none");
            $(event.target).removeAttr("disabled");
            self.alert_template = "";
            self.use_next_code_DocNumber = 0;
            console.log("Result. : ", data);
            self.$emit("ev_loading_header", {status: true, loading: false});
            {
              DatasReturn = data;

              if (data.invoice) {
                self.invoice = data.invoice;
              } else if (data.salereceipt) {
                self.salereceipt = data.salereceipt;
              }

              if (data.salereceipt_result) {
                self.salereceipt_result = data.salereceipt_result;
                if (data.salereceipt_result.Fault) {
                  self.errorAjax(data.salereceipt_result, "alert-warning");
                } else {
                  self.successAjax(" <strong>Réçu crée</strong> ");
                }
              } else if (data.invoice_result || data.payments_result) {
                var invoice = false;
                var payement = false;
                var message = "";
                var classe = "alert-success";
                self.invoice_result = data.invoice_result;
                var message = "";
                var check_invoice = false;

                if (data.invoice_result && data.invoice_result.Invoice) {
                  check_invoice = true;
                  self.status_invoice = data.status_invoice;
                  invoice = {
                    ref: data.invoice_result.Invoice.DocNumber
                  };
                  if (
                    self.status_invoice == "SUCCESS" ||
                    self.status_invoice == "TEST"
                  ) {
                    if (self.status_invoice == "TEST") {
                      message +=
                        ' <strong class="d-block">Mode test : simulation</strong> ';
                    }
                    message +=
                      ' <strong class="d-block">Facture crée , Reference : ' +
                      data.invoice_result.Invoice.DocNumber +
                      "</strong> ";
                    self.add_txt_link(
                      self.modal_body.id_order,
                      data.invoice_result.Invoice.Id
                    );

                    self.accordions.push({
                      title: "Facture, flux envoyé",
                      body: data.invoice_send
                    });
                    self.accordions.push({
                      title: "Facture, flux retourné",
                      body: data.invoice_result
                    });
                  } else if (self.status_invoice == "UPDATE") {
                    classe = "alert-warning";
                    self.accordions.push({
                      title: "Facture, flux envoyé",
                      body: data.invoice_send
                    });
                    message +=
                      ' <strong class="d-block">La facture existe déjà, Reference : ' +
                      data.invoice_result.Invoice.DocNumber +
                      "</strong> ";
                  } else if (self.status_invoice == "display_json") {
                    message +=
                      ' <strong class="d-block"> Facture JSON </strong> ';
                    self.accordions.push({
                      title: "Facture JSON ",
                      body: data.invoice_result
                    });
                  } else {
                    classe = "alert-warning";
                    message +=
                      ' <strong class="d-block "> La facture n\'a pas été crée </strong> ';
                  }
                }
                if (data.payments_result && data.payments_result.Payment) {
                  self.status_payment = data.status_payment;
                  payement = {
                    ref: data.payments_result.Payment.PaymentRefNum
                  };
                  if (
                    self.status_payment == "SUCCESS" ||
                    self.status_payment == "TEST"
                  ) {
                    if (self.status_payment == "TEST") {
                      message +=
                        ' <strong class="d-block">Mode test : simulation</strong> ';
                    }
                    message +=
                      ' <strong class="d-block">Paiement crée, Reference : ' +
                      data.payments_result.Payment.PaymentRefNum +
                      "</strong> ";
                    self.add_txt_link(
                      self.modal_body.id_order,
                      null,
                      data.payments_result.Payment.Id
                    );

                    if (!check_invoice) {
                      self.accordions.push({
                        title: "Payement, flux envoyé",
                        body: data.payment_send
                      });
                      self.accordions.push({
                        title: "Payement, flux retourné",
                        body: data.payments_result
                      });
                    }
                  } else if (self.status_payment == "UPDATE") {
                    classe = "alert-warning";
                    message +=
                      ' <strong class="d-block">Le paiement existe déjà, Reference : ' +
                      data.payments_result.Payment.PaymentRefNum +
                      "</strong> ";
                    if (!check_invoice) {
                      self.accordions.push({
                        title: "Payement, flux envoyé",
                        body: data.payment_send
                      });
                    }
                  } else {
                    classe = "alert-warning";
                    message +=
                      ' <strong class="d-block"> Le paiement n\'a pas été crée </strong> ';
                  }
                }
                //display link_example
                if (
                  data.invoice_result &&
                  data.invoice_result.Invoice &&
                  data.payments_result &&
                  data.payments_result.Payment
                ) {
                  self.add_txt_link(
                    self.modal_body.id_order,
                    data.invoice_result.Invoice.Id,
                    data.payments_result.Payment.Id
                  );
                }
                self.$emit("ev_modal_simple", {
                  order: datas_tempon,
                  invoice: invoice,
                  payement: payement
                });
                self.successAjax(message, true, classe);
              } else if (data.buildCart) {
                self.all_datas_form_cart = data.buildCart;
                if (
                  self.all_datas_form_cart &&
                  self.all_datas_form_cart.id_invoice
                ) {
                  self.show_create_invoice = false;
                  var qb_voided = parseInt(
                    self.all_datas_form_cart.order_bd.qb_voided
                  );
                  if (!qb_voided) {
                    self.show_void_invoice = true;
                  } else {
                    self.show_text_void = true;
                  }
                } else {
                  self.show_create_invoice = true;
                }

                if (
                  (data.cart_order &&
                    data.cart_order.admin_graphql_api_id &&
                    data.cart_order.line_items) ||
                  data.buildCart["cart"]
                ) {
                  self.cart_array = data.buildCart["cart"];
                  // console.log(data.buildCart);
                  self.discount = data.buildCart["discount"];
                  self.order_bd = data.buildCart["order_bd"];
                  if (data.buildCart) {
                    self.sub_ttc = data.buildCart.sub_ttc;
                    self.sub_discount = data.buildCart.sub_discount;
                    self.sub_shipping_total = data.buildCart.sub_shipping_total;
                    self.sub_total = data.buildCart.sub_total;
                  }
                } else {
                  var cart = [];
                  $.each(data.cart_order, function(j, l) {
                    var subCart = {
                      sku: l.SELLER_SKU,
                      price: l.TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL,
                      qty: l.QTY
                    };
                    cart.push(subCart);
                  });
                  self.cart_array = cart;
                }
                if (data.buildCart.account) {
                  /**
                   * commande :WithinFrance 1067126390850
                   * commande :OutsideFranceWithEU
                   * 1083080736834 1084228108354
                   */
                  if (
                    data.buildCart.account.TransactionLocationType ==
                    "WithinFrance"
                  ) {
                    data.buildCart.account.TransactionLocationType = "France";
                    self.account = data.buildCart.account;
                  } else if (
                    data.buildCart.account.TransactionLocationType ==
                    "FranceOverseas"
                  ) {
                    data.buildCart.account.TransactionLocationType = "DOM-TOM";
                    self.account = data.buildCart.account;
                  } else if (
                    data.buildCart.account.TransactionLocationType ==
                    "OutsideFranceWithEU"
                  ) {
                    data.buildCart.account.TransactionLocationType = "UE";
                    self.account = data.buildCart.account;
                  } else if (
                    data.buildCart.account.TransactionLocationType ==
                    "OutsideEU"
                  ) {
                    data.buildCart.account.TransactionLocationType =
                      "INTERNATIONAL";
                    self.account = data.buildCart.account;
                  }
                }
                // console.log(data.buildCart.account);
              } else if (data.cart_order) {
                // if shopify
                var cart = [];
                if (
                  data.cart_order.admin_graphql_api_id &&
                  data.cart_order.line_items
                ) {
                  $.each(data.cart_order.line_items, function(j, l) {
                    var subCart = {
                      sku: l.sku,
                      price: l.price,
                      qty: l.quantity
                    };
                    cart.push(subCart);
                  });
                } else {
                  $.each(data.cart_order, function(j, l) {
                    var subCart = {
                      sku: l.SELLER_SKU,
                      price: l.TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL,
                      qty: l.QTY
                    };
                    cart.push(subCart);
                  });
                }
                self.cart_array = cart;
              } else if (data.payments) {
                self.payments = data.payments;
                self.successAjax(
                  " <strong>JSON du payment generé, creation désactiver</strong> ",
                  displayMassage
                );
              } else if (data.VoidInvoice) {
                self.successAjax(
                  " <strong>Facture annulé</strong> ",
                  displayMassage
                );
                self.accordions.push({
                  title: "Facture, flux",
                  body: data.VoidInvoice
                });
                self.$emit("ev_modal_simple", {
                  order: datas_tempon,
                  void_invoice: 1
                });
                self.show_text_void = false;
              } else {
                self.successAjax(
                  " <strong>Données sauvergardés avec succes</strong> ",
                  displayMassage
                );
              }
            }
          },
          error: function(error) {
            console.log(error);
            self.$emit("ev_loading_header", {status: false, loading: false});
            if (error.status) {
              if (error.status == 610) {
                self.error_message = "";
                self.alert_template = "button_add_client";
              } else if (error.status == 611) {
                self.error_message = "";
                self.alert_template = "button_next_code";
              } else {
                self.alert_template = "";
              }
            }
            self.errorAjax(error);
            $(".fa-sync", event.target).addClass("d-none");
            $(event.target).removeAttr("disabled");
          }
        });
        return DatasReturn;
      },
      alert_action: function(datas) {
        // console.log(datas);
        var event;
        if (datas.status) {
          /*
           * console.log('MODE DEBUG :::: ',
           * this.modal_body.modedebug, this.modedebug);
           */
          if (datas.action && datas.action === "create_customer") {
            if (parseInt(this.modal_body.modedebug) > 0) {
              event = {
                target: $("#model-create-invoice .modal-header")
              };
              this.create_customer_test(event);
            } else if (parseInt(this.modal_body.modedebug) <= 0) {
              event = {
                target: $("#model-create-invoice .modal-header")
              };
              this.create_customer(event);
            } else {
              // alert(' Certains paramettre sont manquants ..');
              console.log(" this.modal_body ", this.modal_body);
            }
          } else if (datas.action && datas.action === "update_customer") {
            if (parseInt(this.modal_body.modedebug) > 0) {
              event = {
                target: $("#model-create-invoice .modal-header")
              };
              this.update_customer_test(event);
            } else if (parseInt(this.modal_body.modedebug) <= 0) {
              event = {
                target: $("#model-create-invoice .modal-header")
              };
              this.update_customer(event);
            } else {
              // alert(' Certains paramettre sont manquants ..');
              console.log(" this.modal_body ", this.modal_body);
            }
          } else if (datas.action && datas.action === "generate_next_code") {
            if (
              parseInt(this.modal_body.modedebug) < 0 ||
              parseInt(this.modedebug) < 0
            ) {
              event = {
                target: $("#model-create-invoice .modal-header")
              };
              this.create_invoice_all_next_code_facture(event);
            } else {
              // alert(" Certains paramettre sont manquants, Vous devez etre identifier comme administrateur. ...");
              console.log(" this.modal_body ", this.modal_body);
              console.log(" this.modedebug ", this.modedebug);
            }
          }
        } else {
          // alert(" status de l'event:alert_action non valides ");
        }
      },
      alert_close_static: function() {
        this.show_alert_static = false;
      },
      successAjax: function(
        message = "",
        display = true,
        classe = "alert-success"
      ) {
        if (!display) {
          return false;
        }
        var self = this;
        self.show_alert_static = true;
        self.alert_attribut_class_static = classe;
        self.alert_message_static = message;
      },
      errorAjax: function(error = "", classe = "alert-danger") {
        var self = this;
        self.show_alert_static = true;
        self.alert_attribut_class_static = classe;

        /**
         * Gestion des erreurs. erreur 405
         */
        if (error.status == 405) {
          self.alert_template = "";
          self.error_message = "";
          self.alert_attribut_class_static = "alert-info";
          message =
            '<strong class="d-block mb-3">Delai d\'attente dépassé, verifier votre connexion ou rééssayer plus tard.</strong>';
          self.alert_message_static = message;
          return true;
        }
        /**
         * Gestion des erreurs. erreur 405
         */
        if (error.status == 200) {
          self.alert_template = "";
          self.error_message = "";
          self.alert_attribut_class_static = "alert-warning";
          message =
            '<strong class="d-block mb-3">Une erreur est survenue </strong>';
          self.alert_message_static = message;
          return true;
        }

        /*
         * if(self.modedebug){ self.alert_message_static="Une erreur est
         * survenu,"; return false; }
         */
        var errorQB = self.traitementErrorQB(error);
        if (errorQB && self.modedebug < 0) {
          self.alert_attribut_class_static = "alert-warning";
          self.show_alert_static = true;
          self.alert_message_static = errorQB;
          return false;
        }

        if (self.modedebug < 0) {
          self.alert_message_static =
            "<strong> Une erreur s'est produite, réessayer plus tard, ou contactez nous si cela persiste </strong>";
          return false;
        }
        var message = "";
        if (error.statusText) {
          message =
            '<strong class="d-block mb-3"> ' +
            decodeURIComponent(error.statusText) +
            "</strong>";
        }
        if (errorQB) {
          self.alert_attribut_class_static = "alert-warning";
          message = "<p>" + errorQB + "</p>";
        } else {
          message += "<p>" + error.responseText + "</p>";
        }

        self.alert_message_static = message;
      },
      traitementErrorQB: function(error) {
        var self = this;
        /**
         * On recherche les demimiteurs 'QB###'
         */
        var texte = "";
        var n = error.responseText.search("QB###");
        if (n) {
          var messageError =
            '<strong class="d-block mb-3">' +
            decodeURIComponent(error.statusText) +
            "</strong>";
          texte = error.responseText.split("BGQB###");
          if (!texte[1]) {
            return false;
          }
          texte = texte[1].split("ENDQB###");
          if (texte[0] != "") {
            var test_result = false;
            texte = JSON.parse(texte[0]);
            if (texte && texte.flux && self.modedebug) {
              self.flux = texte.flux;
            }
            if (texte && texte.querys && self.modedebug) {
              self.querys = texte.querys;
            }
            if (texte && texte.result) {
              texte = texte.result;
              test_result = true;
            }
            // console.log(texte);
            if (!test_result) {
              return messageError;
            }
          } else {
            return messageError;
          }
          console.log(texte);
          if (texte && texte["Fault"] && texte["Fault"]["Error"]) {
            $.each(texte["Fault"]["Error"], function(i, k) {
              if (k.Message && k.Message != "") {
                messageError +=
                  '<span class="d-block"> - ' + k.Message + "</span>";
              }
              if (k.Detail && k.Detail != "") {
                messageError +=
                  '<span class="d-block"> - ' + k.Detail + "</span>";
              }
              if (k.Detail) {
                // messageError +='<span
                // class="d-block">'+k.Detail+'</span>';
              }
            });

            return messageError;
          } else {
            if (texte && texte != "") {
              messageError += '<span class="d-block"> - ' + texte + "</span>";
            }
            return messageError;
          }
        }
        return false;
      },
      buildCart: function(line) {
        var cart = [];
        $.each(line, function(k, l) {
          var subLine = {
            sku: l.sku,
            qty: l.SalesItemLineDetail.Qty,
            price: l.Amount
          };
          cart.push(subLine);
        });
        return cart;
      },
      select_tab: function(e) {
        var self = this;
        self.resetFields();
        // $(e.target).parent().find('.btn').removeClass('btn-primary').addClass('btn-outline-primary');
        // $(e.target).removeClass('btn-outline-primary');
        // $(e.target).addClass('btn-primary');
        var attr_mode = parseInt($(e.target).attr("data-modedebug"));
        console.log(attr_mode);
        if (attr_mode < 0) {
          // console.log('attr_mode : ',attr_mode);
          self.modedebug = -1;
          // console.log('modedebug false ');
        } else {
          self.modedebug = 1;
          // console.log('modedebug true ');
        }
        /**
         * save mode
         */
        Cookies.set("createorder_modedebug", self.modedebug);
      },
      open_windows: function(event) {
        // alert('open_windows off');
        // return false;
        var w = 770,
          h = 600,
          l = (screen.availWidth - w) / 2,
          t = (screen.availHeight - h) / 2;
        console.log("hello : " + this.token_url_refresh);
        window.open(
          this.token_url_refresh,
          "window",
          "width= " +
            w +
            ",height=" +
            h +
            ",left=" +
            l +
            ",top=" +
            t +
            ", scrollbars = yes, location = no, toolbar = no, menubar = no, status = no"
        );
        return false;
      },
      create_customer_v2: function(datas) {
        var self = this;
        console.log("thme create order : ", datas);
        if (datas.results) {
          if (datas.results.status) {
            if (datas.results.data) {
              $.each(datas.results.data, function(i, v) {
                if (v.type && v.type == "create_customer") {
                  var message = "";
                  if (v.is_new) {
                    message =
                      '<strong class="d-block">Client crée : ' +
                      v.value.DisplayName +
                      "</strong>";
                  } else {
                    message =
                      '<strong class="d-block">Le client existe deja : ' +
                      v.value.DisplayName +
                      "</strong>";
                  }
                  self.successAjax(message);

                  self.alert_attribut_class_static = "alert-success";
                }
              });
            }
          } else {
            this.errorAjax(datas.results.errorajax);
          }
        }
      },
      add_txt_link: function(
        id_commande,
        txnId_invoice = null,
        payment_txnId = null
      ) {
        console.log("add_txt_link waitting");
        console.log(
          id_commande,
          txnId_invoice,
          payment_txnId,
          $("#text" + id_commande)
        );
        var link = "";
        if (txnId_invoice) {
          link +=
            '<a class="button-link" href="https://c34.qbo.intuit.com/app/invoice?txnId=' +
            txnId_invoice +
            '" target="_blank"> F </a> ';
        }
        if (payment_txnId) {
          link +=
            ' <a class="button-link" href="https://c34.qbo.intuit.com/app/recvpayment?txnId=' +
            payment_txnId +
            '" target="_blank"> P </a>';
        }
        setTimeout(function() {
          $("#text" + id_commande).html(link);
        }, 1500);
      }
    }
  });

  /**
   *
   */
  function check_add_test_mode(value) {
    console.log(value);
  }

  /**
   *
   */
  function getDateMySql(val, hour = "23:59:59") {
    var dataiso = "";
    if (val) {
      val = val.split("-");
      if (val[2]) {
        dataiso += val[2].toString().padStart(2, "0");
      }
      if (val[1]) {
        dataiso += "-" + val[1].toString().padStart(2, "0");
      }
      if (val[0]) {
        dataiso += "-" + val[0].toString().padStart(2, "0");
      }
      // dataiso +=' '+hour;
      return dataiso;
    }
  }

  // /// fonction permettant d'effectuer des arrondis
  function precisionRound(number, precision = 2) {
    number = Number(number);
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  // /// fonction permettant d'effectuer des arrondis
  function getDateinFrench(data) {
    var _date = new Date(data);
    var french_date =
      _date.getDate() +
      "/" +
      (_date.getMonth() + 1) +
      "/" +
      _date.getFullYear();
    return french_date;
  }

  /**
   *
   */
  function roundTo(n, digits = 2) {
    var negative = false;
    if (digits === undefined) {
      digits = 0;
    }
    if (n < 0) {
      negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if (negative) {
      n = (n * -1).toFixed(2);
    }
    return n;
  }

  // /// fonction permettant d'effectuer des arrondis
  function getDateinFrenchByTimestamp(data) {
    if (data) {
      data = parseInt(data);
      var _date = new Date(data * 1000);
      var day = _date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      var mounth = _date.getMonth() + 1;
      if (mounth < 10) {
        mounth = "0" + mounth;
      }
      var mn = _date.getUTCMinutes();
      if (mn < 10) {
        mn = "0" + mn;
      }
      var french_date = day + "/" + mounth + "/" + _date.getFullYear();
      // french_date += ' à '+_date.getUTCHours() +'H'+ mn;
      return french_date;
    }
  }

  /**
   *
   */
  function add_EURO(data) {
    if (!data && data != null) {
      if (data > 0) {
        data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        data = data.replace(".", ",");
      }
      return data + " €";
    } else if (data == 0) {
      data = "0 €";
    }
    return data;
  }

  function lower_case(data) {
    // console.log(data);
    if (data && data != "") {
      var d = data.toLowerCase();
      return d;
    }
    return "";
  }

  function getMysqlDateToFrench(data) {
    if (data && data != "") {
      var _date = new Date(data);
      french_date =
        _date
          .getDate()
          .toString()
          .padStart(2, "0") +
        "/" +
        (_date.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        _date.getFullYear() +
        " à " +
        _date
          .getHours()
          .toString()
          .padStart(2, "0") +
        ":" +
        _date
          .getMinutes()
          .toString()
          .padStart(2, "0");
      return french_date;
    }
    return "";
  }

  /**
   *
   */
  function test() {
    var params = {
      config: {
        path: "/admin/orders/812074172482.json",
        uid: 123,
        datatype: "orders"
      }
    }; /**/
    params = JSON.stringify(params);
    $.ajax({
      url: $("body").attr("data-root") + "/shopify.php",
      method: "GET",
      data: "datas=" + params,
      // async : false,
      success: function(data) {
        console.log(data);
      },
      error: function(error) {
        console.log("error to get datas");
        console.log(error);
      }
    });
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
    date_string += new_date
      .getDate()
      .toString()
      .padStart(2, "0");
    return date_string;
  }

  async function getDateEndMonth(date) {
    var cal_date = new Date(date);
    return new Date(cal_date.getFullYear(), cal_date.getMonth() + 1, 0);
  }

  /**
   *
   */
  function paiement_status(key) {
    var status = {
      // 'pending':'En attente',
      // 'partially_shipped':'Partiellement payé',
    };
    if (status[key]) {
      return status[key];
    }
    return key;
  }

  function number_format_french(str) {
    if (!str) {
      return str;
    }
    return str;
  }
});
