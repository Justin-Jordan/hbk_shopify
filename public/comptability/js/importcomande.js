jQuery(document).ready(function($) {
  var importcommandes = new Vue({
    delimiters : [ '${', '}' ],
    el : '#importcommandes',
    data : {
      // root index
      root : $('body').attr('data-root'),
      message:'',
    },
    mounted : function() {
      //this.importcommandes();
    },
    methods:{
      importcommandes: function(e){
        if(e){
          e.preventDefault();          
        }
        
        var self = this;
        var params = {};
        params = JSON.stringify(params);
        url = self.root + '/cron.php';
        $('#buttonCommandes i').removeClass('d-none');
        $('#buttonCommandes i').addClass('fa-spin text-warning');
        $.ajax({
          url : url,
          method : 'GET',
          data : 'datas=' + params,
          // async : false,
          success : function(data) {
            console.log(data);
            $('#buttonCommandes i').addClass('d-none');
            $('#buttonCommandes i').removeClass('fa-spin text-primary');
            self.message = '<h4 class="pt-4 pb-0 mb-0">Shopify</h4>';
            self.message += '<br>Date min : '+ data.shopify.created_at_min;
            self.message += '<br>Nombre de commandes : '+ data.shopify.total;
            var ui=(data.shopify.order_insert && data.shopify.order_insert.length)?data.shopify.order_insert.length:0;
            self.message += '<br>Commande ajouté : '+ ui;
            var ti=(data.shopify.order_refuse && data.shopify.order_refuse.length)?data.shopify.order_refuse.length:0;
            self.message += '<br>Commande rejeté : '+ ti;
            //var up=(data.shopify.order_update && data.shopify.order_update.length)?data.shopify.order_update.length:0;
            //self.message += '<br>Commande mis à jours : '+ up;
            //
            self.message += '<h4 class="pt-4 pb-0 mb-0">Amazon</h4>';
            self.message += '<br>Date min : '+ data.amazon.created_at_min;
            self.message += '<br>Nombre de commandes : '+ data.amazon.total;
            var ui=(data.amazon.order_insert && data.amazon.order_insert.length)?data.amazon.order_insert.length:0;
            self.message += '<br>Commande ajouté : '+ ui;
            var ti=(data.amazon.order_refuse && data.amazon.order_refuse.length)?data.amazon.order_refuse.length:0;
            self.message += '<br>Commande rejeté : '+ ti;
            var up=(data.amazon.order_update && data.amazon.order_update.length)?data.amazon.order_update.length:0;
            self.message += '<br>Commande mis à jours : '+ up;
            //
          },
          error : function(error) {
            console.log('error to get datas');
            console.log(error);
            $('#displayErrorAjax').html(error.responseText);
          }
        });
      },
    }
  });
});