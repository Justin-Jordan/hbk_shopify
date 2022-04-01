jQuery(document).ready(function($) {
	
	
	//component input_submit   **************************************************
	  Vue.component('selecteur_date',{
	    delimiters: ['${', '}'],
	    props: {
	    	input_firstday:{type:String, default: '',},
	    	label_firstday:{type:String, default: 'Date de début',},
	    	label_lastday:{type:String, default: 'Date de fin',},  
	    	input_lastday:{type:String, default: '',},
	    },
	    template: '#template_select_date',
	    methods:{
	    	inputsubmit:function(){
	        console.log(' Déclenche save '); 
	      },
	    },
	  });
});