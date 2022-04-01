jQuery(document).ready(function($) {
	Vue.component('import-datas', ImportDatas);
	new Vue({
		delimiters: ['${', '}'],
		el: '#import-files',		
		methods: {
			getconfig__manage_connect: function(datas) {
				this.$refs.importdatas.manage_connect(datas);
			}
		}

	});
});
