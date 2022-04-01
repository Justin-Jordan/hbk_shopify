jQuery(document).ready(function ($) {

	Vue.component('comptaheader', { 
		delimiters: ['${', '}'],
		template: '#template-comptaheader',
		props: {
			
		},
		data: function () {
			return {
				// // first day
				input_firstday: '',
				label_firstday: 'Date de début',
				defaultvalue_firstday: (Cookies.get('input_firstday')) ? Cookies.get('input_firstday') : '',
				// /// last day
				input_lastday: '',
				label_lastday: 'Date de fin',
				defaultvalue_lastday: (Cookies.get('input_lastday')) ? Cookies.get('input_lastday') : '',
			}
		},
		mounted: function(){
			
		},
		methods: {
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
				// self.buildArray();
				self.$emit('ev_select_tab', { 'status': true });
			},
		}		
	});

	Vue.component('modal-configs', { 
		delimiters: ['${', '}'],
		template: '#template-modal-configs',
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
				current_compagny: {value:'9130347038344016'},
				list_compagny:{
					'9130347038344016':'Dummy (Teste)',
					'9130347044451506':'Nutribe (Production)'
				},
				dev_evolution:{value:'stable'},
				dev_evolution_options:{
					'stable':'Version stable',
					'latest_dev':'Version en developpment',
				},
				tax_code_ref: {
					_5percent: {
						value: 0,
						label: "5,5 % TVA FR",
						type_input: 'text',
						default_value: '',
					},
					_20percent: {
						value: 0,
						label: "20 % TVA FR",
						type_input: 'text',
						default_value: '',
					},
					withinfrance: {
						value: 0,
						label: "Pas de TVA FR (Ventes)",
						type_input: 'text',
						default_value: '',
					},
					outsidefranceWitheu: {
						value: 1,
						label: "Pas de TVA EU (Ventes)",
						type_input: 'text',
						default_value: 1,
					},
					franceoverseas: {
						value: 21,
						label: "Pas de TVA DOM",
						type_input: 'text',
						default_value: 21,
					},
					outsideeu: {
						value: 22,
						label: "Pas de TVA Export",
						type_input: 'text',
						default_value: 22,
					},

				},
				tax_rate_ref: {
					_5percentref: {
						value: 0,
						label: "5,5 % TVA FR",
						type_input: 'text',
						default_value: '',
					},
					_20percentref: {
						value: 0,
						label: "20 % TVA FR",
						type_input: 'text',
						default_value: '',
					}
				},
				configs: {
					'company_id': {
						value: '',
						label: 'id de la compagnie',
						type_input: 'text',
						default_value: '9130347044451506',
					},
					'minorversion': {
						value: 32,
						label: "Version de l'API",
						type_input: 'text',
						default_value: 32,
					},
					'DiscountGlobale': {
						value: false,
						label: 'Discount Globale',
						type_input: 'radio',
						default_value: false,
					},
					'customer_account_amazon': {
						value: 112,
						label: "Customer account Amazon",
						type_input: 'text',
						default_value: 112,
					},
					'customer_account_shopify': {
						value: 111,
						label: "Customer account Shopify",
						type_input: 'text',
						default_value: 111,
					},
					'SalesTermRef': {
						value: 5,
						label: "SalesTermRef",
						type_input: 'text',
						default_value: 5,
					},
					/**
					 * 
					 */
					'ArrondiActif': {
						value: true,
						label: 'Arrondi Actif',
						type_input: 'radio',
						default_value: true,
					},
					'activeForceTax': {
						value: false,
						label: 'active Force Tax',
						type_input: 'radio',
						default_value: false,
					},
					'UsePriceZERO': {
						value: false,
						label: 'Use Price ZERO',
						type_input: 'radio',
						default_value: false,
					},
					'UseDiscountPercents': {
						value: true,
						label: 'UseDiscountPercents',
						type_input: 'radio',
						default_value: true,
					},
					// 'MODE_DEV':'production',
				},
				/**
				 * Ajax POST
				 */
				url_post: '',
				headers: {},
				post_datas: '',
				trigger_post_loanding: 0,
				/**
				 * AJAX GET
				 */
				url_get: '',
				queries: {},
				trigger_loanding: 0,
			}
		},
		watch: {
			doaction: function () {

			}
		},
		mounted: function(){
			//
			var current_compagny = getSession('current_compagny');
			if(current_compagny){
				this.current_compagny = {value:current_compagny}; 
			}			
			//
			var dev_evolution = getSession('dev_evolution');
			if(dev_evolution){
				this.dev_evolution = {value:dev_evolution};
			}	
			
		},
		methods: {
			save_config: function () {
				var self = this;
				this.url_post = self.root + '/getcommandes.php';
				this.post_datas = {
					tax_code_ref: self.tax_code_ref,
					tax_rate_ref: self.tax_rate_ref,
					configs: self.configs,
				};
				this.headers = {
					'Content-Type': 'application/json',
					'X-CSRF-Token': action,
				};
			},
			data_from_ajax: function (datas) {
				console.log(datas);
			},
			select_compagny: function (datas){
				saveSession('current_compagny', datas);
				location.reload(true);
			},
			select_mode_dev: function(datas){
				saveSession('dev_evolution', datas);
			},
		}

	});
	
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
	
	
	
	
});

