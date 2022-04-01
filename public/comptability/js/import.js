jQuery(document).ready(function($) {
	//Vue.component('import-datas', ImportDatas);  
	/**
	 * C'est le methode vue.js qui est utilisé pour envoyer les données.
	 */
	var fluxAmazon = new Vue({
		delimiters: ['${', '}'],
		el: '#import-files',
		data: {
			root: $('body').attr('data-root'),
			// // first day
			input_firstday: '',
			label_firstday: 'Date de début',
			defaultvalue_firstday: (Cookies.get('input_firstday')) ? Cookies.get(
				'input_firstday') : '',
			// /// last day
			input_lastday: '06-03-2019',
			label_lastday: 'Date de fin',
			defaultvalue_lastday: (Cookies.get('input_lastday')) ? Cookies.get(
				'input_lastday') : '',
			/**
			 *
			 */
			flux_amazon: {},
			flux_amazon_complet: {},
			header_file: [],
			file_array: [],
			file_name: null,
			type: '',
			textes: [],
			click_event: null,
			/**
			 * Ajax
			 */
			url_post: '',
			headers: {},
			post_datas: '',
			trigger_post_loanding: 0,
			/**
			 *
			 */
			config__manage_connect: {},
			filters: {},
			databaseConfig: '',
			/**
			 * Compte QB actif;
			 */
			current_compagny: '',


		},
		mounted: function() {
			var self = this;
			this.url_post = this.root + '/savefile.php';
			/**
			 * Donnée fiscale
			 */
			$("#fupFormUploadDnFicale").on('submit', function(e) {
				e.preventDefault();
				// $('#validSubmit22 i').removeClass('d-none');
				// $('#validSubmit22 i').addClass('fa-spin text-warning');
				var file = $('#fileUpload_0');
				self.readFile(file);

			});

			/**
			 * Import amazon complet
			 */
			var csvData = null;
			$("#fupFormUploadFile").on('submit', function(e) {
				e.preventDefault();
				$('#validSubmit i').removeClass('d-none');
				$('#validSubmit i').addClass('fa-spin text-warning');
				fileName = $('#fileUpload')[0].files[0];

				if (fileName && (fileName['type'] == 'text/csv')) {
					console.log(fileName);
					Papa.parse($('#fileUpload')[0].files[0], {
						config: {
							// base config to use for each file
						},
						complete: function(results, file) {
							// executed after all files are complete
							// console.log("Parsing complete:", results, file);
							console.log(results);
							var event = {};
							executeajax(event, {
								filename: fileName.name,
								datas: results
							}, action = 'put_csv_flux_amazon_complet', asyn = true);
						}
					});
				} else {
					// send file
					$.ajax({
						type: 'POST',
						url: self.root + '/savefile.php',
						data: new FormData(this),
						contentType: false,
						cache: false,
						processData: false,
						beforeSend: function() {
							$('#validSubmit').attr("disabled", "disabled");
							$('#fupFormUploadFile .form-group').css("opacity", ".5");
						},
						success: function(msg) {
							console.log(msg);
							$('#displayErrorAjax').html(msg);
							$('#fupFormUploadFile .form-group').css("opacity", "");
							$(".submitBtn").removeAttr("disabled");
							$('#validSubmit i').addClass('d-none');
							$('#validSubmit i').removeClass('fa-spin text-primary');
						},
					});
				}
			});

			function executeajax(event, datas, action = 'get_invoice', asyn = true) {
				var DatasReturn = null;
				// display syn
				var headers = {
					'Content-Type': 'application/json',
					'X-CSRF-Token': action,
					'X-CSRF-filename': datas.filename,
					'X-CSRF-Endpoints': 'none',
					'Accept': 'application/json',
				};
				// console.log(headers);
				datas = JSON.stringify(datas.datas);

				jQuery.ajax({
					url: self.root + '/savefile.php',
					method: 'POST',
					headers: headers,
					data: datas,
					async: asyn,
					beforeSend: function() {
						$('#validSubmit').attr("disabled", "disabled");
						$('#fupFormUploadFile .form-group').css("opacity", ".5");
					},
					success: function(msg) {
						console.log(msg);
						if (msg.lignes) {
							var nbre_ligne = 0;
							$.each(msg.lignes, function(k, l) {
								nbre_ligne++;
							});
							nbre_ligne -= 1;
							var nbre_insert = (msg.insert) ? msg.insert.length : 0;
							var nre_rejet = (msg.rejecter) ? msg.rejecter.length : 0;
							var id_order = '';
							if (msg.rejecter) {
								$.each(msg.rejecter, function(i, k) {
									if (k.ligne && k.ligne['amazon-order-item-id']) {
										id_order += k.ligne['amazon-order-item-id'] + '; ';
									}
								});
							}
							var html = '';
							html += '<p> Commandes importées : <b>' + nbre_insert +
								'</b></p>';
							html += '<p> Nombre de ligne rejeter : <b>' + nre_rejet +
								'</b> <i class="">' + id_order + '</i></p>';
							html += '<p> <b> Nombre de ligne dans le fichier : ' +
								nbre_ligne + '</b> </p>';
							$('#flux-amason-complet').html(html);
						} else {
							$('#displayErrorAjax').html(msg);
						}
						$('#fupFormUploadFile .form-group').css("opacity", "");
						$(".submitBtn").removeAttr("disabled");
						$('#validSubmit i').addClass('d-none');
						$('#validSubmit i').removeClass('fa-spin text-primary');
					},
					error: function(error) {
						console.log(error);
						if (error.responseText) {
							$('#displayErrorAjax').html(error.responseText);
						} else {
							$('#displayErrorAjax').html(error);
						}

						$('#fupFormUploadFile .form-group').css("opacity", "");
						$(".submitBtn").removeAttr("disabled");
						$('#validSubmit i').addClass('d-none');
						$('#validSubmit i').removeClass('fa-spin text-primary');
					}
				});
				return DatasReturn;
			}

			if (this.defaultvalue_firstday != '' || this.defaultvalue_lastday != '') {
				this.input_firstday = this.defaultvalue_firstday;
				this.input_lastday = this.defaultvalue_lastday;
			}

		},
		methods: {
			inputsubmit: function() {
				console.log('inputsubmit perform');
				this.saveSelectDate();
				this.getdatas();
			},
			saveSelectDate: function() {
				Cookies.set('input_firstday', this.input_firstday);
				Cookies.set('input_lastday', this.input_lastday);
			},
			getdatas: function() {
				var self = this;
				$('.loadDatas i').removeClass('d-none');
				$('.loadDatas i').addClass('fa-spin text-warning');
				console.log('Date debut : ' + self.input_firstday)
				var params = {
					config: {
						'page': 1,
						'nombre': 20,
						'datatype': 'BD_import',
						'databaseConfig': this.databaseConfig,
					},
					filters: self.filters,
				}; /**/
				params = JSON.stringify(params);
				url = self.root + '/getcommandes.php';
				$.ajax({
					url: url,
					method: 'GET',
					data: 'datas=' + params,
					// async : false,
					success: function(data) {
						console.log(data);
						self.flux_amazon = data.flux_amazon;
						self.flux_amazon_complet = data.flux_amazon_complet;
					},
					error: function(error) {
						console.log('error to get datas');
						console.log(error);
						$('#displayErrorAjax').html(error.responseText);
						$('.loadDatas i').addClass('d-none');
						$('.loadDatas i').removeClass('fa-spin text-warning');
					},
				});
			},
			load_files: function(event, type) {
				event.preventDefault();
				this.click_event = event;
				var self = this;
				var file = [];
				self.type = type;
				self.textes = [];
				if (self.type == 'payement') {
					file = $('#fileUpload_payement');
				} else if (self.type == 'expedition') {
					file = $('#fileUpload_expedition');
				}
				console.log(file);
				self.readFile(file);

				/**
				 * $.when()).then(function(){ // validation du fichier
				 * if(!self.valideFieldFile()){ console.log('file ligne : ',
				 * self.file_array); self.executeajax(event,
				 * {filename:self.file_name, file_data:self.file_array},
				 * action='put_csv_flux_payement', asyn=true); }else{
				 * alert("Erreur"); } });
				 */
			},
			readFile: function(file) {
				var self = this;
				if (file && file[0] && file[0].files && file[0].files[0]) {
					console.log(file[0].files);
					this.file_name = file[0].files[0].name;
					readfile_int(file[0].files[0]);
				} else {
					self.textes.push(
						'<div class="alert alert-warning" role="alert"><h4> Fichier vide </h4> </div>'
					);
					return false;
				}

				function readfile_int(file) {
					console.log(file.type);
					if (file.type == 'text/csv') {
						self.readCsv(file);
						return true;
					} else if (file.type == 'text/plain') {
						self.readText(file);
						return true;
					} else {
						self.textes.push(
							'<div class="alert alert-warning" role="alert"><h4>type de fichier non pris en chage</h4> </div>'
						);
					}
					return false;
				}
			},
			readCsv: function(file) {
				console.log(file);
				var self = this;
				Papa.parse(file, {
					config: {
						// base config to use for each file
					},
					complete: function(results, file) {
						// executed after all files are complete
						// console.log("Parsing complete:", results, file);
						console.log(results);
						if (results.errors.length == 0) {
							self.header_file = results.data[0];
							self.file_array = results.data;
							// console.log('file ligne 22 : ', self.file_array);
							self.valideFieldFile();
						} else {
							alert('Erreur de lecture du fichier CSV');
						}
					}
				});
			},
			readText: function(file) {
				console.log(file);
				var self = this;
				Papa.parse(file, {
					config: {
						// base config to use for each file
					},
					complete: function(results, file) {
						// executed after all files are complete
						// console.log("Parsing complete:", results, file);
						console.log(results);
						if (results.errors.length == 0) {
							self.header_file = results.data[0];
							self.file_array = results.data;
							// console.log('file ligne 22 : ', self.file_array);
							self.valideFieldFile();
						} else {
							alert('Erreur de lecture du fichier CSV');
						}
					}
				});
			},
			valideFieldFile: function() {
				var self = this;
				var headers = this.headersFile();
				var error = false;
				var error_fields = '';
				var success_fields = '';
				$.each(headers, function(i, val) {
					if (self.header_file.indexOf(val) < 0) {
						console.log('find : ', val, '; reponse : ', self.header_file.indexOf(
							val));
						error_fields += val + ', ';
						error = true;
					} else {
						// console.log('find : ', val, '; reponse : ',
						// self.header_file.indexOf(val));
						success_fields += val + ', ';
					}
				});
				if (!error) {
					if (self.type == 'payement') {
						self.executeajax(event, {
							filename: self.file_name,
							file_data: self.file_array
						}, action = 'put_csv_flux_payement', asyn = true);
					} else if (this.type == 'expedition') {
						self.executeajax(event, {
							filename: self.file_name,
							file_data: self.file_array
						}, action = 'put_csv_flux_amazon_complet', asyn = true);
					}
				} else {
					console.log('header_file : ', self.header_file);
					console.log('headers validation : ', headers);
					self.textes.push(
						'<div class="alert alert-warning" role="alert"><h4> Structure du fichier non valide </h4> <p> Le fichier doit etre csv avec les memes identifiants </p> </div>'
					);
					if (error_fields != '') {
						self.textes.push('<span>les champs : <strong class="text-danger">' +
							error_fields.trimRight(' ') + '</strong> sont manquant</span>');
					}
					if (success_fields != '') {
						self.textes.push('<span>les champs : <strong class="text-success">' +
							success_fields.trimRight(' ') + '</strong> sont ok</span>');
					}
				}
				return error;
			},
			headersFile: function() {
				if (this.type == 'payement') {
					return [
						"settlement-id",
						"settlement-start-date",
						"settlement-end-date",
						"deposit-date",
						"total-amount",
						"currency",
						"transaction-type",
						"order-id",
						"merchant-order-id",
						"adjustment-id",
						"shipment-id",
						"marketplace-name",
						"shipment-fee-type",
						"shipment-fee-amount",
						"order-fee-type",
						"order-fee-amount",
						"fulfillment-id",
						"posted-date",
						"order-item-code",
						"merchant-order-item-id",
						"merchant-adjustment-item-id",
						"sku",
						"quantity-purchased",
						"price-type",
						"price-amount",
						"item-related-fee-type",
						"item-related-fee-amount",
						"misc-fee-amount",
						"other-fee-amount",
						"other-fee-reason-description",
						"promotion-id",
						"promotion-type",
						"promotion-amount",
						"direct-payment-type",
						"direct-payment-amount",
						"other-amount"
					];
				} else if (this.type == 'expedition') {
					return [
						"amazon-order-id",
						"merchant-order-id",
						"shipment-id",
						"shipment-item-id",
						"amazon-order-item-id",
						"merchant-order-item-id",
						"purchase-date",
						"payments-date",
						"shipment-date",
						"reporting-date",
						"buyer-email",
						"buyer-name",
						"buyer-phone-number",
						"sku",
						"product-name",
						"quantity-shipped",
						"currency",
						"item-price",
						"item-tax",
						"shipping-price",
						"shipping-tax",
						"gift-wrap-price",
						"gift-wrap-tax",
						"ship-service-level",
						"recipient-name",
						"ship-address-1",
						"ship-address-2",
						"ship-address-3",
						"ship-city",
						"ship-state",
						"ship-postal-code",
						"ship-country",
						"ship-phone-number",
						"bill-address-1",
						"bill-address-2",
						"bill-address-3",
						"bill-city",
						"bill-state",
						"bill-postal-code",
						"bill-country",
						"item-promotion-discount",
						"ship-promotion-discount",
						"carrier",
						"tracking-number",
						"estimated-arrival-date",
						"fulfillment-center-id",
						"fulfillment-channel",
						"sales-channel"
					];
				} else {
					return [];
				}
			},
			executeajax: function(event, datas, action = 'get_invoice', asyn = true) {

				var self = this;
				var event = this.click_event;
				$('i', event.target).removeClass('d-none');
				$('i', event.target).addClass('fa-spin text-warning');
				// display syn
				self.headers = {
					'Content-Type': 'application/json',
					'X-CSRF-Token': action,
					'Accept': 'application/json',
				};
				console.log(datas);
				self.post_datas = {
					datasfiles: datas,
					databaseConfig: self.databaseConfig
				};
				self.trigger_post_loanding++;
			},
			data_from_ajax: function(datas) {
				var self = this;
				console.log(datas);
				var event = this.click_event;
				$('i', event.target).addClass('d-none');
				$('i', event.target).removeClass('fa-spin text-warning');
				if (datas.status) {
					if (self.type == 'payement') {
						self.textes = datas.data.results.textes;
					} else if (self.type == 'expedition') {
						var nbre_ligne = self.file_array.length - 2;
						self.textes.push(
							' Nombre de ligne dans le fichier : <strong class="text-sussess">' +
							nbre_ligne + '</strong><br>');
						if (datas.data.insert) {
							self.textes.push(
								' Nombre de ligne inserée : <strong class="text-sussess">' +
								datas.data.insert.length + '</strong><br>');
						} else {
							self.textes.push(
								' Nombre de ligne inserée : <strong class="text-secondary"> 0 </strong><br>'
							);
						}
						if (datas.data.rejecter) {
							self.textes.push(
								' Nombre de ligne rejetée : <strong class="text-sussess">' +
								datas.data.rejecter.length + '</strong><br>');
						}
					}
				} else {

				}
			},
			getconfig__manage_connect: function(configs) {
				this.config__manage_connect = configs;
				this.databaseConfig = configs.databaseConfig;
				this.current_compagny = configs.current_compagny;
				this.filters = configs.filters;
				this.getdatas();
				console.log('getconfig__manage_connect :: ', configs);
			}
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

	function getDateMySql(val, hour = '23:59:59') {
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
			// dataiso +=' '+hour;
			return dataiso;
		}
	}


});
