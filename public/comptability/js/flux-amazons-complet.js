jQuery(document).ready(function($) {
	Vue.component('readCsv',{
		delimiters: ['${', '}'],
		props: {
			id_html:{type: String,default: 'idfilecsv'},
		},
	});
	
	var commandes = new Vue({
	    delimiters : [ '${', '}' ],
	    el : '#fluxAmazon_complet',
	    data : {
	    	//// first day
	        input_firstday:'13-03-2019',
	        label_firstday:'Date de début',
	        defaultvalue_firstday:(Cookies.get('input_firstday'))?Cookies.get('input_firstday'):'',
	        ///// last day
	        input_lastday:'',
	        label_lastday:'Date de fin',
	        defaultvalue_lastday:(Cookies.get('input_lastday'))?Cookies.get('input_lastday'):'',
	    },
	    methods:{
	    	inputsubmit: function(){
	            console.log('inputsubmit perform');
	            //this.saveSelectDate();
	            //this.getdatas()
	          },
	    },
	});
});