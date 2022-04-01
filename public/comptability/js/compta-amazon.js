jQuery(document).ready(function($) {

	/**
	 * https://codepen.io/tahazsh/pen/yGoYBb
	 */
	let handleOutsideClick;
	Vue.directive('closable', {
		bind(el, binding, vnode) {
				alert('open');
				console.log(el, binding, vnode);
				handleOutsideClick = (e) => {
					e.stopPropagation();
					const {
						handler, exclude
					} = binding.value;
					let clickedOnExcludedEl = false;
					exclude.forEach(refName => {
						console.log('****************************************************');
						if (!clickedOnExcludedEl) {
							const excludedEl = vnode.context.$refs[refName];
							console.log(vnode.context);
							console.log(excludedEl);
							if (excludedEl && excludedEl.contains) {
								clickedOnExcludedEl = excludedEl.contains(e.target);
							}
						}
					});
					if (!el.contains(e.target) && !clickedOnExcludedEl) {
						console.log(handler, vnode.context);
						vnode.context[handler]();
					}
				};
				document.addEventListener('click', handleOutsideClick);
				document.addEventListener('touchstart', handleOutsideClick);
			},
			unbind() {
				alert('close');
				document.removeEventListener('click', handleOutsideClick);
				document.removeEventListener('touchstart', handleOutsideClick);
			}
	});

	Vue.component('export-excel', ExportExcel);

	Vue.component('compta-add-filtre', {
		template: '#template-compta-add-filtre',
		delimiters: ['${', '}'],
		props: {
			configs_filtre: {
				type: [Array, Object]
			},
			trigger_ask_data: {
				type: Number,
				default: 0,
			},
			trigger_reset_data: {
				type: Number,
				default: 0,
			}
		},
		data: function() {
			return {
				root: $('body').attr('data-root'),
				/**
				 * Ajax get
				 */
				trigger_loanding: 0,
				url_get: '',
				querys: '',
				ajax_headers: {},
				/**
				 * datas
				 */
				settlement_id: {
					value: ''
				},
				list_files: {},
				zone_livraison: {
					value: ''
				},
				zones: {},
				/**
				 * Configs
				 */
				database_config: '',
			};
		},
		watch: {
			/**
			 * Ce cas de figure doit se regler en Amont.
			 */
			configs_filtre() {
					console.log(' compta-add-filtre configs_filtre ', this.configs_filtre);
					this.database_config = this.configs_filtre.databaseConfig;
					this.get_data();
				},
				/**/
				trigger_ask_data() {
					console.log('trigger_ask_data', this.trigger_ask_data);
					this.$emit('ev_data_from_addition_template', this.send_data_to_parent());
				},
				trigger_reset_data() {
					this.resetData();
				}
		},
		methods: {
			resetData() {
					this.settlement_id.value = '';
					this.zone_livraison.value = '';
				},
				get_data() {
					var self = this;
					var params = {
						'datas': 'list-payement',
						'databaseConfig': self.database_config,
					};
					this.querys = 'queries=' + JSON.stringify(params);
					this.url_get = self.root + '/getcommandes.php';
					this.trigger_loanding = this.trigger_loanding + 1;
				},
				data_from_ajax: function(datas) {
					console.log(datas);
					if (datas.status) {
						if (datas.data.config.datas === 'list-payement') {
							this.list_files = this.build_options(datas.data.list_commandes);
							this.zones = datas.data.zones;
						}
					}
				},
				build_options(list_files) {
					var self = this;
					var options = {};
					var i = 1;
					$.each(list_files, function(id, val) {
						if (i === 1) {
							self.first_id_file = val['settlement-id'];
						}
						options[val['settlement-id']] = {};
						options[val['settlement-id']] = 'Période du ' + val[
							'settlement-start-date'] + ' au ' + val['settlement-end-date'];
						i++;
					});
					return options;
				},
				send_data_to_parent() {
					return {
						settlement_id: this.settlement_id.value,
						zone_livraison: this.zone_livraison.value,
					}
				}
		}
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
			return {};
		},
	});

	/**
	 *
	 */
	Vue.component('filtre', {
		delimiters: ['${', '}'],
		template: '#template-filtre',
		props: {
			datas: [Object, Array, String, Number],
			database_config: {
				type: [String]
			}
		},
		data: function() {
			return {
				root: $('body').attr('data-root'),
				/**
				 * Ajax get
				 */
				trigger_loanding: 0,
				url_get: '',
				querys: '',
				ajax_headers: {},
				/**
				 *
				 */
				list_commandes: [],
				// build available date
				input_date: {
					value: ''
				},
				input_date1: {
					value: ''
				},
				input_date2: {
					value: ''
				},
				date_imports: {
					value: ''
				},

				options_date: {
					'all': 'Toutes les dates',
					'date': 'Dates exactes',
					// '2019-11-01': 'Mois en cours',
				},
				options_date1: {
					'2019-10-30': '2019-10-30',
					'2019-10-29': '2019-10-29',
					'2019-10-28': '2019-10-28',
					'2019-10-27': '2019-10-27',
					'2019-10-26': '2019-10-26',
				},
				options_date2: {
					'2019-10-30': '2019-10-30',
					'2019-10-29': '2019-10-29',
					'2019-10-28': '2019-10-28',
					'2019-10-27': '2019-10-27',
					'2019-10-26': '2019-10-26',
				},
				show_popup: false,
				list_files: [],
				/**
				 *
				 */
				input_firstday: '',
				label_firstday: 'Du',
				defaultvalue_firstday: '',
				/**
				 *
				 */
				input_firstday2: '',
				label_firstday2: 'Au',
				defaultvalue_firstday2: '',
				/**
				 * Mois en cours
				 */
				current_Month: '',
			};
		},
		watch: {
			database_config(value) {
				var self = this;
				console.log('value :: ', value);
				if (value !== '') {
					// setTimeout(function() {
					self.get_data();
					// }, 300);
				}
			}
		},
		mounted: function() {
			this.current_Month = this.getCurrentMonth();
			this.getDateByMonth();
		},
		methods: {
			getMonthInFrench: function(index) {
				var Month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai,', 'Juin',
					'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
				];
				return Month[parseInt(index)];
			},
			getDateByMonth: function() {
				var self = this;
				var loop_date = true;
				var options_date = self.options_date;
				self.options_date = {};
				var date = new Date(this.current_Month);
				var it = 0;
				while (loop_date) {

					// var month = (date.getMonth() + 1).toString().padStart(2,
					// '0');
					var month = date.getMonth();
					var year = date.getFullYear();
					// options_date[year + '-' + month + '-01'] = year + '-' +
					// month + '-01';
					options_date[year + '-' + (month + 1) + '-01'] = self.getMonthInFrench(
						month) + ' ' + year;

					if (it === 1) {
						/**
						 * On definit la date par defaut
						 */
						self.current_Month = year + '-' + (month + 1) + '-01';
						self.input_date.value = self.current_Month;
					}
					if (year === 2018 && month <= 11) {
						loop_date = false;
					}
					date.setMonth(date.getMonth() - 1);
					it++;
				}
				setTimeout(function() {
					// console.log('self.options_date : ', options_date);
					self.options_date = options_date;
				}, 1000);
			},
			getCurrentMonth: function() {
				var date = new Date();
				var month = date.getMonth() + 1;
				var year = date.getFullYear();
				return year + '-' + month + '-01';
			},
			data_from_ajax: function(datas) {
				console.log(datas);
				if (datas.status) {
					if (datas.data.config.datas === 'list-payement') {
						this.list_files = this.build_options(datas.data.list_commandes);
						this.bulld_avaible_date();
					}
				}
			},
			get_data() {
				var self = this;
				var params = {
					'datas': 'list-payement',
					'databaseConfig': self.database_config,
				};
				this.querys = 'queries=' + JSON.stringify(params);
				this.url_get = self.root + '/getcommandes.php';
				this.trigger_loanding = this.trigger_loanding + 1;
			},
			bulld_avaible_date() {
				// var self = this;
				// var list_commandes = {};
				$.each(this.list_commandes, function(i, ligne) {
					var date = new Date(ligne['settlement-start-date']);
					console.log(date);
				});
			},
			show_hide_popup: function() {
				if (this.show_popup) {
					this.show_popup = false;
				} else {
					this.show_popup = true;
				}
			},
			apply_filter: function() {
				// console.log('Apply_filter : ', '\n Date debut : ',
				// this.input_firstday, '\n Date fin : ', this.input_firstday2,
				// '\n input_date : ', this.input_date.value, '\n id_imports :
				// ', this.date_imports.value);
				this.$emit('ev_filter_datas', {
					input_date: this.input_date.value,
					input_date1: this.input_firstday, // date de debut.
					input_date2: this.input_firstday2, // date de fin.
					date_imports: this.date_imports.value // id de l'import
				});
			},
			/**
			 * Permet de corriger le decallage de mois. Format d'entre
			 * 2019-11-01
			 *
			 * @param {*}
			 *            date
			 */
			getValideDate: function(date) {
				if (date === '') {
					return date;
				}
				var date2 = date.split('-');
				if (date2[2] && date2[2] !== '') {
					var date_r = date2[0] + '-' + (parseInt(date2[1]) + 1) + '-' + date2[
						2];
					return date_r;
				}
				return date;
			},
			build_options: function(list_files) {
				var self = this;
				var options = {};
				var i = 1;
				$.each(list_files, function(id, val) {
					if (i === 1) {
						self.first_id_file = val['settlement-id'];
					}
					options[val['settlement-id']] = {};
					options[val['settlement-id']] = 'Période du ' + val[
						'settlement-start-date'] + ' au ' + val['settlement-end-date'];
					i++;
				});
				return options;
			},
			reinitialisation: function() {
				if (this.defaultvalue_firstday === "none") {
					this.defaultvalue_firstday = "";
				} else {
					this.defaultvalue_firstday = "none";
				}
				if (this.defaultvalue_firstday2 === "none") {
					this.defaultvalue_firstday2 = "";
				} else {
					this.defaultvalue_firstday2 = "none";
				}
				this.input_date.value = this.current_Month;
				this.date_imports.value = '';
			},
			onClose() {
				console.log(' onClose GO ');
				this.show_popup = false; 
			}
		}
	});

	/**
	 *
	 */
	new Vue({
		delimiters: ['${', '}'],
		el: '#compta-amazon',
		data: {
			date_imports: {
				value: ''
			},
			root: $('body').attr('data-root'),
			/**
			 * Ajax
			 */
			url_post: '',
			headers: {},
			post_datas: '',
			trigger_post_loanding: 0,
			/**
			 * Ajax
			 */
			trigger_loanding: 0,
			url_get: '',
			querys: '',
			/**
			 * tableau
			 */
			show_id: false,
			show_action: false,
			tableau_rows: [],
			tableau_headers: [],
			footers: [],
			show_footer: false,
			align_header: true,
			show_reel_index: true,
			//
			tableau_rows_refund: [],
			tableau_headers_refund: [],
			/**
			 *
			 */
			list_files: [],
			first_id_file: '',
			/**
			 *
			 */
			modedebug: 0,
			requests: [],
			result_of: {},
			config__manage_connect: {},
			databaseConfig: '',
			/**
			 * downloadExcel
			 */
			show_text_download_file: false,
			/**
			 * Entete du fichier Excel.
			 */
			reverse_json_fields_excel: {},
			is_runnings_excel: false,
			namefile_excel: "Compta-amazon.xls",
			/**
			 * contient les données brutes
			 */
			tableau_ordersexcel: [],
			/**
			 *  Contient les données formattées.
			 */
			tableau_ordersexcel_format: [],
			/**
			 * Alert
			 */
			show_alert: false,
			class_alert: "alert-danger",
			alert_message: "",
		},
		mounted: function() {
			// this.get_listes();
			/**
			 * Get mode
			 */
			this.modedebug = parseInt(Cookies.get('modedebug'));
		},
		methods: {
			data_from_ajax: async function(datas) {
				var self = this;
				console.log(datas);

				var arrays = {};
				if (datas.status) {
					/**
					 * ce code est dépaser,  utilise lemodel avec datas.data.configs.
					 */
					if (datas.data.config && datas.data.config.datas === 'compta-amazon' &&
						datas.data.config[
							'transaction-type'] === 'order') {
						arrays = await buildArray(datas.data.orders, 'order-id');
						// console.log(arrays);
						this.tableau_rows = arrays.rows;
						this.tableau_headers = arrays.headers;
						/**
						 * set querries
						 */
						if (datas.data.queries) {
							this.add_querries(datas.data.queries);
						}
						/**
						 * put datas for export like excel
						 */
						await this.set_json_fields_excel();
						/**
						 * Load refund
						 */
						datas = self.result_of;
						self.get_refunds(datas.date_imports, datas.input_date, datas.input_date1,
							datas.input_date2);
					}
					/**
					 * ce code est dépaser,  utilise lemodel avec datas.data.configs.
					 */
					else if (datas.data.config && datas.data.config.datas ===
						'list-payement') {
						this.list_files = this.build_options(datas.data.list_commandes);
						/**
						 * Load first file order and refund
						 */
						$.when(self.get_commandes(self.first_id_file)).then(function() {
							self.get_refunds(self.first_id_file);
						});
						/**
						 * set first value to select
						 */
						this.date_imports.value = this.first_id_file;
						/**
						 * set querries
						 */
						if (datas.data.queries) {
							this.add_querries(datas.data.queries);
						}
					}
					/**
					 * ce code est dépaser,  utilise lemodel avec datas.data.configs.
					 */
					else if (datas.data.config && datas.data.config.datas ===
						'compta-amazon' && datas.data.config[
							'transaction-type'] === 'Refund') {
						arrays = await buildArray(datas.data.orders, 'order-id');
						// console.log(arrays);
						this.tableau_rows_refund = arrays.rows;
						this.tableau_headers_refund = arrays.headers;
						/**
						 * Set querries
						 */
						if (datas.data.queries) {
							this.add_querries(datas.data.queries);
						}
						/**
						 * exportation est possible.
						 */
						this.is_runnings_excel = false;
					}
					/**
					 * Code valide avec la nouvelle methode.
					 */
					else if (datas.data.configs && datas.data.configs['transaction-type'] ===
						'order') {
						/**
						 * on cache le message.
						 */
						this.ev_close_alert();
						arrays = await buildArray(datas.data.return.orders, ['order-id',
							'ht'
						]);
						// console.log(arrays);
						this.tableau_rows = arrays.rows;
						this.tableau_headers = arrays.headers;
						/**
						 * set querries
						 */
						if (datas.data.return.queries) {
							this.add_querries(datas.data.return.queries);
						}
						/**
						 * put datas for export like excel
						 */
						await this.set_json_fields_excel();
						/**
						 * les données pour l'export excel.
						 */
						this.tableau_ordersexcel = [];
						if (datas.data.return.ordersexcel) {
							this.tableau_ordersexcel.push(datas.data.return.ordersexcel);
						}
						/**
						 * Affiche le message si necessaire
						 */
						if (datas.data.return.orders_message && datas.data.return.orders_message !==
							'') {
							this.alert_display_error_warning(datas.data.return.orders_message);
						}

						/**
						 * Load refund
						 */
						self.get_refunds_v2();
					}
					/**
					 * Code valide avec la nouvelle methode.
					 */
					else if (datas.data.configs && datas.data.configs['transaction-type'] ===
						'Refund') {
						arrays = await buildArray(datas.data.return.orders, ['order-id',
							'ht'
						]);
						// console.log(arrays);
						this.tableau_rows_refund = arrays.rows;
						this.tableau_headers_refund = arrays.headers;
						/**
						 * Set querries
						 */
						if (datas.data.return.queries) {
							this.add_querries(datas.data.return.queries);
						}
						/**
						 * les données pour l'export excel.
						 */
						if (datas.data.return.ordersexcel) {
							this.tableau_ordersexcel.push(datas.data.return.ordersexcel);
						}
						/**
						 * exportation est possible.
						 */
						this.is_runnings_excel = false;

						/**
						 * Construit les données pour l'exportation.
						 */
						await this.formatDataToxport();
					}
				} else {
					console.log('error ');
				}
			},
			ev_close_alert() {
				this.show_alert = false;
				this.class_alert = "";
				this.alert_message = "";
			},
			alert_close_static() {
				this.ev_close_alert();
			},
			alert_display(msg = null, type = "success") {
				this.show_alert = true;
				this.class_alert = "alert-" + type;
				this.alert_message = msg;
			},
			alert_display_error_danger(msg = null) {
				this.alert_display(msg, "danger");
			},
			alert_display_error_warning(msg = null) {
				this.alert_display(msg, "warning");
			},
			alert_display_error_success(msg = null) {
				this.alert_display(msg, "success");
			},
			filter_datas: function(datas) {
				console.log('filter_datas : ', datas);
				/*
				 * if(datas.input_date1){ var date =
				 * datas.input_date1.split('-'); datas.input_date1 =
				 * date[2]+'-'+date[1]+'-'+date[0]; } if(datas.input_date2){ var
				 * date = datas.input_date2.split('-'); datas.input_date2 =
				 * date[2]+'-'+date[1]+'-'+date[0]; }
				 */
				this.result_of = datas;
				this.get_commandes(datas.date_imports, datas.input_date, datas.input_date1,
					datas.input_date2);
				// this.get_refunds( datas.date_imports, datas.input_date,
				// datas.input_date1, datas.input_date2 );
			},
			resetFields: function() {
				//
			},
			get_commandes: function(id, modeselection, dateDebut = null, dateFin =
				null) {
				// console.log(' Load order ');
				this.requests = [];
				this.is_runnings_excel = true;
				var self = this;
				var params = {
					'datas': 'compta-amazon',
					'settlement-id': id,
					'transaction-type': 'order',
					'datedebut': dateDebut,
					'datefin': dateFin,
					'modeselection': modeselection,
					'databaseConfig': self.databaseConfig,
				};
				this.querys = 'queries=' + JSON.stringify(params);
				this.url_get = self.root + '/getcommandes.php';
				this.trigger_loanding = this.trigger_loanding + 1;
			},
			/**
			 * Charge les commandes via le nouveau principe ( i.e via le filtre dynamique )
			 */
			get_commandes_v2() {
				this.requests = [];
				this.url_post = this.root + '/getcommandes.php';
				this.post_datas = {
					'databaseConfig': this.databaseConfig,
					'filters': this.config__manage_connect.filters,
					'transaction-type': 'order',
					'settlement-id': this.config__manage_connect.settlement_id,
					'zone': this.config__manage_connect.zone_livraison,
				};
				this.headers = {
					"Content-Type": "application/json",
					"X-CSRF-Token": "commande_amazon",
					Accept: "application/json"
				};
				this.trigger_post_loanding++;
			},
			get_refunds: function(id, modeselection, dateDebut = null, dateFin =
				null) {
				// console.log('Load refunds');
				var self = this;
				var params = {
					'datas': 'compta-amazon',
					'settlement-id': id,
					'transaction-type': 'Refund',
					'datedebut': dateDebut,
					'datefin': dateFin,
					'modeselection': modeselection,
					'databaseConfig': self.databaseConfig,
				};
				this.querys = 'queries=' + JSON.stringify(params);
				this.url_get = self.root + '/getcommandes.php';
				this.trigger_loanding = this.trigger_loanding + 1;
			},
			get_refunds_v2() {
				this.url_post = this.root + '/getcommandes.php';
				this.post_datas = {
					'databaseConfig': this.databaseConfig,
					'filters': this.config__manage_connect.filters,
					'transaction-type': 'Refund',
					'settlement-id': this.config__manage_connect.settlement_id,
					'zone': this.config__manage_connect.zone_livraison,
				};
				this.headers = {
					"Content-Type": "application/json",
					"X-CSRF-Token": "commande_amazon",
					Accept: "application/json"
				};
				this.trigger_post_loanding++;
			},
			get_listes: function() {
				var self = this;
				var params = {
					datas: 'list-payement',
					'databaseConfig': self.databaseConfig,
				};
				this.querys = 'queries=' + JSON.stringify(params);
				this.url_get = self.root + '/getcommandes.php';
				this.trigger_loanding = this.trigger_loanding + 1;
			},
			build_options: function(list_files) {
				var self = this;
				var options = {
					'': 'Choisir ...'
				};
				var i = 1;
				$.each(list_files, function(id, val) {
					if (i === 1) {
						self.first_id_file = val['settlement-id'];
					}
					options[val['settlement-id']] = {};
					options[val['settlement-id']] = 'Période du ' + val[
						'settlement-start-date'] + ' au ' + val['settlement-end-date'];
					i++;
				});
				return options;
			},
			on_change: function(id_file) {
				var self = this;
				$.when(self.get_commandes(id_file)).then(function() {
					self.get_refunds(id_file);
				});
			},
			select_tab: function(e) {
				var self = this;
				self.resetFields();
				// $(e.target).parent().find('.btn').removeClass('btn-primary').addClass('btn-outline-primary');
				// $(e.target).removeClass('btn-outline-primary');
				// $(e.target).addClass('btn-primary');
				var attr_mode = parseInt($(e.target).attr('data-modedebug'));
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
				//Cookies.set('modedebug', self.modedebug);
			},
			add_querries: function(new_querries) {
				//console.log(' New_querries : ', new_querries);
				var self = this;
				$.each(new_querries, function(i, val) {

					if (val.length && val.length > 0 && Array.isArray(val)) {
						$.each(val, function(k, b) {
							self.requests.push({
								title: i + ' ' + k,
								body: b
							});
						});
					} else {
						self.requests.push({
							title: i,
							body: val
						});
					}

				});
			},
			async getconfig__manage_connect(configs) {
				var self = this;
				self.input_firstday = '';
				self.input_lastday = '';
				this.config__manage_connect = configs;
				console.log('configs :: ', configs);
				await this.formatFilter();
				self.databaseConfig = configs.databaseConfig;
				if (configs.is_click) {
					self.is_runnings_excel = true;
					self.get_commandes_v2();
				}
				self.modedebug = configs.modedebug;
				self.requests = [];

			},
			async set_json_fields_excel() {
				this.reverse_json_fields_excel = {
					'order-id': "#",
					'posted-date': 'DATE',
					'doc-number': 'N° Facture',
					'qb-payment-number': 'N° Paiement',
					'ship-country': 'PAYS',
					//'montant': 'MONTANT',
					'ht': 'HT',
					'tva': 'TVA'
					//'shipping': 'SHIPPING',
					//'shipping-discount': 'Ship. disc',
					//'tva-shipping': 'TVA SHIPPING',
					//'tva-shipping-discount': 'Tva ship. disc',
				}; 
			},
			async formatFilter() {
				//var self = this;
				var new_filters = {};
				var filters = this.config__manage_connect.filters;
				$.each(filters, function(k, group) {
					new_filters[k] = [];
					$.each(group, function(i, field) {
						new_filters[k][i] = field;
						if (field.column === 'created_at') {
							new_filters[k][i].column = 'posted-date';
						}
					});
				});
				this.config__manage_connect.filters = new_filters;
			},
			getNameOfZone(id) {
				if (id === 'DOM-TOM') {
					return 'DOM-TOM';
				}
				if (id === 'OutsideEU') {
					return 'Monde';
				}
				if (id === 'WithinFrance') {
					return 'France';
				}
				if (id === 'OutsideFranceWithEU') {
					return 'Union Européenne';
				}
			},
			async formatDataToxport() {
				var self = this;
				var DaTaArray = [];
				if (this.tableau_ordersexcel.length && this.tableau_ordersexcel.length >
					0) {
					//console.log('Debut formatDataToxport');

					var dataArray = [];
					//console.log("DEbut execution de ObjectLoop", self.tableau_ordersexcel);
					await ObjectLoop(self.tableau_ordersexcel, dataArray, customAction);
					//console.log("Fin execution de ObjectLoop :: ", dataArray);
					self.tableau_ordersexcel_format = dataArray;
				}
				return DaTaArray;
			},
			async additionArray(array, mergeArray) {
				for (const item of array) {
					//await delayedLog(item);
					mergeArray.push(item);
				}
				//console.log('Fin de ladition des tableaux');
				return mergeArray;
			},
			async convertObjectToArray($rows, $array = null) {
				if (!$array) {
					$array = [];
				}
				//console.log('Debut Convertion en cours ... ');
				return new Promise(resolve => {
					var numbers = Object.keys($rows).length;
				//	console.log('Nombre delments dans lobject : ', numbers);
					var it = 1;
					$.each($rows, function(i, val) {
						$array.push(val);
						it++;
						if (it > numbers && false) {
							//console.log('Fin Convertion en cours');
							resolve({
								row_array: $array,
								status: true
							});
						}
					});
				});
				/**/
				/*
				await $.each($rows, async function(i, val) {
					$array.push(val);
				});
				return $array;
				/**/
			}
		},
	});



	/**
	 * tableau fonction
	 */
	async function buildArray(rows, ref, result_is_array = false, ) {
		//console.log('Tableau builder : ', rows);
		var results = {},
			results_array = [],
			total = {
				number: 0,
				monney: 0,
			};
		var headers = [],
			footers = {};
		var removeIt = {
			first_name: 'jptest',
		};

		var valide_key = {
			space_color: {
				name: 'space_color',
				label: ' ',
				addclass_tr: {
					custom: 'tdcolor-amazon',
				},
			},
			'order-id': {
				name: 'order-id',
				label: '#',
				perfom: [],
				addclass_td: {
					custom: 'identifiant',
				},
			},
			'posted-date': {
				name: 'posted-date',
				label: 'Date',
				perfom: ['getDateinFrench'],
				addclass_td: {
					custom: 'col-date',
				},
			},
			'doc-number': {
				name: 'doc-number',
				label: 'N° Facture',
				perfom: [''],
				addclass_td: {
					custom: 'doc-number',
				},
			},
			'qb-payment-number': {
				name: 'qb-payment-number',
				label: 'N° Paiement',
				perfom: [''],
				addclass_td: {
					custom: 'doc-number',
				},
			},
			'ship-country': {
				name: 'ship-country',
				label: 'Pays',
				addclass_td: {
					custom: '',
				},
			},
			'montant': {
				name: 'montant',
				label: 'Montant',
				perfom: ['roundTo'],
				addclass_td: {
					custom: 'text-right td-number',
				},
			},
			'ht': {
				name: 'ht',
				label: 'HT',
				perfom: ['roundTo'],
				addclass_td: {
					custom: 'text-right td-number',
				},
			},
			'tva': {
				name: 'tva',
				label: 'Tva',
				perfom: ['roundTo'],
				addclass_td: {
					custom: 'text-right td-number',
				},
			},
			'shipping': {
				name: 'shipping',
				label: 'Shipping',
				perfom: ['roundTo'],
				addclass_td: {
					custom: 'text-right td-number',
				},
			},
			'shipping-discount': {
				name: 'shipping-discount',
				label: 'Ship. disc',
				perfom: ['roundTo'],
				addclass_td: {
					custom: 'text-right td-number',
				},
			},
			'tva-shipping': {
				name: 'tva-shipping',
				label: 'Tva shipping',
				perfom: ['roundTo'],
				addclass_td: {
					custom: 'text-right td-number',
				},
			},
			'tva-shipping-discount': {
				name: 'tva-shipping-discount',
				label: 'Tva ship. disc',
				perfom: ['roundTo'],
				addclass_td: {
					custom: 'text-right td-number',
				},
			},
		};

		if (rows.PHP_execution_error || (!rows.length)) {
			//console.log('Return empty date');
			return {
				'rows': results,
				'headers': valide_key,
				'footers': footers,
			};
		} else {
			//console.log('Nombre de ligne : ', rows.length);
		}

		// console.log(valide_key);
		var id = '';
		await $.each(rows, async function(key, valeur) {
			//console.log("Construction du tableau");
			var remove = false;


			if (Array.isArray(ref)) {
				$.each(ref, function(ref_i, ref_v) {
					id += valeur[ref_v];
				});
			} else {
				id = valeur[ref];
			}


			results[id] = {};
			total.number += 1;
			await $.each(valide_key, async function(index, value) {
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
						if (removeIt[value.name] && (removeIt[value.name] === valeur[value.obj]
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
					if (removeIt[value.name] && (removeIt[value.name] === results[id][
							value.name
						])) {
						remove = true;
					}

					// format data
					if (value.perfom) {
						await $.each(value.perfom, async function(i, f) {
							if (f === 'getDateinFrench') {
								results[id][value.name] = getDateinFrench(results[id][value.name]);
							} else if (f === 'add_EURO') {
								results[id][value.name] = add_EURO(results[id][value.name]);
							} else if (f === 'getDateinFrenchByTimestamp') {
								results[id][value.name] = getDateinFrenchByTimestamp(results[id]
									[value.name]);
							} else if (f === 'lower_case') {
								results[id][value.name] = lower_case(results[id][value.name]);
							} else if (f === 'paiement_status') {
								results[id][value.name] = paiement_status(results[id][value.name]);
							} else if (f === 'getMysqlDateToFrench') {
								results[id][value.name] = getMysqlDateToFrench(results[id][
									value.name
								]);
							} else if (f === 'roundTo') {
								results[id][value.name] = await roundTo(results[id][value.name]);
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
			if (result_is_array) {
				results_array.push(results[id]);
			}
		});

		// add footer
		/*
		 * if(!jQuery.isEmptyObject(results)){
		 * total.monney=roundTo(total.monney); //footers[''] $.each(valide_key,
		 * function(index, value) { //results['total'][index]='';
		 * if(index=='panier_ttc'){footers[index]={};
		 * footers[index]={name:index, label:add_EURO(total.monney)};} }); }
		 */
		$.each(valide_key, function(index, value) { // console.log(index);
			headers.push(value);
		});
		return {
			'rows': (result_is_array) ? results_array : results,
			'headers': valide_key,
			// 'footers':footers,
		};
	}


	// /// fonction permettant d'effectuer des arrondis
	function precisionRound(number, precision = 2) {
		number = Number(number);
		var factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;

	}

	// /// fonction permettant d'effectuer des arrondis
	function getDateinFrench(data, show_hour = true) {
		var french_date = '';
		if (data) {
			var _date = new Date(data);
			if (show_hour) {
				french_date = (_date.getDate()).toString().padStart(2, '0') + '/' + (
						_date.getMonth() + 1).toString().padStart(2, '0') + '/' + (_date.getFullYear()) +
					' à ' + (_date.getHours()).toString().padStart(2, '0') + ':' + (_date.getMinutes())
					.toString().padStart(2, '0');
			} else {
				french_date = (_date.getDate()).toString().padStart(2, '0') + '/' + (
					_date.getMonth() + 1).toString().padStart(2, '0') + '/' + (_date.getFullYear());
			}
		}
		return french_date;
	}

	/**
	 *
	 */
	async function roundTo(n, digits = 2) {
		if (n == 0 || n == null) {
			// console.log('n null or O : ', n);
			n = 0;
			n = n.toFixed(digits);
		} else {
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
			n = (Math.round(n) / multiplicator).toFixed(digits);
			if (negative) {
				n = (n * -1).toFixed(digits);
			}
		}
		return currency(n);
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

	function currency(data) {
		data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		data = data.replace('.', ',');
		return data;
	}

	/**
	 *
	 */
	function add_EURO(data) {
		if ((data != '' && data != null)) {
			if (data > 0) {
				data = parseFloat(data);
			}
			return currency(data) + ' €';
		} else if (data == 0 || data == null) {
			data = '0 €';
		}
		return data;
	}


	/**
	 * https://playcode.io/597785/
	 */
	async function ConvertObjectToArray(datas, dataArray) {
		return new Promise(resolveParent => {
			var keys_object = Object.keys(datas);
			if (!keys_object.length) {
				resolveParent("ok");
			}
			var parcourt = function(key_object, key_index, datas, dataArray) {
				return new Promise(resolve => {
					/**
					 * Cette regle speficque à ce cas de figure
					 */
					/*
					{
						if (datas[key_object]['order-id'] && datas[key_object]['order-id'] ===
							'Total') {
							datas[key_object]['order-id'] = '';
						}
					}
					/**/
					dataArray.push(datas[key_object]);
					//console.log('kksa8888', datas[key_object], dataArray);
					resolve({
						key_object: key_object,
						key_index: key_index
					});
				});
			};
			parcourt(keys_object[0], 0, datas, dataArray).then(
				successCallback, failureCallback);

			function successCallback(value) {
				if (keys_object.length > value.key_index) {
					value.key_index++;
					//console.log(value.key_index);
					if (keys_object[value.key_index]) {
						parcourt(keys_object[value.key_index], value.key_index,
							datas, dataArray).then(successCallback, failureCallback);
					} else {
						resolveParent("ok");
					}
				}
			}

			function failureCallback(value) {
				//console.log('ERROR ConvertObjectToArray', value);
			}
		});
	}

	/**
	 *  https://playcode.io/597785/
	 */
	async function MergeArray(datas, dataArray) {
		return new Promise(resolveParent => {
			var parcourt = function(key_index, datas, dataArray) {
				return new Promise(resolve => {
					dataArray.push(datas[key_index]);
					//console.log('datas[key_index] :: ', datas[key_index],
					//	' dataArray :: ', dataArray);
					resolve({
						key_index: key_index
					});
				});
			};
			parcourt(0, datas, dataArray).then(successCallback,
				failureCallback);

			function successCallback(value) {
				if (datas.length > value.key_index) {
					value.key_index++;
					//console.log(value.key_index);
					if (datas[value.key_index]) {
						parcourt(value.key_index, datas, dataArray).then(
							successCallback, failureCallback);
					} else {
						resolveParent("ok");
					}
				}
			}

			function failureCallback(value) {
				console.log('ERROR MergeArray', value);
			}
		});
	}

	/**
	 * https://playcode.io/597785/
	 */
	async function ObjectLoop(datas, dataArray, callback) {
		return new Promise(resolveParent => {
			var keys_object;
			if (Array.isArray(datas)) {
				keys_object = null;
			} else {
				keys_object = Object.keys(datas);
			}

			var parcourt = function(key_object, key_index, datas, dataArray) {
				return new Promise(async function(resolve) {
					//dataArray.push(datas[key_object]);
					if (key_object) {

					} else {
						await callback(datas[key_index], dataArray, callback);

					}

					resolve({
						key_object: key_object,
						key_index: key_index
					});
				});
			};
			if (keys_object) {
				parcourt(keys_object[0], 0, datas, dataArray).then(
					successCallback, failureCallback);
			} else {
				parcourt(keys_object, 0, datas, dataArray).then(successCallback,
					failureCallback);
			}

			function successCallback(value) {
				if (keys_object && keys_object.length > value.key_index) {
					value.key_index++;
					//console.log(value.key_index);
					if (keys_object[value.key_index]) {
						parcourt(keys_object[value.key_index], value.key_index,
							datas, dataArray).then(successCallback, failureCallback);
					} else {
						resolveParent("ok");
					}
				} else if (datas.length > value.key_index) {
					value.key_index++;
					//console.log(value.key_index);
					if (datas[value.key_index]) {
						parcourt(keys_object, value.key_index, datas, dataArray).then(
							successCallback, failureCallback);
					} else {
						resolveParent("ok");
					}
				} else {
					resolveParent("ok");
				}
			}

			function failureCallback(value) {
				console.log('ERROR ConvertObjectToArray', value);
			}
		});
	}

	async function customAction(datas, dataArray, callback) {
		var arrays;
		var convert_array = [];
		if (datas) {
			if (datas.order) {
				if (datas.order.WithinFrance) {
					//console.log('Debut order WithinFrance :: ', datas.order.WithinFrance);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'VENTES ' + datas.order.WithinFrance.label
					});
					arrays = await buildArray(datas.order.WithinFrance.orders, ['order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin order WithinFrance :: ');
				}

				if (datas.order.OutsideFranceWithEU) {
					//console.log('Debut order OutsideFranceWithEU :: ', datas.order.OutsideFranceWithEU);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'VENTES ' + datas.order.OutsideFranceWithEU.label
					});
					arrays = await buildArray(datas.order.OutsideFranceWithEU.orders, [
						'order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin order OutsideFranceWithEU :: ');
				}

				if (datas.order['OutsideFranceWithEU-ASS']) {
					//console.log('Debut order OutsideFranceWithEU :: ', datas.order.OutsideFranceWithEU);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'VENTES ' + datas.order['OutsideFranceWithEU-ASS'].label
					});
					arrays = await buildArray(datas.order['OutsideFranceWithEU-ASS'].orders, [
						'order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin order OutsideFranceWithEU :: ');
				}


				if (datas.order['DOM-TOM']) {
					//console.log('Debut order DOM-TOM :: ', datas.order['DOM-TOM']);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'VENTES ' + datas.order['DOM-TOM'].label
					});
					arrays = await buildArray(datas.order['DOM-TOM'].orders, ['order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin order DOM-TOM :: ');
				}

				if (datas.order.OutsideEU) {
					//console.log('Debut order OutsideEU :: ', datas.order.OutsideEU);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'VENTES ' + datas.order.OutsideEU.label
					});
					arrays = await buildArray(datas.order.OutsideEU.orders, ['order-id',
						'ht'
					]);
					//console.log(arrays);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin order OutsideEU :: ');
				}

			} else if (datas.Refund) {
				if (datas.Refund.WithinFrance) {
					//console.log('Debut Refund WithinFrance :: ', datas.Refund.WithinFrance);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'Remboursements ' + datas.Refund.WithinFrance.label
					});
					arrays = await buildArray(datas.Refund.WithinFrance.orders, [
						'order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin Refund WithinFrance ');
				}

				if (datas.Refund.OutsideFranceWithEU) {
					//console.log('Debut Refund OutsideFranceWithEU :: ', datas.Refund.OutsideFranceWithEU);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'Remboursements ' + datas.Refund.OutsideFranceWithEU.label
					});
					arrays = await buildArray(datas.Refund.OutsideFranceWithEU.orders, [
						'order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin Refund OutsideFranceWithEU :: ');
				}

				if (datas.Refund['OutsideFranceWithEU-ASS']) {
					//console.log('Debut Refund OutsideFranceWithEU :: ', datas.Refund.OutsideFranceWithEU);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'Remboursements ' + datas.Refund['OutsideFranceWithEU-ASS'].label
					});
					arrays = await buildArray(datas.Refund['OutsideFranceWithEU-ASS'].orders, [
						'order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin Refund OutsideFranceWithEU-ASS :: ');
				}

				if (datas.Refund['DOM-TOM']) {
					//console.log('Debut Refund DOM-TOM :: ', datas.Refund['DOM-TOM']);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'Remboursements ' + datas.Refund['DOM-TOM'].label
					});
					arrays = await buildArray(datas.Refund['DOM-TOM'].orders, [
						'order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin Refund DOM-TOM ');
				}

				if (datas.Refund.OutsideEU) {
					//console.log('Debut Refund WithinFrance :: ', datas.Refund.OutsideEU);
					if (dataArray.length && dataArray.length > 0) {
						dataArray.push({
							'order-id': ''
						});
						dataArray.push({
							'order-id': ''
						});
					}
					dataArray.push({
						'order-id': 'Remboursements ' + datas.Refund.OutsideEU.label
					});
					arrays = await buildArray(datas.Refund.OutsideEU.orders, [
						'order-id',
						'ht'
					]);
					//console.log(arrays.rows);
					convert_array = [];
					await ConvertObjectToArray(arrays.rows, convert_array);

					if (convert_array.length) {
						await MergeArray(convert_array, dataArray);
					}
					//console.log('Fin Refund OutsideEU ');
				}
			}
		}
	}

});
