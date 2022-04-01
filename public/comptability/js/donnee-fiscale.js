jQuery(document).ready(function ($) {

  // component input_submit **************************************************
  Vue.component('donnee_fiscale', {
    delimiters: ['${', '}'],
    props: {
      nbre_cmdes: { type: [String, Number], default: '17', },
      total_nbre_cmdes: { type: [String, Number], default: '423,55 €', },
      nbre_rbmt: { type: [String, Number], default: '1', },
      total_nbre_rbmt: { type: [String, Number], default: '-31.85 €', },
      product_ht_ca: { type: [String, Number], default: '391.7 €', },
      product_ht_ca_tva: { type: [String, Number], default: '21.6 €', },
      frais_port: { type: [String, Number], default: '0 €', },
      frais_port_tva: { type: [String, Number], default: '0 €', },
      label_tva_port: { type: [String, Number], default: 'TVA (5.5%)', },
      label_tva_product: { type: [String, Number], default: 'TVA (5.5%)', },
    },
    template: '#template_donnee_fiscale',
    methods: {

    },
  });

  var fluxAmazon = new Vue({
    delimiters: ['${', '}'],
    el: '#fluxAmazon',
    data: {
      default_rows: [],
      // /
      entete: 'Flux Amazon',
      rows: [],
      headers: [],
      footers: [],
      show_footer: false,
      root: $('body').attr('data-root'),
      align_header: true,
      show_reel_index: true,
      // // date de fin
      input_datedebut: true,
      label_datedebut: 'Dade de début',
      // // date de fin
      input_datefin: false,
      label_datefin: 'Dade de fin',
      // // first day
      input_firstday: '',
      label_firstday: 'Date de début',
      defaultvalue_firstday: (Cookies.get('input_firstday')) ? Cookies.get('input_firstday') : '',
      // /// last day
      input_lastday: '06-03-2019',
      label_lastday: 'Date de fin',
      defaultvalue_lastday: (Cookies.get('input_lastday')) ? Cookies.get('input_lastday') : '',
      // show_result _order
      show_result_order: false,
      libele1_order: '',
      libele2_order: '',

      // show_result _refund
      show_result_refund: false,
      libele1_refund: '',
      libele2_refund: '',

      // show_result _refund
      show_result_total: false,
      libele1_total: '',
      libele2_total: '',
      //
      show_result_paniertvaorder: false,
      libele1_total_paniertvaorder: '',
      // shippintax
      show_result_shippintax: false,
      libele1_total_shippintax: '',

      // shippintax
      show_result_shipping: false,
      libele1_total_shipping: '',
      // listes_vente_sku
      listes_vente_sku: [
        { sku: 'H-01001', qte: 0 },
        { sku: 'H-01002', qte: 0 },
        { sku: 'H-01003', qte: 0 },
        { sku: 'MCTCRE1X300', qte: 0 },
        { sku: 'MCTCRE2X300', qte: 0 },
        { sku: 'MCTCRE3X300', qte: 0 },
        { sku: 'MCTVIT1X500', qte: 0 },
        { sku: 'MCTCREV1X300', qte: 0 },
        { sku: 'MCTCREV2X300', qte: 0 },
        { sku: 'MCTCREV3X300', qte: 0 },
      ],
      sku_img_products: {
        'MCTCRE1X300': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREM1X300-packshot_x100.jpg',
        'MCTCRE2X300': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREM2X300-packshot_x100.jpg',
        'MCTCRE3X300': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREM3X300-packshot_b62f8fda-3487-4dd4-84d4-f78d4818d005_x100.jpg',
        'H-01001': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/0787099226466_x100.jpg',
        'H-01002': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/0787099226497_x100.jpg',
        'H-01003': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/0787099226503_x100.jpg',
        'MCTVIT1X500': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/0787099226473_x100.jpg',
        'MCTPACKCET01': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/Nutribe-pack_cetose_x100.jpg',
        'MCTPACKCETO1': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/Nutribe-pack_cetose_x100.jpg',
        'MCTCREV1X300': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREV1X300-packshot_x100.jpg',
        'MCTCREV2X300': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREV2X300-packshot_x100.jpg',
        'MCTCREV3X300': 'https://cdn.shopify.com/s/files/1/0013/2123/8594/products/MCTCREV3X300-packshot_x100.jpg',
      },
      // Rapport de vente par sku pour shopify
      listes_vente_sku_shopify: [
        { sku: 'H-01001', qte: 0 },
        { sku: 'H-01002', qte: 0 },
        { sku: 'H-01003', qte: 0 },
        { sku: 'MCTCRE1X300', qte: 0 },
        { sku: 'MCTCRE2X300', qte: 0 },
        { sku: 'MCTCRE3X300', qte: 0 },
        { sku: 'MCTCREV1X300', qte: 0 },
        { sku: 'MCTCREV2X300', qte: 0 },
        { sku: 'MCTCREV3X300', qte: 0 },
      ],
      // Données fiscales pour shopify
      nbre_cmdes_shopify: 0,
      total_nbre_cmdes_shopify: 0,
      nbre_rbmt_shopify: 0,
      total_nbre_rbmt_shopify: 0,
      product_ht_ca_shopify: 0,
      product_ht_ca_tva_shopify: 0,
      frais_port_shopify: 0,
      frais_port_tva_shopify: 0,

      // Données fiscales pour amazon
      nbre_cmdes_amazon: 0,
      total_nbre_cmdes_amazon: 0,
      nbre_rbmt_amazon: 0,
      total_nbre_rbmt_amazon: 0,
      product_ht_ca_amazon: 0,
      product_ht_ca_tva_amazon: 0,
      frais_port_amazon: 0,
      frais_port_tva_amazon: 0,
      /**
		 * 
		 */
      modedebug: false,
      requests: {},
      /**
		 * 
		 */
		config__manage_connect:{},
		databaseConfig: '',
		/**
		 * Compte QB actif;
		 */
		current_compagny: '',
		filters: {},
    },
    mounted: function () {
      if (this.defaultvalue_firstday != '' || this.defaultvalue_lastday != '') {
        // this.input_firstday = this.defaultvalue_firstday;
        // this.input_lastday = this.defaultvalue_lastday;
        // this.getdatas();
      }
      // this.modedebug = parseInt(Cookies.get('modedebug_parent'));
    },
    methods: {
      inputsubmit: function () {
        //
        console.log('inputsubmit perform');
        this.saveSelectDate();
        this.getdatas();
      },
      render_vente_sku: function (sku) {
        sku = (this.sku_img_products[sku]) ? '<img src="' + this.sku_img_products[sku] + '" class="image-small" />  ' + sku : sku;
        return sku;
      },
      saveSelectDate: function () {
        console.log('Prepare to save : ', this.input_firstday, this.input_lastday);
        let input_firstday = getDateMySql(this.input_firstday);
        let input_lastday = getDateMySql(this.input_lastday)
        Cookies.set('input_firstday', input_firstday);
        Cookies.set('input_lastday', input_lastday);
        console.log('Date save french : ', input_firstday, input_lastday);
      },
      selectDate: function () {
        if (this.defaultvalue_firstday != '' || this.defaultvalue_lastday != '') {
          this.input_firstday = this.defaultvalue_firstday;
          this.input_lastday = this.defaultvalue_lastday;
          this.getdatas();
        }
      },
      reload_datas: function (event) {
        this.getdatas();
      },
      buildAccordion: function (datas) { 
        var accordion = [];
        $.each(datas, function (i, val) {
          accordion.push({ title: i, body: val });
        });
        this.requests = accordion;
      },
      getdatas: function () {
        var self = this;
        $('.loadDatas i').removeClass('d-none');
        $('.loadDatas i').addClass('fa-spin text-warning');
        console.log('date debut : ' + self.input_firstday)
        var params = {
          config: {
            'page': 1,
            'nombre': 20,
            'datatype': 'BD_fluxAmazon',
            'databaseConfig': this.databaseConfig,
          },
          query: {
				datedebut: self.input_firstday,
				datefin: self.input_lastday,
		  },
		  filters: self.filters,
        };/**/
        params = JSON.stringify(params);
        url = self.root + '/getcommandes.php';
        $.ajax({
          url: url,
          method: 'GET',
          data: 'datas=' + params,
          // async : false,
          success: function (data) {
            console.log(data);
            $('.loadDatas i').addClass('d-none');
            $('.loadDatas i').removeClass('fa-spin text-warning');
            self.buildAccordion(data.requests);
            self.show_result_order = true;
            // listes_vente_sku
            self.listes_vente_sku = data.qte_sku;
            // show_result _refund
            var m = (data.brute['rq1'][0]['montant_sell'] !== null) ? data.brute['rq1'][0]['montant_sell'] : 0;
            self.libele1_order = 'Nombre de commandes : ' + data.brute['rq1'][0]['number_order'];
            self.libele2_order = 'Produits HT (CA) : ' + add_EURO(m);
            // show_result _refund
            var m2 = (data.brute['rq2'][0]['montant_sell'] !== null) ? data.brute['rq2'][0]['montant_sell'] : 0;
            self.show_result_refund = true;
            self.libele1_refund = 'Nombre de remboursements : ' + data.brute['rq2'][0]['number_order'];
            self.libele2_refund = 'Produits HT (CA) : ' + add_EURO(m2);
            console.log(m);

            // show to total
            self.show_result_total = true;
            self.libele1_total = 'Paniers HT : ' + add_EURO(data.brute['somme_rq1_rq2']);
            // panier
            self.show_result_paniertvaorder = true;
            self.libele1_total_paniertvaorder = 'TVA: ' + add_EURO(data.tva['somme_rq1_rq2']);
            // shippintax ShippingTax
            self.show_result_shippintax = true,
              self.libele1_total_shippintax = 'TVA: ' + add_EURO(data.ShippingTax['somme_rq1_rq2']);
            // shipping
            self.show_result_shipping = true,
              self.libele1_total_shipping = 'Frais de port HT: ' + add_EURO(0);


            // données fiscale shopify
            self.nbre_cmdes_shopify = data.donnee_fiscale_shopify[0].nb_cmd;
            // console.log(data.donnee_fiscale_shopify[0]);
            self.total_nbre_cmdes_shopify = add_EURO(data.donnee_fiscale_shopify[0].panier_ht);
            self.nbre_rbmt_shopify = 0;
            self.total_nbre_rbmt_shopify = 0;
            self.product_ht_ca_shopify = add_EURO(parseFloat(data.donnee_fiscale_shopify[0].panier_ht) + parseFloat(data.donnee_fiscale_shopify[0].port_ht));// add_EURO(
																																								// data.donnee_fiscale_shopify[0].total_paid
																																								// );
            self.product_ht_ca_tva_shopify = add_EURO((data.donnee_fiscale_shopify[0].panier_ttc - data.donnee_fiscale_shopify[0].panier_ht).toFixed(2));
            var frais_port = data.donnee_fiscale_shopify[0].port_ht;
            self.frais_port_shopify = add_EURO(frais_port);
            self.frais_port_tva_shopify = add_EURO(((data.donnee_fiscale_shopify[0].total_paid - data.donnee_fiscale_shopify[0].panier_ttc) - frais_port).toFixed(2));

            // données fiscale amazon
            var m = (data.brute['rq1'][0]['montant_sell'] !== null) ? data.brute['rq1'][0]['montant_sell'] : 0;
            var m2 = (data.brute['rq2'][0]['montant_sell'] !== null) ? data.brute['rq2'][0]['montant_sell'] : 0;
            self.nbre_cmdes_amazon = data.brute['rq1'][0]['number_order'];
            self.total_nbre_cmdes_amazon = add_EURO(m); // *******
            self.nbre_rbmt_amazon = data.brute['rq2'][0]['number_order'];
            self.total_nbre_rbmt_amazon = add_EURO(m2);
            var ht_ca_amazon = parseFloat(m) + parseFloat(data.shipping_amazon.shipping) + parseFloat(m2);
            ht_ca_amazon = ht_ca_amazon.toFixed(2);
            //
            ht_ca_amazon = data.Amazon_Produit_HT.montant_sell;
            self.product_ht_ca_amazon = add_EURO(ht_ca_amazon);// add_EURO(data.brute['somme_rq1_rq2']);
																// //*****
            self.product_ht_ca_tva_amazon = add_EURO(data.Amazon_Tva.montant_sell);

            // frais de port = frais de port commande - frais de port remboursé
            self.frais_port_amazon = '<span class="d-block">';
            self.frais_port_amazon += (data.Amazon_shipping.montant_sell) ? add_EURO(data.Amazon_shipping.montant_sell) : '0 €';
            self.frais_port_amazon += '</span><span class="d-block">';
            self.frais_port_amazon += (data.shipping_amazon.shipping_refund && data.shipping_amazon.shipping_refund.nbre) ? data.shipping_amazon.shipping_refund.nbre + ' remboursement(s)' : '0 remboursement(s)';
            self.frais_port_amazon += '</span>';

            self.frais_port_tva_amazon = add_EURO(data.Amazon_Shipping_tax.montant_sell);

            /**
			 * Retourne la quantité de vente par sku en function d'une periode
			 */
            self.listes_vente_sku_shopify = data.quantites_sku_shopify;



          },
          error: function (error) {
            console.log('error to get datas');
            console.log(error);
            $('#displayErrorAjax').html(error.responseText);
            $('.loadDatas i').addClass('d-none');
            $('.loadDatas i').removeClass('fa-spin text-warning');
          }
        });
      },
      buildDataChart: function (data) {
        var self = this;
        var max_label = 300, i = 1;
        var montants = [];
        var num_orders = [];
        var labels = [];
        console.log(self.input_firstday);
        console.log(self.input_lastday);
        if (self.input_firstday != '' && self.input_lastday == '') {
          var today = new Date();
          var currentDate = new Date(getDateMySql(self.input_firstday, hour = '00:00:00'));
          currentDate = currentDate.getTime();
          var todayTIME = today.getTime();
          while (currentDate <= todayTIME && i <= max_label) {
            // console.log(currentDate);
            d2 = new Date(currentDate);
            var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) : (d2.getMonth() + 1);
            var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
            var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
            labels.push(currentDate_french);

            var date = new Date(currentDate);
            currentDate = date.setDate(date.getDate() + 1);
            // montant_sell; number_order
            var result = this.getValues(currentDate_french, data.brute.rq3);
            montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
            num_orders.push((result['number_order']) ? result['number_order'] : 0);
            i++;
          }
        } else if (self.input_firstday == '' && self.input_lastday != '') {
          console.log('self.input_lastday ')
          max_label = 100;
          var today = new Date();
          var currentDate = new Date(getDateMySql(self.input_lastday, hour = '00:00:00'));
          currentDate = currentDate.getTime();
          var todayTIME = today.getTime();
          while (i <= data.brute.rq3.length && i <= max_label) {
            // console.log(currentDate);
            d2 = new Date(currentDate);
            var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) : (d2.getMonth() + 1);
            var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
            var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
            labels.push(currentDate_french);

            var date = new Date(currentDate);
            currentDate = date.setDate(date.getDate() - 1);
            // montant_sell; number_order
            var result = this.getValues(currentDate_french, data.brute.rq3);
            montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
            num_orders.push((result['number_order']) ? result['number_order'] : 0);
            i++;
          }
          montants = montants.reverse();
          num_orders = num_orders.reverse();
          labels = labels.reverse();
        } else if (self.input_firstday != '' && self.input_lastday != '') {
          var today = new Date(getDateMySql(self.input_lastday, hour = '00:00:00'));
          var currentDate = new Date(getDateMySql(self.input_firstday, hour = '00:00:00'));
          currentDate = currentDate.getTime();
          var todayTIME = today.getTime();
          while (currentDate <= todayTIME && i <= max_label) {
            // console.log(currentDate);
            d2 = new Date(currentDate);
            var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) : (d2.getMonth() + 1);
            var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
            var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
            labels.push(currentDate_french);

            var date = new Date(currentDate);
            currentDate = date.setDate(date.getDate() + 1);
            // montant_sell; number_order
            var result = this.getValues(currentDate_french, data.brute.rq3);
            montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
            num_orders.push((result['number_order']) ? result['number_order'] : 0);
            i++;
          }
        }
        // //

        var grapheMontant = {
          label: '# Montant des ventes en €',
          data: montants,
          backgroundColor: ['rgba(25, 99, 132, 0.2)',],
          borderColor: ['rgba(25, 99, 132, 0.8)',],
          borderWidth: 1
        };
        var grapheNum_order = {
          label: '# Nombre de commandes',
          data: num_orders,
          backgroundColor: ['rgba(25, 199, 132, 0.5)',],
          borderColor: ['rgba(25, 199, 132, 1)',],
          borderWidth: 1
        };

        self.chart_labels = [];
        self.chart_labels = labels;
        self.chart_datasets = [];
        self.chart_datasets.push(grapheMontant);
        self.chart_datasets.push(grapheNum_order);
        self.chart_show_graph = true;

        /*
		 * $.each(data.brute.rq3, function(f,k){ self.chart_labels.push() });
		 */
      },
      getValues: function (dateFrench, rows) {
        var montant = 0;
        $.each(rows, function (j, k) {
          if (k['date_sell'] == dateFrench) {
            montant = k; // k['montant_sell'];
            return montant;
          }
        });
        return montant;
      },
      separateurMillier: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      },
      select_tab: function (e) {
        var self = this;
        // $(e.target).parent().find('.btn').removeClass('btn-primary').addClass('btn-outline-primary');
        // $(e.target).removeClass('btn-outline-primary');
        // $(e.target).addClass('btn-primary');
        var attr_mode = parseInt($(e.target).attr('data-modedebug'));
        // console.log(attr_mode);
        if (attr_mode < 0) {
          // console.log('attr_mode : ',attr_mode);
          self.modedebug = -1;
          console.log('modedebug false ');
        } else {
          self.modedebug = 1;
          // console.log('modedebug true ');
        }
        /**
		 * save mode
		 */
        Cookies.set('modedebug_parent', self.modedebug);

      },
      getconfig__manage_connect: function(configs){
			this.config__manage_connect = configs;
			this.databaseConfig = configs.databaseConfig;				
			this.current_compagny = configs.current_compagny;
			this.input_firstday = configs.input_firstday;
			this.input_lastday = configs.input_lastday;
			this.getdatas();
			console.log(configs);
		}
    },


  });



  var manageMap = new Vue({
    delimiters: ['${', '}'],
    el: '#manageMap',
    data: {

    },
  });



  /**
	 * 
	 * @param val
	 * @param hour
	 * @returns
	 */
  function getDateIso8601(val, hour = '23:59:59') {
    var dataiso = '';
    if (val) {
      val = val.split('-');
      if (val[2]) { dataiso += val[2]; }
      if (val[1]) { dataiso += '-' + val[1]; }
      if (val[0]) { dataiso += '-' + val[0]; }
      dataiso += 'T' + hour;
      return dataiso;
    }
  }

  function getDateMySql(val, hour = '23:59:59') {
    var dataiso = '';
    if (val) {
      val = val.split('-');
      if (val[2]) { dataiso += val[2].toString().padStart(2, '0'); }
      if (val[1]) { dataiso += '-' + val[1].toString().padStart(2, '0'); }
      if (val[0]) { dataiso += '-' + val[0].toString().padStart(2, '0'); }
      // dataiso +=' '+hour;
      return dataiso;
    }
  }


  /**
	 * 
	 * @param rows
	 * @param filedsPlus
	 * @returns
	 */
  function buildArray(rows, filedsPlus) { // console.log(rows);
    var results = {}, total = { number: 0, monney: 0, };
    var headers = [], footers = {};
    var removeIt = {
      first_name: 'jptest',
    }
    var valide_key = {
      datedebut: {
        name: 'datedebut',
        label: 'Date de debut',
      },
      datefin: {
        name: 'datefin',
        label: 'Date de fin',
      },
      'price-type': {
        name: 'price-type',
        label: 'Price type',
      },
      'montant': {
        name: 'montant',
        label: 'Montant',
        perfom: ['add_EURO'],
      },
    };
    // //
    $.each(filedsPlus, function (i, v) {
      if (v == 'datetime_fin') {
        valide_key['datetime_fin'] = {
          label: 'Date de fin',
          name: 'datetime_fin',
          perfom: ['getDateinFrenchByTimestamp'],
        };
      } else if (v == 'datetime') {
        valide_key['datetime'] = {
          name: 'datetime',
          label: 'Dade de début',
          perfom: ['getDateinFrenchByTimestamp'],
        };
      }
    });

    $.each(rows, function (key, valeur) {
      var remove = false;
      var id = valeur.id_order;
      results[id] = {}; total.number += 1;
      $.each(valide_key, function (index, value) {
        // sous object
        if ((value instanceof Array || value instanceof Object)) {
          // multiple filed
          if (value.addfield && value.obj) {
            var infos = '';
            if (value.obj instanceof Array) {
              $.each(value.addfield, function (c, vl) {
                if (valeur[value.obj[0]][0]) {
                  infos += ' ' + valeur[value.obj[0]][0][vl];
                }
              });
            } else {
              $.each(value.addfield, function (c, vl) {
                infos += ' ' + valeur[value.obj][vl];
              });
            }
            // active remove
            if (removeIt[value.name] && (removeIt[value.name] == valeur[value.obj][value.name])) {
              remove = true;
            }
            results[id][value.name] = valeur[value.obj][value.name] + infos;
          } else if (value.obj) {
            if (value.obj instanceof Array) {
              if (valeur[value.obj[0]][0]) { results[id][value.name] = valeur[value.obj[0]][0][value.name]; }
            } else {
              results[id][value.name] = valeur[value.obj][value.name];
            }
          } else {
            results[id][value.name] = valeur[value.name];
          }
          // active remove
          if (removeIt[value.name] && (removeIt[value.name] == results[id][value.name])) {
            remove = true;
          }

          // format data
          if (value.perfom) {
            $.each(value.perfom, function (i, f) {
              if (f == 'getDateinFrench') {
                results[id][value.name] = getDateinFrench(results[id][value.name]);
              }
              else if (f == 'add_EURO') {
                if ('panier_ttc' == value.name) {
                  var monney = precisionRound(results[id][value.name]);// console.log(results[id][value.name]+'
																		// :
																		// '+total.monney);
                  total.monney += monney;
                }
                results[id][value.name] = add_EURO(results[id][value.name]);


              } else if (f == 'getDateinFrenchByTimestamp') {
                results[id][value.name] = getDateinFrenchByTimestamp(results[id][value.name]);
              }
            });
          }
        } else {
          // results[id][index] = valeur[index];
        }

      });
      if (remove) {
        delete results[id];
      }

    });

    // add footer
    if (!jQuery.isEmptyObject(results)) {
      total.monney = roundTo(total.monney);
      // footers['']
      $.each(valide_key, function (index, value) {
        // results['total'][index]='';
        if (index == 'panier_ttc') { footers[index] = {}; footers[index] = { name: index, label: add_EURO(total.monney) }; }
      });
    }
    $.each(valide_key, function (index, value) {
      console.log(index);
      headers.push(value);
    });
    return {
      'rows': results,
      'headers': valide_key,
      'footers': footers,
    };
  }


  // /// fonction permettant d'effectuer des arrondis
  function getDateinFrenchByTimestamp(data) {
    if (data) {
      data = parseInt(data);
      var _date = new Date(data * 1000);
      var day = _date.getDate(); if (day < 10) { day = '0' + day; }
      var mounth = _date.getMonth() + 1; if (mounth < 10) { mounth = '0' + mounth; }
      var mn = _date.getUTCMinutes(); if (mn < 10) { mn = '0' + mn; }
      var french_date = day + '/' + mounth + '/' + (_date.getFullYear());
      // french_date += ' à '+_date.getUTCHours() +'H'+ mn;
      return french_date;
    }
  }

  // /// fonction permettant d'effectuer des arrondis
  function precisionRound(number, precision = 2) {
    number = Number(number);
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;

  }


  function add_EURO(data) {
    if (data != '' || data == 0) {
      if (data > 0) {
        data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      return data + ' €';
    }
    return '';
  }


  function getDateinFrench(data) {
    var _date = new Date(data);
    var french_date = (_date.getDate()) + '/' + (_date.getMonth() + 1) + '/' + (_date.getFullYear());
    return french_date;
  }

  // /// fonction permettant d'effectuer des arrondis
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




























































});
