jQuery(document).ready(function($) {
  // //profil user
  var commandes = new Vue({
    delimiters : [ '${', '}' ],
    el : '#commandes',
    data : {
      entete: 'Commandes',
      rows : [],
      headers : [],
      root : $('body').attr('data-root'),
      align_header : true,
      show_reel_index : true,
    },
    mounted : function() {
      var params = {
        config : {
          'path' : '/admin/orders.json',
          'uid' : 123,
          'datatype' : 'BD_orders',
        },
      };/**/
      params = JSON.stringify(params)
      var self = this;
      url = self.root + '/shopify.php';
      $.ajax({
        url : url,
        method : 'GET',
        data : 'datas=' + params,
        // async : false,
        success : function(data) {
          console.log(data);
          var data = buildArray(data.datas.orders);
          console.log(data);
          self.rows = data.rows;
          self.headers = data.headers;

        },
        error : function(error) {
          console.log('error to get datas');
          console.log(error);
        }
      });
    },
  // template: '#template-profile',
  });

  function buildArray(rows) {
    var results = {};
    headers = [];
    var removeIt = {
      first_name : 'jptest',
    }
    var valide_key = {
      // cart_token:'Cart token',
      // checkout_id:'Checkout id',
      // email:'Email',
      processed_at:{
        name:'processed_at',
        label:'Date',
        perfom:['getDateinFrench'],
      },
      gateway : {
        name:'gateway',
        label:'Passerelle',
      },
      total_line_items_price :{
        name:'total_line_items_price',//'Montant HT en Euro',
        label:'Panier TTC',
        perfom:['add_EURO'],
      },
      code:{
        name:'code',
        label : 'Code promo',
        obj : ['discount_codes'],
      },
      total_price :{
        label:'Total TTC',
        name:'total_price',
        perfom:['add_EURO'],
      },//'Montant en Euro',
      /*
      first_name : {
        label : 'Prénom & Nom',
        name:'first_name',
        obj : 'customer',
        addfield :['last_name'],
      },
      total_tax :{
        label:'Taxe',
        name:'total_tax',
      },
      */
    }
    $.each( rows, function(key, valeur) {
      var remove = false;
      var id = valeur.id;
      results[id] = {};
      $.each(valide_key, function(index, value) {
        // sous object
        if ((value instanceof Array || value instanceof Object)) {
          //multiple filed
          if(value.addfield && value.obj){
            var infos='';
            if(value.obj instanceof Array){
              $.each(value.addfield, function(c, vl){
                if(valeur[value.obj[0]][0]){
                  infos +=' '+valeur[value.obj[0]][0][vl]; 
                }
              });
            }else{
              $.each(value.addfield, function(c, vl){
                infos +=' '+valeur[value.obj][vl];
              });
            }
            //active remove
            if (removeIt[value.name] && (removeIt[value.name] == valeur[value.obj][value.name])) {
              remove = true;
            }
            results[id][value.name] = valeur[value.obj][value.name] + infos;
          }else if(value.obj){
            if(value.obj instanceof Array){
              if(valeur[value.obj[0]][0]){results[id][value.name] = valeur[value.obj[0]][0][value.name];}              
            }else{
              results[id][value.name] = valeur[value.obj][value.name];
            }            
          }else{
            results[id][value.name] = valeur[value.name];
          }
          //active remove
          if (removeIt[value.name] && (removeIt[value.name] == results[id][value.name])) {
            remove = true;
          }
          
          // format data
          if(value.perfom){
            $.each(value.perfom, function(i, f){
              if(f=='getDateinFrench'){
                results[id][value.name] = getDateinFrench(results[id][value.name]);
              }
              else if(f=='add_EURO'){
                results[id][value.name] = add_EURO(results[id][value.name]);
              }
            });
          }
        } else {
          //results[id][index] = valeur[index];
        }
        
      });
      if (remove) {
        delete results[id];
      }

    });
    $.each(valide_key, function(index, value) {
      headers.push(value);
    });
    return {
      'rows' : results,
      'headers' : valide_key
    };
  }
  
  function getDateinFrench(data){
    var _date = new Date(data);
    var french_date = (_date.getDate()) +'/'+ (_date.getMonth() + 1) +'/'+ (_date.getFullYear());
    return french_date;
  }
  
  function add_EURO(data){
    return data+' €';
  }

  function test() {
    var params = {
      config : {
        'path' : '/admin/orders/812074172482.json',
        'uid' : 123,
        'datatype' : 'orders',
      },
    };/**/
    params = JSON.stringify(params)
    $.ajax({
      url : $('body').attr('data-root') + '/shopify.php',
      method : 'GET',
      data : 'datas=' + params,
      // async : false,
      success : function(data) {
        console.log(data);

      },
      error : function(error) {
        console.log('error to get datas');
        console.log(error);
      }
    });
  }
  //test();

});