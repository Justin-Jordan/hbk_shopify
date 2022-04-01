jQuery(document).ready(function ($) {
	Vue.component('readCsv', {
		delimiters: ['${', '}'],
		props: {
			id_html: { type: String, default: 'idfilecsv' },
		},
	});

	new Vue({
		delimiters: ['${', '}'],
		el: '#remboursements',
		data: {
			/**
			 * 
			 */
			root: $('body').attr('data-root'),
			// // first day
			input_firstday: '',
			label_firstday: 'Date de début',
			defaultvalue_firstday: (Cookies.get('input_firstday')) ? Cookies.get('input_firstday') : '',
			// /// last day
			input_lastday: '',
			label_lastday: 'Date de fin',
			defaultvalue_lastday: (Cookies.get('input_lastday')) ? Cookies.get('input_lastday') : '',
			/**
			 * Tableau
			 */
			show_action: false,
			rows: [],
			headers: [],
			footers: [],
			show_footer: false,
			create_invoice_modal_body: {},
			actionparent: {},
			align_header: true,
			show_reel_index: true,
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
			/**
			 * if (this.defaultvalue_firstday != '' || this.defaultvalue_lastday !=
			 * '') { this.input_firstday = this.defaultvalue_firstday;
			 * this.input_lastday = this.defaultvalue_lastday; }
			 */
			// this.getDatas();
		},
		methods: {
			inputsubmit: function () {
				this.saveSelectDate();
				this.getDatas();
			},
			saveSelectDate: function () {
				console.log('Prepare to save : ', this.input_firstday, this.input_lastday);
				let input_firstday = getDateMySql(this.input_firstday);
				let input_lastday = getDateMySql(this.input_lastday)
				Cookies.set('input_firstday', input_firstday);
				Cookies.set('input_lastday', input_lastday);
				console.log('Date save french : ', input_firstday, input_lastday);
			},
			getDatas: function () {
				var self = this;
				console.log('date debut : ' + self.input_firstday)
				var params = {
					config: {
						'page': 1,
						'nombre': 20,
						'datatype': 'BD_remboursements',
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
						if (data.rembourssements) {
							var tableau = buildArray(data.rembourssements, []);
							self.rows = tableau.rows;
							self.headers = tableau.headers;
							self.footers = tableau.footers;
						}
					},
					error: function (error) {
						console.log('error to get datas');
						console.log(error);
						$('#displayErrorAjax').html(error.responseText);
					}
				});
			},
			getconfig__manage_connect: function(configs){
				this.config__manage_connect = configs;
				this.databaseConfig = configs.databaseConfig;				
				this.current_compagny = configs.current_compagny;
				this.input_firstday = configs.input_firstday;
				this.input_lastday = configs.input_lastday;
				this.getDatas();
				console.log(configs);
			}

		},
	}); 



	/**
	 * 
	 */
	function buildArray(rows, fieldsPlus) { // console.log(rows);
		var results = {}, total = { number: 0, monney: 0, };
		var headers = [], footers = {};
		var identifiant = 'order-id';
		var removeIt = {
			first_name: 'jptest',
		}
		var valide_key = {
			'posted-date': {
				name: 'posted-date',
				label: 'Date',
			},
			'sku': {
				name: 'sku',
				label: 'Sku',
			},
			'Principal': {
				name: 'Principal',
				label: 'Montant',
			},
			'Tax': {
				name: 'Tax',
				label: 'Taxe',
			},
			'Shipping': {
				name: 'Shipping',
				label: 'Livraison',
			},
			'ShippingTax': {
				name: 'ShippingTax',
				label: 'Tva Livraison',
				conditionValue: { condition: null, value: 0 },
			},

		};


		/**
		 * Parcourt des lignes du tabeau.
		 */
		$.each(rows, function (key, valeur) {
			var remove = false;
			var id = valeur[identifiant];
			results[id] = {}; total.number += 1;
			/**
			 * Traitement de chaque cellule de ligne.
			 */
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
							else if (f == 'lower_case') {
								results[id][value.name] = lower_case(results[id][value.name]);
							}
							else if (f == 'getMysqlDateToFrench') {
								results[id][value.name] = getMysqlDateToFrench(results[id][value.name]);
							}
						});
					}

				} else {
					// results[id][index] = valeur[index];
				}

				/**
				 * Set conditionValue value
				 */
				if (value.conditionValue) {
					console.log(results[id][value.name])
					if (results[id][value.name] == value.conditionValue.condition) {
						results[id][value.name] = value.conditionValue.value;
					}
				}
			});
			/**
			 * Ajout de cellule personnalisée
			 */


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

	function add_EURO(data) {
		if (data != '' || data == 0) {
			if (data > 0) {
				data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			}
			return data + ' €';
		}
		return '';
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
			var d = data.split(' ');
			if (d[0]) {
				var r = d[0].split('-');
				return r[2] + '/' + r[1] + '/' + r[0] + ' ' + d[1];
			}
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



});
