jQuery(document).ready(function ($) {
  //
  Vue.filter("currency", function (money) {
    return accounting.formatMoney(money, {
      symbol: "",
      thousand: ".",
      decimal: ",",
    });
  });
  //
  Vue.component("tableau-gestion", tabGes);
  Vue.component("builder-forms", BuilderForms);
  Vue.component("order-products", OrderProducts);
  //
  new Vue({
    delimiters: ["${", "}"],
    el: "#home_page",
    data: {
      root: $("body").attr("data-root"),
      // // first day
      input_firstday: "",
      input_lastday: "",

      config__manage_connect: {},
    },
    methods: {
      getdatas: function () {
        var self = this;
        $(".loadDatas i").removeClass("d-none");
        $(".loadDatas i").addClass("fa-spin text-warning");
        var params = {
          config: {
            page: 1,
            nombre: 20,
            datatype: "BD_fluxAmazon",
            databaseConfig: this.config__manage_connect.databaseConfig,
            current_compagny: this.config__manage_connect.current_compagny,
            sous_type: "rapport",
          },
          query: {
            datedebut: getDateMySql(self.input_firstday, (hour = "00:00:00")),
            datefin: getDateMySql(self.input_lastday, (hour = "00:00:00")),
          },
        };
        console.log("config before send : ", params);
        params = JSON.stringify(params);
        url = self.root + "/getcommandes.php";
        $.ajax({
          url: url,
          method: "GET",
          data: "datas=" + params,
          // async : false,
          success: function (data) {
            console.log("Ajax succes : ", data);
            self.listes_vente_sku = data.qte_sku;
            self.listes_vente_sku_shopify = data.quantites_sku_shopify;
          },
          error: function (error) {
            console.log("Error to get datas");
            console.log(error);
            $("#displayErrorAjax").html(error.responseText);
            $(".loadDatas i").addClass("d-none");
            $(".loadDatas i").removeClass("fa-spin text-warning");
          },
        });
      },
      render_vente_sku: function (sku) {
        sku = this.sku_img_products[sku]
          ? '<img src="' +
            this.sku_img_products[sku] +
            '" class="image-small" />  ' +
            sku
          : sku;
        return sku;
      },
      getconfig__manage_connect: function (configs) {
        var self = this;
        this.config__manage_connect = configs;
        this.input_firstday = configs.input_firstday;
        this.input_lastday = configs.input_lastday;
        console.log(" configs :: ", configs);
        if (configs.filters) {
          $.each(configs.filters, function (i, v) {
            if (v.column && v.column === "created_at") {
              if (v.operator === ">=") {
                self.input_firstday = v.value;
              } else if (v.operator === "<=" || v.operator === "<") {
                self.input_lastday = v.value;
              }
            }
          });
        }
        this.getdatas();
      },
    },
  });

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
});
