jQuery(document).ready(function($) {

	var commandes = new Vue({
		delimiters: ['${', '}'],
		el: '#tests',
		data: {
			date_insert: {
				value: ''
			},
			confis: {},
			token: 'test_inset_date_format',
			date_convert: false,
		},
		methods: {
			getconfig__manage_connect: function(datas) {
				console.log(datas);
				this.confis = datas;
			},
			send_save: function() {
				this.date_convert = false;
				if (this.date_insert.value) {
					this.confis.insert = {
						'table': 'testdata',
						'fields': {
							'data': this.date_insert.value,
							'nomprenom': this.date_insert.value,
						}
					};
					this.$refs.sendDataAjax.send_data();
				}
				console.log('send_save');
			},
			data_from_ajax: function(datas) {
				console.log(datas);
				if (datas.status) {
					this.date_convert = 'Date convertie : ' + datas.data.return.test_inset_date_format
						.date_convert;
				} else {
					this.date_convert = 'erreur';
				}
			}
		}
	});
});
