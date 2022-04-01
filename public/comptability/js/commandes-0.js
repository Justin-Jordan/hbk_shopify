jQuery(document).ready(function ($) {

	/**
	 * 
	 */
	Vue.component('custom_display', {
		delimiters: ['${', '}'],
		template: '<pre>${datas}</pre>',
		props: {
			datas: [Object, Array, String, Number],
		},
		data: function () {
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
		data: function () {
			return {

			}
		},
		methods: {
			create_customer: function(event){
				this.$emit('ev_alert_action', { 'status': true, action: 'create_customer', event:event });
			},
			update_customer: function(event){
				this.$emit('ev_alert_action', { 'status': true, action: 'update_customer', event:event });
			},
		}
	});
	

	/**
	 * 
	 */
	Vue.component('createorder', {
		delimiters: ['${', '}'],
		props: {
			modal_body: {
				type: [Object, Array, String, Number], default: function () {
					return { update: false, 'delete': false, move: false, drap: false };
				}
			},
			show_save: { type: Boolean, default: true, },
			// action button
			// show_add:{type: Boolean,default: true,},
			doaction: [Object, Array, String, Number],
			titre_modal: [Object, Array, String, Number],
		},
		data: function () {
			return {
				/**
				 * 
				 */
				modedebug: -1,
				/**
				 * Alert message
				 */
				alert_message_static: '',
				show_alert_static: false,
				alert_attribut_class_static: 'alert-primary',
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
					'sku': 'Sku',
					'price': 'Prix',
					'qty': 'Quantité',
				},
				cart_array: [],
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
				error_message: '',
				alert_template:'',
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
				current_compagny: '9130347044451506',
				/**
				 * mode dev
				 */
				dev_evolution: 'stable',
				/**
				 * Customer_account
				 */
				customer_account_shopify: false,
				customer_account_amazon:false,
				SalesTermRef:false,
				DepositToAccountRef_compte_principal:false,
				DepositToAccountRef_compte_paypal:false,
				ModeCalculDiscountGlobal:false,
				
			}
		},
		mounted: function () {
			/**
			 * get current compte QB.
			 */
			var current_compagny = getSession('current_compagny');
			if(current_compagny){
				this.current_compagny = current_compagny;
			}
			
			if(this.current_compagny =='9130347038344016'){
				this.customer_account_shopify = 100;
				this.customer_account_amazon = 101;
				this.SalesTermRef = 3;
				this.DepositToAccountRef_compte_principal = 66
				this.DepositToAccountRef_compte_paypal = 102;
				this.ModeCalculDiscountGlobal = true;
			}
			//
			var dev_evolution = getSession('dev_evolution');
			if(dev_evolution){
				this.dev_evolution = dev_evolution;
			}
			
			if (!this.token_url_refresh) {
				var event = $('.modal-header');
				this.get_token(event);
			}
			/**
			 * get mode
			 */
			this.modedebug = parseInt(Cookies.get('modedebug'));
		},
		template: '#template-createorder',
		watch: {
			doaction: function () {
				this.cart_array = [];
				this.account = {};
				this.getCart();
				this.resetFields();			
				console.log('datas to send or config : ', this.modal_body);
				
			},
		},
		methods: {
			resetFields: function () {
				this.alert_message_static = '';
				this.show_alert_static = false;
				this.invoice = {};

				this.discount = {};
				this.order_bd = {};
				this.status_invoice = false;
				this.payments = {};
				this.flux = 0;
				this.querys = 0;
				this.accordions = [];
				// this.all_datas_form_cart = {};
			},
			create_invoice: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'create_invoice');
			},
			create_invoice_test: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'create_invoice_test');
			},
			create_customer_test: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'create_customer_test');
			},
			create_customer: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'create_customer');
			},
			update_customer_test: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'update_customer_test');
			},
			update_customer: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'update_customer');
			},
			create_invoice_andpayement_test: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'create_invoice_andpayement_test');
			},
			create_invoice_all: function () {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'create_invoice_all');
			},
			create_invoice_all_next_code_facture: function () {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'create_invoice_all_next_code_facture');
			},
			test_invoice: function () {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'test_invoice');
			},
			create_salereceipt: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'create_salereceipt');
			},
			get_token: function (event) {
				var datas = {};
				var DatasReturn = this.execute_action(event, datas, action = 'get_token', false, asyn = true, displayMassage = false);
				if (DatasReturn.results) {
					this.token_url_refresh = DatasReturn.results;
				} else {
					console.log('error token');
				}
			},
			getInvoice: function () {
				var datas = this.modal_body;
				var event = { target: $('#model-create-invoice .modal-header') };
				this.execute_action(event, datas, action = 'get_invoice', asyn = true, displayMassage = false);
			},
			getCart: function () {
				
				
				var datas = this.modal_body;
				this.show_void_invoice = false;
				var event = {
					target: $('#model-create-invoice .modal-header'),
				};	
				this.execute_action(event, datas, action = 'get_cart', asyn = true, displayMassage = false);
				//
			},
			valider_payment: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'valide_payment');
			},
			valider_payment_test: function (event) {
				this.resetFields();
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'valider_payment_test');
			},
			void_invoice: function () {
				var self = this;
				/**
				 * add status commande and id facture
				 */
				console.log(self.all_datas_form_cart);
				if (self.all_datas_form_cart.cart) {
					this.modal_body['dafault'] = {};
					this.modal_body['dafault']['id_invoice'] = self.all_datas_form_cart.id_invoice;
					this.modal_body['dafault']['status_invoice'] = self.all_datas_form_cart.status_invoice;
				}
				this.resetFields();
				console.log(this.modal_body);
				var datas = this.modal_body;
				this.execute_action(event, datas, action = 'void_invoice');
			},
			execute_action: function (event, datas, action = 'get_invoice', asyn = true, displayMassage = true) {
				var self = this;
				var DatasReturn = null;
				// display syn
				// console.log('Load content AJAX : '+action);
				$('.fa-sync', event.target).removeClass('d-none');
				$(event.target).attr('disabled', 'true');
				var headers = {
					'Content-Type': 'application/json',
					'X-CSRF-Token': action,
					'X-CSRF-ValueType': self.metafileds_type_field,
					'X-CSRF-Endpoints': self.EndPoints_save,
					'Accept': 'application/json',
				};
				// console.log(headers);
				var url = '/quickbookstest/quickbook.php';
				var datas_tempon = datas;
				/**
				 * Ajout de l'id du compte.
				 */
				 datas['current_compagny'] = self.current_compagny;	
				 datas['customer_account_shopify'] = self.customer_account_shopify;
				 datas['customer_account_amazon'] = self.customer_account_amazon;
				 datas['SalesTermRef'] = self.SalesTermRef;
				 datas['DepositToAccountRef_compte_principal'] = self.DepositToAccountRef_compte_principal;
				 datas['DepositToAccountRef_compte_paypal'] = self.DepositToAccountRef_compte_paypal;
				 datas['ModeCalculDiscountGlobal'] = self.ModeCalculDiscountGlobal;
				 datas['dev_evolution'] = self.dev_evolution;
				 
				datas = JSON.stringify(datas);
				jQuery.ajax({
					url: url,
					method: 'POST',
					headers: headers,
					data: datas,
					async: asyn,
					success: function (data) {
						$('.fa-sync', event.target).addClass('d-none');
						$(event.target).removeAttr('disabled');
						self.alert_template = '';
						console.log(data);
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
									self.errorAjax(data.salereceipt_result, 'alert-warning');
								} else {
									self.successAjax(' <strong>Réçu crée</strong> ');
								}
							}
							else if (data.invoice_result || data.payments_result) {
								var invoice = false;
								var payement = false;
								var message = '';
								var classe = 'alert-success';
								self.invoice_result = data.invoice_result;
								var message = '';
								var check_invoice = false;

								if (data.invoice_result && data.invoice_result.Invoice) {
									check_invoice = true;
									self.status_invoice = data.status_invoice;
									invoice = { ref: data.invoice_result.Invoice.DocNumber };
									if (self.status_invoice == 'SUCCESS' || self.status_invoice == 'TEST') {
										if (self.status_invoice == 'TEST') {
											message += ' <strong class="d-block">Mode test : simulation</strong> ';
										}
										message += (' <strong class="d-block">Facture crée , Reference : ' + data.invoice_result.Invoice.DocNumber + '</strong> ');

										self.accordions.push({ 'title': 'Facture, flux envoyé', body: data.invoice_send });
										self.accordions.push({ 'title': 'Facture, flux retourné', body: data.invoice_result });

									}
									else if (self.status_invoice == 'UPDATE') {
										classe = 'alert-warning';
										self.accordions.push({ 'title': 'Facture, flux envoyé', body: data.invoice_send });
										message += (' <strong class="d-block">La facture existe déjà, Reference : ' + data.invoice_result.Invoice.DocNumber + '</strong> ');
									}
									else if (self.status_invoice == 'display_json') {
										message += (' <strong class="d-block"> Facture JSON </strong> ');
										self.accordions.push({ 'title': 'Facture JSON ', body: data.invoice_result });
									}
									else {
										classe = 'alert-warning';
										message += (' <strong class="d-block "> La facture n\'a pas été crée </strong> ');
									}
								}
								if (data.payments_result && data.payments_result.Payment) {
									self.status_payment = data.status_payment;
									payement = { 'ref': data.payments_result.Payment.PaymentRefNum };
									if (self.status_payment == 'SUCCESS' || self.status_payment == 'TEST') {
										if (self.status_payment == 'TEST') {
											message += ' <strong class="d-block">Mode test : simulation</strong> ';
										}
										message += ' <strong class="d-block">Paiement crée, Reference : ' + data.payments_result.Payment.PaymentRefNum + '</strong> ';

										if (!check_invoice) {
											self.accordions.push({ title: 'Payement, flux envoyé', body: data.payment_send });
											self.accordions.push({ title: 'Payement, flux retourné', body: data.payments_result });
										}
									}
									else if (self.status_payment == 'UPDATE') {
										classe = 'alert-warning';
										message += ' <strong class="d-block">Le paiement existe déjà, Reference : ' + data.payments_result.Payment.PaymentRefNum + '</strong> ';
										if (!check_invoice) {
											self.accordions.push({ title: 'Payement, flux envoyé', body: data.payment_send });
										}
									}
									else {
										classe = 'alert-warning';
										message += (' <strong class="d-block"> Le paiement n\'a pas été crée </strong> ');
									}
								}
								self.$emit('ev_modal_simple', { 'order': datas_tempon, invoice: invoice, payement: payement });
								self.successAjax(message, true, classe);
							}
							else if (data.buildCart) {
								self.all_datas_form_cart = data.buildCart;
								if (self.all_datas_form_cart && self.all_datas_form_cart.id_invoice) {
									self.show_create_invoice = false;
									var qb_voided = parseInt(self.all_datas_form_cart.order_bd.qb_voided);
									if (!qb_voided) {
										self.show_void_invoice = true;
									} else {
										self.show_text_void = true;
									}
								} else {
									self.show_create_invoice = true;
								}


								if (
									(data.cart_order && data.cart_order.admin_graphql_api_id && data.cart_order.line_items) ||
									data.buildCart['cart']
								) {
									self.cart_array = data.buildCart['cart'];
									// console.log(data.buildCart);
									self.discount = data.buildCart['discount'];
									self.order_bd = data.buildCart['order_bd'];
								} else {
									var cart = [];
									$.each(data.cart_order, function (j, l) {
										var subCart = { 'sku': l.SELLER_SKU, 'price': l.TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL, 'qty': l.QTY }
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
									if (data.buildCart.account.TransactionLocationType == 'WithinFrance') {
										data.buildCart.account.TransactionLocationType = 'France';
										self.account = data.buildCart.account;
									}
									else if (data.buildCart.account.TransactionLocationType == 'FranceOverseas') {
										data.buildCart.account.TransactionLocationType = 'France'
										self.account = data.buildCart.account;
									}
									else if (data.buildCart.account.TransactionLocationType == 'OutsideFranceWithEU') {
										data.buildCart.account.TransactionLocationType = 'EU';
										self.account = data.buildCart.account;
									}
									else if (data.buildCart.account.TransactionLocationType == 'OutsideEU') {
										data.buildCart.account.TransactionLocationType = 'Internationale';
										self.account = data.buildCart.account;
									}
								}
								// console.log(data.buildCart.account);
							}
							else if (data.cart_order) {
								// if shopify
								var cart = [];
								if (data.cart_order.admin_graphql_api_id && data.cart_order.line_items) {
									$.each(data.cart_order.line_items, function (j, l) {
										var subCart = { 'sku': l.sku, 'price': l.price, 'qty': l.quantity }
										cart.push(subCart);
									});
								} else {
									$.each(data.cart_order, function (j, l) {
										var subCart = { 'sku': l.SELLER_SKU, 'price': l.TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL, 'qty': l.QTY }
										cart.push(subCart);
									});
								}
								self.cart_array = cart;
							}
							else if (data.payments) {
								self.payments = data.payments;
								self.successAjax(' <strong>JSON du payment generé, creation désactiver</strong> ', displayMassage);
							}
							else if (data.VoidInvoice) {
								self.successAjax(' <strong>Facture annulé</strong> ', displayMassage);
								self.accordions.push({ 'title': 'Facture, flux', body: data.VoidInvoice });
								self.$emit('ev_modal_simple', { 'order': datas_tempon, void_invoice: 1 });
								self.show_text_void = false;
							}
							else {
								self.successAjax(' <strong>Données sauvergardés avec succes</strong> ', displayMassage);
							}
						}

					},
					error: function (error) {
						console.log(error);
						if(error.status){
							if(error.status==610){								
								self.error_message = '';
								self.alert_template = 'button_add_client';
							}
						}
						self.errorAjax(error);
						$('.fa-sync', event.target).addClass('d-none');
						$(event.target).removeAttr('disabled');
					}
				});
				return DatasReturn;
			},
			alert_action: function(datas){ 
				console.log(datas);
				if(datas.status){ 
					 console.log('MODE DEBUG :::: ',
					 this.modal_body.modedebug, this.modedebug);
					if(datas.action && datas.action=='create_customer'){
						if(this.modal_body.modedebug > 0 && this.modedebug > 0){
							var event = {
									target: $('#model-create-invoice .modal-header'),
								};
							 this.create_customer_test(event);
						}
						else if(this.modal_body.modedebug < 0 || this.modedebug < 0){
							var event = {
									target: $('#model-create-invoice .modal-header'),
								};
							this.create_customer(event);							
						}
					}
					else if(datas.action && datas.action=='update_customer'){
						if(this.modal_body.modedebug > 0  && this.modedebug > 0){
							var event = {
									target: $('#model-create-invoice .modal-header'),
								};
							this.update_customer_test(event);
						}
						else if(this.modal_body.modedebug < 0 || this.modedebug < 0){
							var event = {
									target: $('#model-create-invoice .modal-header'),
								};
							this.update_customer(event);
						}
					}
				}
			},
			alert_close_static: function () {
				this.show_alert_static = false;
			},
			successAjax: function (message = '', display = true, classe = 'alert-success') {
				if (!display) {
					return false;
				}
				var self = this;
				self.show_alert_static = true;
				self.alert_attribut_class_static = classe;
				self.alert_message_static = message;
			},
			errorAjax: function (error = '', classe = 'alert-danger') {
				var self = this;
				self.show_alert_static = true;
				self.alert_attribut_class_static = classe;
				/*
				 * if(self.modedebug){ self.alert_message_static="Une erreur est
				 * survenu,"; return false; }
				 */
				var errorQB = self.traitementErrorQB(error);
				if (errorQB && (self.modedebug < 0)) {
					self.alert_attribut_class_static = 'alert-warning';
					self.show_alert_static = true;
					self.alert_message_static = errorQB;
					return false;
				}
				if ((self.modedebug < 0)) {
					self.alert_message_static = "<strong> Une erreur s'est produite, réessayer plus tard, ou contactez nous si cela persiste </strong>";
					return false;
				}
				var message = '<strong class="d-block mb-3"> Echec de la sauvegarde  ... </strong>';
				if (error.statusText) {
					message = '<strong class="d-block mb-3"> ' + decodeURIComponent(error.statusText) + '</strong>';
				}
				if (errorQB) {
					self.alert_attribut_class_static = 'alert-warning';
					message = '<p>' + errorQB + '</p>';
				} else {
					message += '<p>' + error.responseText + '</p>';
				}

				self.alert_message_static = message;
			},
			traitementErrorQB: function (error) {
				var self = this;
				/**
				 * on recherche les demimiteurs 'QB###'
				 */
				var texte = '';
				var n = (error.responseText).search("QB###");
				if (n) {
					var messageError = '<strong class="d-block mb-3">' + decodeURIComponent(error.statusText) + '</strong>';
					texte = (error.responseText).split("BGQB###");
					if (!texte[1]) {
						return false;
					}
					texte = texte[1].split("ENDQB###");
					if (texte[0] != '') {
						texte = JSON.parse(texte[0]);
						if (texte.flux && self.modedebug) {
							self.flux = texte.flux
						}
						if (texte.querys && self.modedebug) {
							self.querys = texte.querys
						}
						if (texte.result) {
							texte = texte.result;
						}
						console.log(texte);
					} else {
						return messageError;
					}
					console.log(texte);
					if (texte && texte['Fault'] && texte['Fault']['Error']) {
						$.each(texte['Fault']['Error'], function (i, k) {
							if (k.Message && k.Message != '') {
								messageError += '<span class="d-block"> - ' + k.Message + '</span>';
							}
							if (k.Detail && k.Detail != '') {
								messageError += '<span class="d-block"> - ' + k.Detail + '</span>';
							}
							if (k.Detail) {
								// messageError +='<span
								// class="d-block">'+k.Detail+'</span>';
							}
						});
						if (texte['Fault']['Error']['actions'] && texte['Fault']['Error']['actions']['next_code_facture']) {
							messageError += '<span class="d-block"> <button class="btn btn-outline-primary btn-sm mt-3" onclick="next_code_facture()">Réessayer avec le numéro suivant</button> </span>';
						}
						return messageError;
					} else {
						if(texte && texte != ''){
							messageError += '<span class="d-block"> - ' + texte + '</span>';
						}						
						return messageError; 
					}
				}
				return false;
			},
			buildCart: function (line) {
				var cart = [];
				$.each(line, function (k, l) {
					var subLine = { 'sku': l.sku, qty: l.SalesItemLineDetail.Qty, 'price': l.Amount }
					cart.push(subLine);
				});
				return cart;
			},
			select_tab: function (e) {
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
				Cookies.set('modedebug', self.modedebug);
			},
			open_windows: function (event) {
				// alert('open_windows off');
				// return false;
				var
					w = 770,
					h = 600,
					l = (screen.availWidth - w) / 2,
					t = (screen.availHeight - h) / 2;
				console.log('hello : ' + this.token_url_refresh);
				window.open(this.token_url_refresh, "window", "width= " + w + ",height=" + h + ",left=" + l + ",top=" + t + ", scrollbars = yes, location = no, toolbar = no, menubar = no, status = no");
				return false;
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
			defaultvalue_firstday: (Cookies.get('input_firstday')) ? Cookies.get('input_firstday') : '',
			// /// last day
			input_lastday: '',
			label_lastday: 'Date de fin',
			defaultvalue_lastday: (Cookies.get('input_lastday')) ? Cookies.get('input_lastday') : '',
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
		},
		mounted: function () {
			/**
			 * Verification du compte actif. Le compte par defaut etant la
			 * version en prod.
			 */
			var current_compagny = getSession('current_compagny');
			this.QB_compte_title = 'Vous etes sur le compte Production (Nutribe)';
			if(current_compagny == '9130347038344016'){
				this.databaseConfig = 'testNutribe';
				this.QB_compte_title = 'Vous etes sur le compte test (Dummy)';
				this.customer_account_shopify = 100;
				this.customer_account_amazon = 101;
			}
			
			if (this.defaultvalue_firstday != '' || this.defaultvalue_lastday != '') {
				this.input_firstday = getDateMySql(this.defaultvalue_firstday);
				this.input_lastday = getDateMySql(this.defaultvalue_lastday);
				this.getdatas();
			} else {
				var params = {
					config: {
						'page': 1,
						'nombre': 20,
						'datatype': 'BD_commandes',
						'databaseConfig': this.databaseConfig
					},
				};/**/
				params = JSON.stringify(params);
				var self = this;
				url = self.root + '/getcommandes.php';
				$.ajax({
					url: url,
					method: 'GET',
					data: 'datas=' + params,
					// async : false,
					success: function (data) {
						console.log(data);
						self.stats = data.stats;
						self.buildDataChart(data);
						self.default_rows = data.orders;
						var data = buildArray(data.orders, []);
						console.log(data);
						self.rows = data.rows;
						self.headers = data.headers;
						self.footers = data.footers;
					},
					error: function (error) {
						console.log('error to get datas');
						console.log(error);
						$('#displayErrorAjax').html(error.responseText);
					}
				});
			}
			if (Cookies.get('modedebug_parent')) {
				console.log('modedebug_parent');
				this.modedebug = parseInt(Cookies.get('modedebug_parent'));
			} else {
				console.log('modedebug_parent none');
			}
		},
		methods: {
			reload_row: function (value) {
				var self = this;
				console.log('emit reload_row');
				var keys = [];
				if (this.input_datedebut) { keys.push('datetime'); }
				if (this.input_datefin) { keys.push('datetime_fin'); }

				var data = buildArray(this.default_rows, keys);
				self.rows = data.rows;
				self.headers = data.headers;
			},
			apply_input_firstday: function (date) {
				this.input_firstday = date;
			},
			apply_input_lastday: function (date) {
				this.input_lastday = date;
			},
			saveSelectDate: function () {
				console.log('Prepare to save : ', this.input_firstday, this.input_lastday);
				let input_firstday = getDateMySql(this.input_firstday);
				let input_lastday = getDateMySql(this.input_lastday)
				Cookies.set('input_firstday', input_firstday);
				Cookies.set('input_lastday', input_lastday);
				console.log('Date save french : ', input_firstday, input_lastday);
			},

			get_new_datas: function () {
				var self = this;
				console.log('emit get_new_datas');
			},
			inputsubmit: function () {
				console.log('inputsubmit perform');
				this.saveSelectDate();
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
				console.log('date before send : ', self.input_firstday, ' fin : ', self.input_lastday);
				var params = {
					config: {
						'page': 1,
						'nombre': 20,
						'datatype': 'BD_commandes',
						'databaseConfig': this.databaseConfig
					},
					query: {
						datedebut: self.input_firstday,
						datefin: self.input_lastday,
					}
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
						self.orders = data.orders;
						self.stats = data.stats;
						self.buildDataChart(data);
						self.default_rows = data.orders;
						//
						self.buildAccordion(data.requests);
						self.buildArray();
					},
					error: function (error) {
						console.log('error to get datas');
						console.log(error);
						$('#displayErrorAjax').html(error.responseText);
					}
				});
			},
			buildArray: function () {
				var self = this;
				var data = buildArray(self.orders, []);
				// console.log(data);
				self.rows = data.rows;
				self.headers = data.headers;
				self.footers = data.footers;
			},
			buildDataChart: function (data) {
				var self = this;
				var max_label = 300, i = 1;
				var montants = [];
				var num_orders = [];
				var labels = [];
				// console.log(self.input_firstday);
				// console.log(self.input_lastday);
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
						var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) : (d2.getMonth() + 1);
						var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
						var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
						labels.push(currentDate_french);

						var date = new Date(currentDate);
						currentDate = date.setDate(date.getDate() + 1);
						// montant_sell; number_order
						var result = this.getValues(currentDate_french, data.chart_datasets);
						montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
						num_orders.push((result['number_order']) ? result['number_order'] : 0);
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
						var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) : (d2.getMonth() + 1);
						var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
						var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
						labels.push(currentDate_french);

						var date = new Date(currentDate);
						currentDate = date.setDate(date.getDate() - 1);
						// montant_sell; number_order
						var result = this.getValues(currentDate_french, data.chart_datasets);
						montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
						num_orders.push((result['number_order']) ? result['number_order'] : 0);
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
						var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) : (d2.getMonth() + 1);
						var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
						var currentDate_french = day + '-' + mois + '-' + d2.getFullYear();
						labels.push(currentDate_french);

						var date = new Date(currentDate);
						currentDate = date.setDate(date.getDate() + 1);
						// montant_sell; number_order
						var result = this.getValues(currentDate_french, data.chart_datasets);
						montants.push((result['montant_sell']) ? result['montant_sell'] : 0);
						num_orders.push((result['number_order']) ? result['number_order'] : 0);
						i++;
					}
				}
				else if (self.input_firstday == '' && self.input_lastday == '') {
					var dateFin = new Date();
					var FirstDayOfMonth = dateFin.getFullYear() + '-' + (dateFin.getMonth() + 1) + '-01';
					var dateDebut = new Date(FirstDayOfMonth); console.log(dateDebut);
					var dateFin_TIME = dateFin.getTime(); // console.log('Date
															// FIN :
															// '+dateFin_TIME);
					var dateDebut_TIME = dateDebut.getTime();// console.log('Date
																// Debut :
																// '+dateDebut_TIME);

					while (dateFin_TIME >= dateDebut_TIME && i <= max_label) {
						// console.log(dateDebut_TIME);
						d2 = new Date(dateDebut_TIME);
						var mois = ((d2.getMonth() + 1) <= 9) ? '0' + (d2.getMonth() + 1) : (d2.getMonth() + 1);
						var day = (d2.getDate() <= 9) ? '0' + (d2.getDate()) : (d2.getDate());
						var dateDebut_TIME_french = day + '-' + mois + '-' + d2.getFullYear();
						labels.push(dateDebut_TIME_french);

						var date = new Date(dateDebut_TIME);
						dateDebut_TIME = date.setDate(date.getDate() + 1);
						// montant_sell; number_order
						var result = this.getValues(dateDebut_TIME_french, data.chart_datasets);
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
			active_modal_create_invoice: function (index) {
				var self = this;
				// console.log('self.modedebug : ', self.modedebug);
				if (self.modedebug > 0) {
					index['modedebug'] = 1;
				} else {
					index['modedebug'] = -1;
				}
				self.create_invoice_modal_body = index;// {'id_order':index};
				// console.log( ' self.create_invoice_modal_body : ',
				// self.create_invoice_modal_body );
				var id_modal = 'model-create-invoice';
				var metafield = index;
				$('#' + id_modal).modal({});
				// execute after show modal
				$('#' + id_modal).on('shown.bs.modal', function (e) {
					if (index.plateforme == 'shopify') {
						var logo = '<img src="/comptabilte/img/logo-shopify.png">';
					} else {
						var logo = '<img src="/comptabilte/img/logo-amazon.png">';
					}
					self.titre_modal_preview_img = `
	  			<div  class="d-flex group-logos"><span>`+ logo + `</span> <span class="commande">` + index.id_order + `</span></div>
	  		`,
						self.actionparent = index.id_order;
					self.id_commande = index.id_order;
					// Ajouce le code ci-dessous pour empecher l'execution
					// multiple.
					$('#' + id_modal).off('shown.bs.modal');
				});
			},
			open_config_modal: function () {
				var self = this;
				var id_modal = 'model-confis';
				$('#' + id_modal).modal({});
				self.actionparent_config = self.actionparent_config + 1;
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
				/**
				 * Display table
				 */
				self.buildArray();
			},
			reload_commande: function (datas) {
				var self = this;
				console.log(' Recharge la commande ');
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
						setTimeout(function () {
							$('#text' + id).css({ 'color': '#3a8447' });
						}, 800);
					}
					self.rows = rows;
					console.log(self.rows);
				}
			}
		},
		// :card_info_header="stat.card_info_header"
		// :card_info_infos="stat.card_info_infos"
		// :card_info_suffix="stat.card_info_suffix"
		components: {
			'liste_badge': {
				template: '<card_info :card_info_header_nombre="card_info_header_nombre" :card_info_show="card_info_show" :card_info_infos="card_info_infos" :card_info_header="card_info_header" :card_info_suffix="card_info_suffix" :card_info_color="card_info_color" :card_info_suffix_after="card_info_suffix_after"></card_info>',
				props: {
					current_stat: [Object, Array],
				},
				data: function () {
					return {
						card_info_show: true,
						// card_info_suffix:'Total',
					}
				},
				// card_info_header
				computed: {
					card_info_header: {
						get: function () {
							/*
							 * console.log(this.current_stat);
							 * if(this.current_stat.card_info_header=='amazon'){
							 * return 'Ventes Amazon';}
							 * if(this.current_stat.card_info_header=='shopify'){
							 * return 'Ventes Shopify';}
							 */
							return this.current_stat.card_info_header;
						}
					},
					card_info_infos: {
						get: function () {
							return (this.current_stat.card_info_infos) ? add_EURO(this.current_stat.card_info_infos) : '0.00€';
						}
					},
					card_info_color: {
						get: function () {
							return (this.current_stat.color) ? this.current_stat.color : '';
						}
					},
					card_info_header_nombre: {
						get: function () {
							return (this.current_stat.card_info_header_nombre) ? '<span>' + this.current_stat.card_info_header_nombre + '</span> Ventes' : '<span>0</span> Vente';
						}
					},
					card_info_suffix: {
						get: function () {
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
						get: function () {
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
			/*
			 * 
			 */
		},
		// template: '#template-profile',


	});




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

	function buildArray(rows, filedsPlus) {		
		var results = {}, total = { number: 0, monney: 0, };
		var headers = [], footers = {};
		var removeIt = {
			first_name: 'jptest',
		}
		var modedebug = parseInt(Cookies.get('modedebug_parent'));
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
					tbody: 'hide-text'
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
			},
			status: {
				name: 'status',
				label: 'Paiement / Statut',
				perfom: ['paiement_status'],
				addclass_tr: {
					before: 'bg-',
				},
			},
			/*
			 * passerelle : { name:'passerelle', label:'Passerelle', },
			 */
			panier_ttc: {
				name: 'panier_ttc',// 'Montant HT en Euro',
				label: 'Panier TTC',
				perfom: ['add_EURO'],
			},
			total_paid: {
				label: 'Total payé',
				name: 'total_paid',
				perfom: ['add_EURO',],
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
			qb_doc_id:{
				name: 'qb_doc_id',
				label: 'ID de la facture (QB)',
				display: false,
				addclass_td: {
					custom: 'd-none'
				},
			}, 
			qb_doc_id_test:{
				name: 'qb_doc_id_test',
				label: 'ID de la facture (QB)',
				display: false,
				addclass_td: {
					custom: 'd-none'
				},
			},
			qb_payment_id:{
				name: 'qb_payment_id',
				label: 'ID du payement (QB)',
				display: false,
				addclass_td: {
					custom: 'd-none'
				},
			},
			qb_payment_id_test:{
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
		}
		else {
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
		// console.log(valide_key);
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
							}
							else if (f == 'getDateinFrenchByTimestamp') {
								results[id][value.name] = getDateinFrenchByTimestamp(results[id][value.name]);
							}
							else if (f == 'lower_case') {
								results[id][value.name] = lower_case(results[id][value.name]);
							}
							else if (f == 'paiement_status') {
								results[id][value.name] = paiement_status(results[id][value.name]);
							}
							else if (f == 'getMysqlDateToFrench') {
								results[id][value.name] = getMysqlDateToFrench(results[id][value.name]);
							}
							else if (f == 'check_add_test_mode') {
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
			$.each(valide_key, function (index, value) {
				// results['total'][index]='';
				if (index == 'panier_ttc') { footers[index] = {}; footers[index] = { name: index, label: add_EURO(total.monney) }; }
			});
		}
		$.each(valide_key, function (index, value) { // console.log(index);
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
			if (val[2]) { dataiso += val[2].toString().padStart(2, '0'); }
			if (val[1]) { dataiso += '-' + val[1].toString().padStart(2, '0'); }
			if (val[0]) { dataiso += '-' + val[0].toString().padStart(2, '0'); }
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
		var french_date = (_date.getDate()) + '/' + (_date.getMonth() + 1) + '/' + (_date.getFullYear());
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
			var day = _date.getDate(); if (day < 10) { day = '0' + day; }
			var mounth = _date.getMonth() + 1; if (mounth < 10) { mounth = '0' + mounth; }
			var mn = _date.getUTCMinutes(); if (mn < 10) { mn = '0' + mn; }
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
		}
		else if (data == 0) {
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
			french_date = (_date.getDate()).toString().padStart(2, '0') + '/' + (_date.getMonth() + 1).toString().padStart(2, '0') + '/' + (_date.getFullYear()) + ' à ' + (_date.getHours()).toString().padStart(2, '0') + ':' + (_date.getMinutes()).toString().padStart(2, '0');
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
		};/**/
		params = JSON.stringify(params)
		$.ajax({
			url: $('body').attr('data-root') + '/shopify.php',
			method: 'GET',
			data: 'datas=' + params,
			// async : false,
			success: function (data) {
				console.log(data);
			},
			error: function (error) {
				console.log('error to get datas');
				console.log(error);
			}
		});
	}
	
	/**
	 * Enregistre une donnée en session.
	 */
	function saveSession(key, value){
		return Cookies.set(key, value);		
	}
	
	/**
	 * Retourne la valeur d'un cookie.
	 */
	function getSession(key){
		return Cookies.get(key);
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

	function next_code_facture() {
		console.log('next_code_facture');
		$('#create-invoice-all-next-code-facture').trigger('click');
	}

});
