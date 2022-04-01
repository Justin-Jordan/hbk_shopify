/**
 * fichier de commande GOOD.
 */
jQuery(document).ready(function($) {

	Vue.prototype.$http = axios;

	Vue.filter('currency', function(money) {
		return accounting.formatMoney(money, {
			symbol: "",
			thousand: ".",
			decimal: ",",
		})
	});

	/**
	 *
	 */
	Vue.component('custom_display', {
		delimiters: ['${', '}'],
		template: '<pre>${datas}</pre>',
		props: {
			datas: [Object, Array, String, Number],
		},
		data: function() {
			return {

			}
		},
	});

	Vue.component('button_add_client', {
		delimiters: ['${', '}'],
		template: '#template-button_add_client',
		props: {
			datas: [Object, Array, String, Number],
		},
		data: function() {
			return {

			}
		},
		methods: {
			create_customer: function(event) {
				console.log('template create_customer ok');
				this.$emit('ev_alert_action', {
					'status': true,
					action: 'create_customer',
					event: event
				});
			},
			update_customer: function(event) {
				console.log('template update_customer ok');
				this.$emit('ev_alert_action', {
					'status': true,
					action: 'update_customer',
					event: event
				});
			},
		}
	});

	Vue.component('button_next_code', {
		delimiters: ['${', '}'],
		template: '#template-button_next_code',
		props: {
			sub_datas: [Object, Array, String, Number],
		},
		data: function() {
			return {
				text_button: 'Réessayer avec le numéro suivant',
			}
		},
		mounted: function() {
			if (this.sub_datas && this.sub_datas.use_next_code_DocNumber) {
				this.text_button = 'Réessayer avec le numéro suivant  (+' + this.sub_datas
					.use_next_code_DocNumber + ')';
			}
		},
		methods: {
			generate_next_code: function(event) {
				console.log('generate_next_code');
				this.$emit('ev_alert_action', {
					'status': true,
					action: 'generate_next_code',
					event: event
				});
			}
		}
	});


	// //profil user
	var commandes = new Vue({
		delimiters: ['${', '}'],
		el: '#commandes',
		data: {
			/**
			 *
			 */
			titre_modal_preview_img: '',
			default_rows: [],
			show_id: false,
			id_modal: 'model-create-invoice',
			//
			stats: [],
			card_info_show: true,

			// /
			entete: 'Commandes',
			show_action: true,
			rows: [],
			headers: [],
			footers: [],
			show_footer: false,
			orders: [],
			/**
			 * From BD.
			 */
			current_order:{},
			/**
			 *
			 */
			create_invoice_modal_body: {},
			actionparent: {},
			root: $('body').attr('data-root'),
			align_header: true,
			show_reel_index: true,
			// // first day
			input_firstday: '',
			label_firstday: 'Date de début',
			defaultvalue_firstday: (Cookies.get('input_firstday')) ? Cookies.get(
				'input_firstday') : '',
			// /// last day
			input_lastday: '',
			label_lastday: 'Date de fin',
			defaultvalue_lastday: (Cookies.get('input_lastday')) ? Cookies.get(
				'input_lastday') : '',
			// // chart
			chart_labels: [],
			chart_datasets: [],
			chart_show_graph: false,
			// // chart
			chart_labels_count: [],
			chart_datasets_count: [],
			chart_show_graph_count: false,
			chart_id_count: 'count_order',
			// tbleau de status
			/*
			 * headers_status:{ 'status':{label:'État'},
			 * 'amazon':{label:'Amazon'}, 'shopify':{label:'Shopify'}, },
			 * footers_status:[], show_footer_status:false,
			 * show_id_status:false, rows_status:[{ 'status':'closed',
			 * 'amazon':'Amazon', 'shopify':'Shopify', }],
			 */

			modedebug: false,
			requests: {},
			/**
			 *
			 */
			configs: {},
			titre_config: 'Configuration de QB.',
			actionparent_config: 0,
			/**
			 * Config data base : code permettant de recuper les infos de la
			 * bases de données, BD name, user ...
			 */
			databaseConfig: 'prodNutribe',

			/**
			 * Message à afficher.
			 */
			QB_compte_title: false,
			/**
			 * Contient les elments à filtrer via SQL.
			 */
			filters: {},
			config__manage_connect: {},
			/**
			 * Loading in popup
			 */
			 loading_header:false,
		},
		mounted: function() {
			/**
			 * Verification du compte actif. Le compte par defaut etant la
			 * version en prod.
			 */
			/*
			 * var current_compagny = getSession('current_compagny');
			 * this.QB_compte_title = 'Vous etes sur le compte Production
			 * (Nutribe)'; if (current_compagny == '9130347038344016') {
			 * this.databaseConfig = 'testNutribe'; this.QB_compte_title = 'Vous
			 * etes sur le compte test (Dummy)'; this.customer_account_shopify =
			 * 100; this.customer_account_amazon = 101; }
			 *
			 * if (this.defaultvalue_firstday != '' || this.defaultvalue_lastday !=
			 * '') { this.input_firstday =
			 * getDateMySql(this.defaultvalue_firstday); this.input_lastday =
			 * getDateMySql(this.defaultvalue_lastday); this.getdatas(); } else {
			 * var params = { config: { 'page': 1, 'nombre': 20, 'datatype':
			 * $('.get-datatype').attr('datatype'), 'databaseConfig':
			 * this.databaseConfig }, }; params = JSON.stringify(params); var
			 * self = this; url = self.root + '/getcommandes.php'; $.ajax({ url:
			 * url, method: 'GET', data: 'datas=' + params, // async : false,
			 * success: function(data) { console.log(data); self.stats =
			 * data.stats; self.buildDataChart(data); self.default_rows =
			 * data.orders; var data = buildArray(data.orders, [],
			 * self.modedebug); console.log(data); self.rows = data.rows;
			 * self.headers = data.headers; self.footers = data.footers; },
			 * error: function(error) { console.log('error to get datas');
			 * console.log(error);
			 * $('#displayErrorAjax').html(error.responseText); } }); } if
			 * (Cookies.get('modedebug_parent')) {
			 * console.log('modedebug_parent'); this.modedebug =
			 * parseInt(Cookies.get('modedebug_parent')); } else {
			 * console.log('modedebug_parent none'); }
			 */
		},
		methods: {
			ev_loading_header: function(datas){ 
				this.loading_header=datas.loading;
			},
			/**
	     * MAJ la commande via le cron,
	     */
	     build_reload_cron: async function(){
				 this.loading_header=true;
					this.current_order = await this.get_order_by(this.create_invoice_modal_body.id_order);
					await this.reload_cron_by_IdOrder(this.create_invoice_modal_body.id_order);
					// console.log('Information sur la commande : ', this.current_order);
					await this.close_modal();
					await this.getdatas_v2();
					this.loading_header=false;
	    },
			close_modal: async function(){
				$('#' + this.id_modal).modal('hide');
			},
			reload_cron_by_IdOrder(id_order){
				var self=this;
				return new Promise ((resole)=>{
					self.$http.get('/comptabilte/cron.php?update='+id_order)
					.then(function (response) {
    				console.log(response);
						resole(true);
  				})
  				.catch(function (error) {
    				console.log(error);
						resole(false);
  				});
				});
			},
			reload_cron_by_day: async function(created_at){
				var self=this;
				var date_min = moment(created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
				var date_max = moment(created_at, "YYYY-MM-DD HH:mm:ss").add(1, "days").format("YYYY-MM-DD");
				return new Promise ((resole)=>{
					self.$http.get('/comptabilte/cron.php?mindate='+date_min+'&maxdate='+date_max+'&amazon=disable')
					.then(function (response) {
    				console.log(response);
						resole(true);
  				})
  				.catch(function (error) {
    				console.log(error);
						resole(false);
  				});
				});
			},
			 get_order_by(order_id){
				var  self=this;
				return new Promise((resolve, reject)=>{
					for(const i in self.orders){
						if(self.orders[i].id_order === order_id){
							resolve(self.orders[i]);
							return self.orders[i];
						}
					}
					reject(false);
				});
			},
			reload_row: function(value) {
				var self = this;
				var keys = [];
				if (this.input_datedebut) {
					keys.push('datetime');
				}
				if (this.input_datefin) {
					keys.push('datetime_fin');
				}

				var data = buildArray(this.default_rows, keys, self.modedebug);
				self.rows = data.rows;
				self.headers = data.headers;
			},
			apply_input_firstday: function(date) {
				this.input_firstday = date;
			},
			apply_input_lastday: function(date) {
				this.input_lastday = date;
			},
			saveSelectDate: function() {
				// console.log('Prepare to save : ', this.input_firstday,
				// this.input_lastday);
				let input_firstday = getDateMySql(this.input_firstday);
				let input_lastday = getDateMySql(this.input_lastday)
				Cookies.set('input_firstday', input_firstday);
				Cookies.set('input_lastday', input_lastday);
				// console.log('Date save french : ', input_firstday,
				// input_lastday);
			},
			get_new_datas: function() {
				var self = this;
				console.log('emit get_new_datas');
			},
			inputsubmit: function() {
				console.log('inputsubmit perform');
				this.saveSelectDate();
				this.getdatas();
			},
			buildAccordion: function(datas) {
				var accordion = [];
				$.each(datas, function(i, val) {
					accordion.push({
						title: i,
						body: val
					});
				});
				this.requests = accordion;
			},
			getdatas: function() {
				var self = this;
				console.log('date before send : ', self.input_firstday, ' fin : ',
					self.input_lastday);
				var params = {
					config: {
						'page': 1,
						'nombre': 20,
						'datatype': $('.get-datatype').attr('datatype'),
						'databaseConfig': this.databaseConfig
					},
					query: {
						datedebut: self.input_firstday,
						datefin: self.input_lastday,
					},
					filters: self.filters,
				}; /**/
				// console.log('params before send : ', params);
				params = JSON.stringify(params);
				url = self.root + '/getcommandes.php';
				$.ajax({
					url: url,
					method: 'GET',
					data: 'datas=' + params,
					// async : false,
					success: function(data) {
						console.log(data);
						self.orders = data.orders;
						self.stats = data.stats;
						self.buildDataChart(data);
						self.default_rows = data.orders;
						//
						self.buildAccordion(data.requests);
						self.buildArray();
					},
					error: function(error) {
						console.log('error to get datas');
						console.log(error);
						$('#displayErrorAjax').html(error.responseText);
					}
				});
			},
			getdatas_v2: async function() {
				var token = '';
				if ($('.get-datatype').attr('datatype') == 'BD_commandes') {
					token = 'get_datas_page_commande';
				}
				if ($('.get-datatype').attr('datatype') == 'BD_commandes_shopify') {
					token = 'get_datas_page_commande_shopify';
				}
				/*
				console.log('this.config__manage_connect : ', this.config__manage_connect,
					token);
					/**/
				this.$refs.getCommandes.send_data(this.config__manage_connect, token);
			},
			data_from_ajax: async function(datas) {
				var self = this;
				console.log(datas);
				if (datas.status) {
					var datas_return = datas.data.return;
					/**
					 * Tableau des commandes
					 */
					if (datas_return.orders) {
						self.orders = datas_return.orders;
						self.default_rows = datas_return.orders;
						await self.buildArray();
					}
					/**
					 * Statistique de vente.
					 */
					if (datas_return.stats) {
						self.stats = datas_return.stats;
					}
					/**
					 * affiche les graphes
					 */
					if (datas_return.chart_datasets) {
						self.buildDataChart(datas_return);
					}
					/**
					 * Affichage des requetes.
					 */
					if (datas_return.querys) {
						self.buildAccordion(datas_return.querys);
					}

				}
			},
			buildArray: async function() {
				var self = this;
				var data = buildArray(self.orders, [], self.modedebug);
				// console.log(data);
				self.rows = data.rows;
				self.headers = data.headers;
				self.footers = data.footers;
			},
			buildDataChart: function(data) {
				var self = this;
				var max_label = 300,
					i = 1;
				var montants = [];
				var num_orders = [];
				var labels = [];

				if (self.input_firstday != '' && self.input_lastday == '') {
					var today = new Date();
					// var currentDate = new Date(
					// getDateMySql(self.input_firstday, hour='00:00:00') );
					var currentDate = new Date(self.input_firstday);
					currentDate = currentDate.getTime();
					var todayTIME = today.getTime();
					while (currentDate <= todayTIME && i <= max_label) {
						// console.log(currentDate);
						d2 = new Date(currentDate);
						var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) :
							(d2.getMonth() + 1);
						var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
						var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
						labels.push(currentDate_french);

						var date = new Date(currentDate);
						currentDate = date.setDate(date.getDate() + 1);
						// montant_sell; number_order
						var result = this.getValues(currentDate_french, data.chart_datasets);
						montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
						num_orders.push((result['number_order']) ? result['number_order'] :
							0);
						i++;
					}
				} else if (self.input_firstday == '' && self.input_lastday != '') {
					max_label = 100;
					var today = new Date();
					// var currentDate = new Date(
					// getDateMySql(self.input_lastday, hour='00:00:00') );
					var currentDate = new Date(self.input_lastday);
					currentDate = currentDate.getTime();
					var todayTIME = today.getTime();
					while (i <= data.chart_datasets.length && i <= max_label) {
						// console.log(currentDate);
						d2 = new Date(currentDate);
						var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) :
							(d2.getMonth() + 1);
						var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
						var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
						labels.push(currentDate_french);

						var date = new Date(currentDate);
						currentDate = date.setDate(date.getDate() - 1);
						// montant_sell; number_order
						var result = this.getValues(currentDate_french, data.chart_datasets);
						montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
						num_orders.push((result['number_order']) ? result['number_order'] :
							0);
						i++;
					}
					montants = montants.reverse();
					num_orders = num_orders.reverse();
					labels = labels.reverse();
				} else if (self.input_firstday != '' && self.input_lastday != '') {
					// var today = new Date(getDateMySql(self.input_lastday,
					// hour = '00:00:00'));
					var today = new Date(self.input_lastday);
					// var currentDate = new
					// Date(getDateMySql(self.input_firstday, hour =
					// '00:00:00'));
					var currentDate = new Date(self.input_firstday);
					currentDate = currentDate.getTime();
					var todayTIME = today.getTime();
					while (currentDate <= todayTIME && i <= max_label) {
						// console.log(currentDate);
						d2 = new Date(currentDate);
						var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) :
							(d2.getMonth() + 1);
						var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
						var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
						labels.push(currentDate_french);

						var date = new Date(currentDate);
						currentDate = date.setDate(date.getDate() + 1);
						// montant_sell; number_order
						var result = this.getValues(currentDate_french, data.chart_datasets);
						montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
						num_orders.push((result['number_order']) ? result['number_order'] :
							0);
						i++;
					}
				} else if (self.input_firstday == '' && self.input_lastday == '') {
					var dateFin = new Date();
					var FirstDayOfMonth = dateFin.getFullYear() + '-' + (dateFin.getMonth() +
						1) + '-01';
					var dateDebut = new Date(FirstDayOfMonth);
					console.log(dateDebut);
					var dateFin_TIME = dateFin.getTime(); // console.log('Date
					// FIN :
					// '+dateFin_TIME);
					var dateDebut_TIME = dateDebut.getTime(); // console.log('Date
					// Debut :
					// '+dateDebut_TIME);

					while (dateFin_TIME >= dateDebut_TIME && i <= max_label) {
						// console.log(dateDebut_TIME);
						d2 = new Date(dateDebut_TIME);
						var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) :
							(d2.getMonth() + 1);
						var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
						var dateDebut_TIME_french = day + '-' + mois + '-' + d2.getFullYear();
						labels.push(dateDebut_TIME_french);

						var date = new Date(dateDebut_TIME);
						dateDebut_TIME = date.setDate(date.getDate() + 1);
						// montant_sell; number_order
						var result = this.getValues(dateDebut_TIME_french, data.chart_datasets);
						montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
						num_orders.push((result['number_order']) ? result['number_order'] :
							0);
						i++;
					}
				}
				//

				var grapheMontant = {
					label: '# Montant des ventes en €',
					data: montants,
					backgroundColor: ['rgba(25, 99, 132, 0.2)', ],
					borderColor: ['rgba(25, 99, 132, 0.8)', ],
					borderWidth: 1
				};
				var grapheNum_order = {
					label: '# Nombre de commandes',
					data: num_orders,
					backgroundColor: ['rgba(25, 199, 132, 0.5)', ],
					borderColor: ['rgba(25, 199, 132, 1)', ],
					borderWidth: 1
				};
				// montant
				self.chart_labels = [];
				self.chart_labels = labels;
				self.chart_datasets = [];
				self.chart_datasets.push(grapheMontant);
				// self.chart_datasets.push(grapheNum_order);
				self.chart_show_graph = true;
				// count
				self.chart_show_graph_count = true;
				self.chart_labels_count = [];
				self.chart_labels_count = labels;
				self.chart_datasets_count = [];
				self.chart_datasets_count.push(grapheNum_order);

				/*
				 * $.each(data.brute.rq3, function(f,k){
				 * self.chart_labels.push() });
				 */
			},
			getValues: function(dateFrench, rows) {
				var montant = 0;
				$.each(rows, function(j, k) {
					if (k['date_sell'] == dateFrench) {
						montant = k; // k['montant_sell'];
						return montant;
					}
				});
				return montant;
			},
			active_modal_create_invoice: function(index) {
				var self = this;
				 //console.log('active_modal_create_invoice: ', index);
				if (self.modedebug > 0) {
					index['modedebug'] = 1;
				} else {
					index['modedebug'] = -1;
				}
				if (this.config__manage_connect && this.config__manage_connect.current_compagny) {
					index.current_compagny = this.config__manage_connect.current_compagny;
				} else {
					alert('Error');
					return;
				}
				if (this.config__manage_connect && this.config__manage_connect.databaseConfig) {
					index.databaseConfig = this.config__manage_connect.databaseConfig;
				} else {
					alert('Error');
					return;
				}
				self.create_invoice_modal_body = index; // {'id_order':index};
				self.create_invoice_modal_body.modedebug = self.config__manage_connect.modedebug;

				var id_modal = self.id_modal;
				var metafield = index;
				$('#' + id_modal).modal({});
				// execute after show modal
				$('#' + id_modal).on('shown.bs.modal', function(e) {
					if (index.plateforme == 'shopify') {
						var logo = '<img src="/comptabilte/img/logo-shopify.png">';
					} else {
						var logo = '<img src="/comptabilte/img/logo-amazon.png">';
					}
					self.titre_modal_preview_img =
						`
	  			<div  class="d-flex group-logos"><span>` + logo +
						`</span> <span class="commande">` + index.id_order +
						`</span></div>
	  		`,
						self.actionparent = index.id_order;
					self.id_commande = index.id_order;
					// Ajouce le code ci-dessous pour empecher l'execution
					// multiple.
					$('#' + id_modal).off('shown.bs.modal');
				});
			},
			open_config_modal: function() {
				var self = this;
				var id_modal = 'model-confis';
				$('#' + id_modal).modal({});
				self.actionparent_config = self.actionparent_config + 1;
			},
			select_tab: function(e) {
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
				/**
				 * Display table
				 */
				self.buildArray();
			},
			reload_commande: function(datas) {
				var self = this;
				console.log(" Recharge la commande ");
				/*
				console.log(datas);
				if (datas.order && datas.order.id_order) {
					var id = datas.order.id_order;
					var rows = self.rows;
					console.log(id, rows[id]);
					if (rows[id]) {
						console.log(self.modedebug);
						if (self.modedebug > 0) {
							if (datas.invoice && datas.invoice.ref) {
								rows[id].qb_doc_number_test = datas.invoice.ref;
							}
							if (datas.payement && datas.payement.ref) {
								rows[id].qb_payment_number_test = datas.payement.ref;
							}
							if (datas.void_invoice) {
								rows[id].qb_voided_test = datas.void_invoice;
							}
						} else {
							if (datas.invoice && datas.invoice.ref) {
								rows[id].qb_doc_number = datas.invoice.ref;
							}
							if (datas.payement && datas.payement.ref) {
								rows[id].qb_payment_number = datas.payement.ref;
							}
							if (datas.void_invoice) {
								rows[id].qb_voided = datas.void_invoice;
							}
						}
						setTimeout(function() {
							$('#text' + id).css({
								'color': '#3a8447'
							});
						}, 800);
					}
					self.rows = rows;
					console.log(self.rows);
				}
				/* */
			},
			getconfig__manage_connect: async function(configs) {
				var self = this;
				self.input_firstday = '';
				self.input_lastday = '';
				this.config__manage_connect = configs;
				console.log('configs :: ', configs);
				var month = await this.getColumnInfo(configs.filters, 'created_at',
					'LIKE');
				if (month) {
					self.input_firstday = month.value + '-01';
					var endDate = await getDateEndMonth(self.input_firstday);
					self.input_lastday = await convertObjectDateToMysqlDate(endDate);
				}
				//
				var input_firstday = await this.getColumnInfo(configs.filters,
					'created_at', '>=');
				if (input_firstday) {
					self.input_firstday = input_firstday.value;
				}
				var input_lastday = await this.getColumnInfo(configs.filters,
					'created_at', '<');
				if (input_lastday) {
					input_lastday = await addDay(input_lastday.value, -1);
					input_lastday = await convertObjectDateToMysqlDate(input_lastday);
					// console.log('input_lastday :: ', input_lastday);
					self.input_lastday = input_lastday;
				}

				this.getdatas_v2();
			},
			getColumnInfo: async function($filters, $column, $operateur) {
				var result = false;
				if ($filters.AND) {
					$.each($filters.AND, function(i, v) {
						if (v.column == $column && v.operator == $operateur) {
							result = v;
						}
					});
				}
				return result;
			}
		},
		// :card_info_header="stat.card_info_header"
		// :card_info_infos="stat.card_info_infos"
		// :card_info_suffix="stat.card_info_suffix"
		components: {
			'liste_badge': {
				template: `<card_info :card_info_header_nombre="card_info_header_nombre" :card_info_show="card_info_show" :card_info_infos="card_info_infos" :card_info_header="card_info_header" :card_info_suffix="card_info_suffix" :card_info_color="card_info_color" :card_info_suffix_after="card_info_suffix_after"></card_info>`,
				props: {
					current_stat: [Object, Array],
				},
				data: function() {
					return {
						card_info_show: true,
						// card_info_suffix:'Total',
					}
				},
				// card_info_header
				mounted: function() {
					//
				},
				computed: {
					card_info_header: {
						get: function() {
							/**
							 * Console.log(this.current_stat);
							 * if(this.current_stat.card_info_header=='amazon'){
							 * return 'Ventes Amazon';}
							 * if(this.current_stat.card_info_header=='shopify'){
							 * return 'Ventes Shopify';}
							 */
							return this.current_stat.card_info_header;
						}
					},
					card_info_infos: {
						get: function() {
							return (this.current_stat.card_info_infos) ? this.current_stat.card_info_infos :
								'0';
						}
					},
					card_info_color: {
						get: function() {
							return (this.current_stat.color) ? this.current_stat.color : '';
						}
					},
					card_info_header_nombre: {
						get: function() {
							return (this.current_stat.card_info_header_nombre) ? '<span>' +
								this.current_stat.card_info_header_nombre + '</span> Ventes' :
								'<span>0</span> Vente';
						}
					},
					card_info_suffix: {
						get: function() {
							/*
							 * if(this.current_stat.card_info_header=='Ventes
							 * Amazon'){ return 'Total HT'; } else
							 * if(this.current_stat.card_info_header=='Ventes
							 * totales'){ return 'Total HT'; }
							 */
							return 'Total TTC';
						},
					},
					card_info_suffix_after: {
						get: function() {
							if (this.current_stat.suffix_total) {
								var data = this.current_stat.suffix_total;
								return data.replace('.', ',');
							}
							return '';
						}
					}
				},
			},
		},
		beforeUpdate() {
			// console.log('beforeUpdate : '+this.input_datedebut);
			/**
			 *
			 */
		},
		// template: '#template-profile',


	});



	function getDateIso8601(val, hour = '23:59:59') {
		var dataiso = '';
		if (val) {
			val = val.split('-');
			if (val[2]) {
				dataiso += val[2];
			}
			if (val[1]) {
				dataiso += '-' + val[1];
			}
			if (val[0]) {
				dataiso += '-' + val[0];
			}
			dataiso += 'T' + hour;
			return dataiso;
		}
	}

	function buildArray(rows, filedsPlus, modedebug = -1) {
		var results = {},
			total = {
				number: 0,
				monney: 0,
			};
		var headers = [],
			footers = {};
		var removeIt = {
			first_name: 'jptest',
		}
		var valide_key = {

			space_color: {
				name: 'space_color',
				label: ' ',
			},
			id_order: {
				name: 'id_order',
				label: '#',
				perfom: ['check_add_test_mode'],
			},
			passerelle: {
				name: 'passerelle',
				label: 'passerelle',
				perfom: [],
				addclass_td: {
					before: 'bg-',
					tbody: 'hide-text',
					custom: 'text-center'
				},
			},
			created_at: {
				name: 'created_at',
				label: 'Date',
				perfom: ['getMysqlDateToFrench'],
			},
			plateforme: {
				name: 'plateforme',
				label: 'Amazon/shopify',
				addclass_tr: {
					before: 'tdcolor-',
				},
				addclass_td: {
					custom: 'd-none'
				},
			},
			financial_status: {
				name: 'financial_status',
				label: 'Statut du paiement',
				addclass_tr: {
					before: 'bg-',
				},
				addclass_td: {
					custom: 'text-center'
				},
			},
			status: {
				name: 'status',
				label: 'Paiement / Statut',
				perfom: ['paiement_status'],
				addclass_tr: {
					before: 'bg-',
				},
				addclass_td: {
					custom: 'text-center'
				},
			},
			/*
			 * passerelle : { name:'passerelle', label:'Passerelle', },
			 */
			panier_ttc: {
				name: 'panier_ttc', // 'Montant HT en Euro',
				label: 'Panier TTC',
				perfom: ['add_EURO'],
				addclass_td: {
					custom: 'text-right'
				},
			},
			total_paid: {
				label: 'Total payé',
				name: 'total_paid',
				perfom: ['add_EURO', ],
				addclass_td: {
					custom: 'text-right'
				},
			},
			/*
			 * total_paid :{ label:'Total TTC', name:'panier_tva',
			 * perfom:['add_EURO'], },//'Montant en Euro',
			 */
			seller_sku: {
				name: 'seller_sku',
				label: 'Seller Sku',
				display: false,
				addclass_td: {
					custom: 'd-none'
				},
			},
			test_mode: {
				name: 'test_mode',
				label: 'testmode',
				display: false,
				addclass_tr: {
					before: 'test',
				},
				addclass_td: {
					custom: 'd-none'
				},
			},
			qb_doc_id: {
				name: 'qb_doc_id',
				label: 'ID de la facture (QB)',
				display: false,
				addclass_td: {
					custom: 'd-none'
				},
			},
			qb_doc_id_test: {
				name: 'qb_doc_id_test',
				label: 'ID de la facture (QB)',
				display: false,
				addclass_td: {
					custom: 'd-none'
				},
			},
			qb_payment_id: {
				name: 'qb_payment_id',
				label: 'ID du payement (QB)',
				display: false,
				addclass_td: {
					custom: 'd-none'
				},
			},
			qb_payment_id_test: {
				name: 'qb_payment_id_test',
				label: 'ID du payement (QB)',
				display: false,
				addclass_td: {
					custom: 'd-none'
				},
			},
		};
		if (!(modedebug > 0)) {
			valide_key['qb_doc_number'] = {
				name: 'qb_doc_number',
				addclass_td: {
					custom: 'd-none'
				},
			};
			valide_key['qb_payment_number'] = {
				name: 'qb_payment_number',
				addclass_td: {
					custom: 'd-none'
				},
			};
			valide_key['qb_voided'] = {
				name: 'qb_voided',
				addclass_td: {
					custom: 'd-none'
				},
			};
		} else {
			valide_key['qb_doc_number_test'] = {
				name: 'qb_doc_number_test',
				addclass_td: {
					custom: 'd-none'
				},
			};
			valide_key['qb_payment_number_test'] = {
				name: 'qb_payment_number_test',
				addclass_td: {
					custom: 'd-none'
				},
			};
			valide_key['qb_voided_test'] = {
				name: 'qb_voided_test',
				addclass_td: {
					custom: 'd-none'
				},
			};

		}


		// //
		$.each(filedsPlus, function(i, v) {
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
		// console.log(valide_key);
		$.each(rows, function(key, valeur) {
			var remove = false;
			var id = valeur.id_order;
			results[id] = {};
			total.number += 1;
			$.each(valide_key, function(index, value) {
				// sous object
				if ((value instanceof Array || value instanceof Object)) {
					// multiple filed
					if (value.addfield && value.obj) {
						var infos = '';
						if (value.obj instanceof Array) {
							$.each(value.addfield, function(c, vl) {
								if (valeur[value.obj[0]][0]) {
									infos += ' ' + valeur[value.obj[0]][0][vl];
								}
							});
						} else {
							$.each(value.addfield, function(c, vl) {
								infos += ' ' + valeur[value.obj][vl];
							});
						}
						// active remove
						if (removeIt[value.name] && (removeIt[value.name] == valeur[value.obj]
								[value.name])) {
							remove = true;
						}
						results[id][value.name] = valeur[value.obj][value.name] + infos;
					} else if (value.obj) {
						if (value.obj instanceof Array) {
							if (valeur[value.obj[0]][0]) {
								results[id][value.name] = valeur[value.obj[0]][0][value.name];
							}
						} else {
							results[id][value.name] = valeur[value.obj][value.name];
						}
					} else {
						results[id][value.name] = valeur[value.name];
					}
					// active remove
					if (removeIt[value.name] && (removeIt[value.name] == results[id][
							value.name
						])) {
						remove = true;
					}

					// format data
					if (value.perfom) {
						$.each(value.perfom, function(i, f) {
							if (f == 'getDateinFrench') {
								results[id][value.name] = getDateinFrench(results[id][value.name]);
							} else if (f == 'add_EURO') {
								if ('panier_ttc' == value.name) {
									var monney = precisionRound(results[id][value.name]); // console.log(results[id][value.name]+'
									// :
									// '+total.monney);
									total.monney += monney;
								}
								results[id][value.name] = add_EURO(results[id][value.name]);
							} else if (f == 'getDateinFrenchByTimestamp') {
								results[id][value.name] = getDateinFrenchByTimestamp(results[id]
									[value.name]);
							} else if (f == 'lower_case') {
								results[id][value.name] = lower_case(results[id][value.name]);
							} else if (f == 'paiement_status') {
								results[id][value.name] = paiement_status(results[id][value.name]);
							} else if (f == 'getMysqlDateToFrench') {
								results[id][value.name] = getMysqlDateToFrench(results[id][
									value.name
								]);
							} else if (f == 'check_add_test_mode') {
								// console.log(results[id]);
								// console.log(value);
								// console.log(valeur);
								if (valeur.test_mode) {
									results[id][value.name] = 'TEST ' + results[id][value.name];

								} else {
									results[id][value.name] = results[id][value.name];
								}
							}

						});
					}
				} else {
					results[id][index] = valeur[index];
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
			$.each(valide_key, function(index, value) {
				// results['total'][index]='';
				if (index == 'panier_ttc') {
					footers[index] = {};
					footers[index] = {
						name: index,
						label: add_EURO(total.monney)
					};
				}
			});
		}
		$.each(valide_key, function(index, value) { // console.log(index);
			headers.push(value);
		});
		return {
			'rows': results,
			'headers': valide_key,
			'footers': footers,
		};
	}

	/**
	 *
	 */
	function check_add_test_mode(value) {
		console.log(value);
	}

	/**
	 *
	 */
	function getDateMySql(val, hour = '23:59:59') {
		var dataiso = '';
		if (val) {
			val = val.split('-');
			if (val[2]) {
				dataiso += val[2].toString().padStart(2, '0');
			}
			if (val[1]) {
				dataiso += '-' + val[1].toString().padStart(2, '0');
			}
			if (val[0]) {
				dataiso += '-' + val[0].toString().padStart(2, '0');
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
		var french_date = (_date.getDate()) + '/' + (_date.getMonth() + 1) + '/' +
			(_date.getFullYear());
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
				day = '0' + day;
			}
			var mounth = _date.getMonth() + 1;
			if (mounth < 10) {
				mounth = '0' + mounth;
			}
			var mn = _date.getUTCMinutes();
			if (mn < 10) {
				mn = '0' + mn;
			}
			var french_date = day + '/' + mounth + '/' + (_date.getFullYear());
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
				data = data.replace('.', ',');
			}
			return data + ' €';
		} else if (data == 0) {
			data = '0 €';
		}
		return data;
	}

	function lower_case(data) {
		// console.log(data);
		if (data && data != '') {
			var d = data.toLowerCase();
			return d;
		}
		return '';
	}

	function getMysqlDateToFrench(data) {
		if (data && data != '') {
			var _date = new Date(data);
			french_date = (_date.getDate()).toString().padStart(2, '0') + '/' + (_date
					.getMonth() + 1).toString().padStart(2, '0') + '/' + (_date.getFullYear()) +
				' à ' + (_date.getHours()).toString().padStart(2, '0') + ':' + (_date.getMinutes())
				.toString().padStart(2, '0');
			return french_date;
		}
		return '';
	}


	/**
	 *
	 */
	function test() {
		var params = {
			config: {
				'path': '/admin/orders/812074172482.json',
				'uid': 123,
				'datatype': 'orders',
			},
		}; /**/
		params = JSON.stringify(params)
		$.ajax({
			url: $('body').attr('data-root') + '/shopify.php',
			method: 'GET',
			data: 'datas=' + params,
			// async : false,
			success: function(data) {
				console.log(data);
			},
			error: function(error) {
				console.log('error to get datas');
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
	function getSession(key) {
		return Cookies.get(key);
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
		var date_string = '';
		var new_date = new Date(date);
		date_string = new_date.getFullYear();
		date_string += '-';
		date_string += (new_date.getMonth() + 1).toString().padStart(2, '0');
		date_string += '-';
		date_string += (new_date.getDate()).toString().padStart(2, '0');
		return date_string;
	}

	async function getDateEndMonth(date) {
		var cal_date = new Date(date);
		return new Date(cal_date.getFullYear(), cal_date.getMonth() +
			1, 0);
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
