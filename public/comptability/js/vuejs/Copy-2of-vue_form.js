//  http://blog.doprogramsdream.nl/index.php/blog/upload-image-file-using-rest-api-drupal-8
//  https://wimleers.com/blog/api-first-drupal-8.6
/*
 * <p>&nbsp;1 )&nbsp;&nbsp;composer update drupal/core --with-dependencies</p>

<p>2 )&nbsp;composer update drupal/core webflo/drupal-core-require-dev --with-dependencies</p>

<p>3 )&nbsp;drush updatedb</p>

<p>4 )&nbsp;drush cr</p>

<p><em>Tester sur la version 8.5.5 à 8.5.6 avec succès.</em></p>

 */
jQuery(document).ready( function($) { 
////component
  Vue.component('input_text',{
    delimiters: ['${', '}'],
    props: {
      label:{type: String,default: "input type text"},
      id_html:{type: String,default: "edit-inputtypetext"}
    },
    template: '#form-template-input-text',
    data : function () {
      return {
        name:'',
      }
    },
  });
  // modal bootstrap
  Vue.component('btmodal',{
    delimiters: ['${', '}'],
    props: {
      field:[Object, Array],
      header:{type: String,default: "Modal title"},
      body:[Object, Array],
      model:[Object, Array],
      footer:[Object, Array],
      modalid:{type: String,default: "myModal"},
      modallabel:{type: String,default: "myModalLabel"},
      //addcontent:{type: String,default: "Ajouter"},
      //:{type: String,default: "new-vue-custom2"},
    },
    template: '#bs-modal',
    data : function () {
      return {
        showheader:true,
        showfooter:true,
        template_modalbody:'search-box',
        //addcontent:"Ajouter"
      }
    },
    methods:{
      changetemplate: function(){
        if(this.template_modalbody == 'search-box'){
          var self = this;
          var entity_type = self.field.settings.target_type;
          var bundle = self.field.settings.handler_settings.target_bundles;
          bundle = bundle[Object.keys(bundle)[0]];
          $.ajax({
            url: '/api/custom/'+entity_type+'/'+bundle+'/definition/false',
            method: 'GET',
            // async : false,
            success: function (data) { console.log(data);
              var fieldsAll = generate_schema_form(data);
              //console.log(self.formdatas);
              //console.log(fieldsAll);
            },
            error: function (error) { console.log(error); }
          });
          self.template_modalbody='form-generate';                
        }else{
          var newform = null;
          this.template_modalbody = 'search-box';
        }
      },
    },
    computed: {
      addcontent:{
        get: function(){
          if(this.template_modalbody == 'search-box'){
            return "Ajouter : "+this.field.label;
          }else{
            return 'Enregistrer et selectionner';
          }          
        },
        set: function (value) {
          //si la valeur est modifie 
          console.log(value); 
        },
      },
      new_vue_id:{
        get: function(){
          return "newvuejs-"+this.field.model;
        },
      }
    },
  });
  //search-box
  Vue.component('search-box',{
    delimiters: ['${', '}'],
    props: {
      box_infos:[Object, Array],
      model:[Object, Array],
    },
    template: '#template-search-box',
    data : function () {
      return {
        label:'Rechercher ',
        name:'',
        id_html:'custom-id-text',
      }
    },
    
  });
  //search-box
  Vue.component('new-vue',{
    delimiters: ['${', '}'],
    props: {
      newid:{type: String,default: "new-vue-custom"},
    },
    template: '#template-new-vue',
  });
//tableau
  Vue.component('tableau',{
    delimiters: ['${', '}'],
    props: {
      headers:[Object, Array],
      rows:[Object, Array],
      show_header:{type: Boolean,default: true,},
      show_action:{type: Boolean,default: false,},
      empty_message:{type:String, default: 'Aucun contenu disponible',},
    },
    template: '#tableau-template',
    data : function () {
      return {
      }
    },
    methods:{
      move: function(index){
        console.log('move : '+index);
      }, 
      modifier: function(index){
        console.log('move : '+index);
      },
      supprimer: function(index){
        console.log('move : '+index);
      },
      move_to_top: function(index){
        console.log('move : '+index);
      },
    },
    computed: {
      // hide table if header or body is empty
      table_actif:{
        get: function(){
          if( (this.headers && this.headers.length > 0)  && (this.rows && this.rows.length > 0) ){return true;}else{return false;}
        }
      },
      show_empty_message:{
        get: function(){
          if( (this.headers && this.headers.length > 0)  && (this.rows && this.rows.length > 0) ){return false;}else{return true;}
        }
      },
    },
  });
  //component  
  Vue.component('input_radio',{
    delimiters: ['${', '}'],
    props: {
      field:[Object, Array],
      model:[Object, Array],
    },
    template: '#form-template-input-radio',
    data : function () {
      return {
        name: this.field.model,
        value_on : true,
        value_off : false,
      }
    },
    /*
    created: function () {      
      (function(){
        if(this.model[this.field.model] === true){console.log('vrai defaut radio : true'); this.value_on = true; }
        if(this.model[this.field.model] === 1){console.log('vrai defaut radio : 1'); this.value_on = 1; }
      })();
      (function(){
        if(this.model[this.field.model]===false){console.log('faux defaut radio : false'); this.value_off = false; }
        if(this.model[this.field.model]===0){console.log('faux defaut radio : 0'); this.value_off = 0; }
      })();
    },*/
    computed: {
      id_html: {
        get: function (){
          //console.log(this.field);
          return 'edit-'+this.field.model
        }
      },
      id_html_off:{
        get: function (){
          //console.log(this.field);
          return 'edit-off-'+this.field.model
        }
      },/*
      value_on:{
        get: function (event){
          console.log(event);
          console.log(this.model);
          console.log(this.field.model);
          console.log(this.model['status']);
          if(this.model[this.field.model] === true || this.model[this.field.model]===false ){
            console.log('vrai defaut radio : true'); 
            
            return true; 
          }
          if(this.model[this.field.model] === 1){console.log('vrai defaut radio : 1'); return 1; }
          //return 1;
        }
      },
      value_off:{
        get: function (){
          
          if(this.model[this.field.model]===false){console.log('faux defaut radio : false'); return false; }
          if(this.model[this.field.model]===0){console.log('faux defaut radio : 0'); return 0; }
          //return 0;
        }
      },*/
    },
  });
//component 
  Vue.component('input_submit',{
    delimiters: ['${', '}'],
    props: {
      field:[Object, Array],
      model:[Object, Array],
      //type:String,
    },
    template: '#form-template-input-submit',
    methods:{
      savef:function(){
        console.log('declanche la methode parent ');
        this.$emit('ev_bonjour');
        //console.log(this.type);
      },
    },
  });
  //component input_select
  Vue.component('input_select',{
    delimiters: ['${', '}'],
    props: {
      field:[Object, Array],
      model:[Object, Array],
    },
    template: '#form-template-input-select',
    data : function () {
      return {
      }
    },
  });
  //component 
  Vue.component('input_image',{
    delimiters: ['${', '}'],
    props: {
      field:[Object, Array],
      model:[Object, Array],
    },
    template: '#form-template-input-image',
    data : function () {
      return {
      }
    },
    methods: {
      remove_image: function(index){
        _supprimer_ligne(index, this.model[this.field.model].image_data, poubeles=[], put_in_trash=false);
      },
      previewImage: function(event) {
        //  https://www.javascripture.com/FileReader
        //  https://stackoverflow.com/questions/32556664/getting-byte-array-through-input-type-file/32556944
        //  
        
          var self = this;
          // Reference to the DOM input element
          var input = event.target; console.log(event);
          // Ensure that you have a file before attempting to read it
          if (input.files && input.files[0]) {
            
            self.$emit('ev_saveimage', input.files[0]);
            /// ############################################################
            //  https://www.axelerant.com/resources/team-blog/how-to-create-custom-restful-resources-in-drupal-8
            //  https://internet80.com/blog/upload-a-file-with-html5/
            //  data to send to server
            
            /*
            var formData = new FormData();

            //formData.append("username", "Groucho");
            //formData.append("accountnum", 123456); // number 123456 is immediately converted to a string "123456"
             
            // HTML file input, chosen by user
            formData.append("thefile", input.files[0]);

            // JavaScript file-like object
            // var content = '<a id="a"><b id="b">hey!</b></a>'; // the body of the new file...
            // var blob = new Blob([content], { type: "text/xml"});

            //formData.append("webmasterfile", blob);
            //formData = 'name=kksa888';
            //formData = JSON.stringify(formData)
            var request = new XMLHttpRequest();
            request.open("POST", '/api/custom/uploadfile', true);
            request.onload = function(e) {
              var data = JSON.parse(this.response); console.log(data);
              console.log(e.currentTarget);
            }
            request.setRequestHeader("Content-Type", "multipart/form-data");            
            request.send(formData);
            */
            /*
            var formData = new FormData();
            formData.append("mycustomfile", input.files[0]);
            
            $.ajax({
              type: 'POST',
              url: '/api/custom/uploadfile',
              data: formData,
              contentType: false,
              cache: false,
              processData:false,
              beforeSend: function(){
                  //execute before send data
              },
              success: function(datas){
                console.log(datas);
              },
              error: function (error) { console.log('false');
                console.log(error);
              }
          });
          */
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
              // create a new FileReader to read this image and convert to base64 format
              var readerfile = new FileReader();
              // Define a callback function to run, when FileReader finishes its job
              readerfile.onload = (e) => {
                  // Note: arrow function used here, so that "this.model[this.field.model].image_data refers to the imageData of Vue component
                  // Read image as base64 and set to this.model[this.field.model].image_data
                  if(this.field.multiple){                    
                    this.model[this.field.model].image_data.push(e.target.result);
                    //console.log(this.model[this.field.model].image_data);
                  }else{
                    this.model[this.field.model].image_data=[];
                    this.model[this.field.model].image_data.push(e.target.result);
                  }
                  //save image on server and return id
                  /*
                  imgInfos = {
                      data:e.target.result,
                      info:input.files[0],
                  }*/
                  //this.$emit('ev_saveimage', imgInfos);
              }
              // Start the reader job - read file as a data url (base64 format)
              readerfile.readAsDataURL(input.files[0]);
              //input.value = "";
              
              
          }
      },      
  }
  });
  //component input_select
  Vue.component('input_autocomplete',{
    delimiters: ['${', '}'],
    props: {
      field:[Object, Array],
      model:[Object, Array],
    },
    template: '#form-template-input-autocomplete',
    data : function () {
      return {
        id_html : 'edit-'+this.field.model,
      }
    },
    mounted: function(){
      var self = this; 
      $('#edit-'+this.field.model).autocomplete({
        //source: this.availableTags,
        delay: 700,
        select: function( event, ui ) {
          event.preventDefault();
          //apply a label ( default is value)
          $('#edit-'+self.field.model).val(ui.item.label);
          self.model[self.field.model].target_ids = [];
          self.model[self.field.model].target_ids.push({target_id: ui.item.value});
          self.model[self.field.model].label_term = ui.item.label;
          console.log('After update taxasomy term ');
          console.log(self.model);
        },
        focus: function(event, ui) {
          event.preventDefault();
          $('#edit-'+self.field.model).val(ui.item.label);
      }
      });
      
    },
    methods:{
      autocomplete_function:function(event){
        var self = this;
        var search = $('#edit-'+this.field.model).val();
        var obj = this.field.settings.handler_settings.target_bundles;
        obj = obj[Object.keys(obj)[0]]; //console.log(obj);
        $.ajax({
          url: '/api/custom/taxonomy_term/'+obj+'/listes/'+search,
          method: 'GET',
          success: function (data) { console.log(data);
            var tags = [];
            $.each(data, function(index, value){
              tags.push({
                label: value,
                value: index,
            });
            });
            $('#edit-'+self.field.model).autocomplete("option", "source",
              function (request, response) {
              //data :: JSON list defined
              response(tags);
            }
           );
          },
          error: function (error) { console.log(error);}
        });
        console.log(event);
        console.log(search);
      },
    },
    /*
    computed: {
      id_html: {
        get: function (){          
          return 'edit-'+this.field.model
        }
      }
    },*/
  });
  Vue.component('input_select_in_modal',{
    delimiters: ['${', '}'],
    props: {
      field:[Object, Array],
      model:[Object, Array],
    },
    template: '#form-template-select-in-modal',
    data : function () {
      return {
        //id_html: this.field.model   
        loadfirst:true,
        datas:{
          datas:[],
          infos:{
            label:"Ajouter",
          }
          
        },
      }
    },
    mounted: function(){
      
    },
    computed: {
      id_html: {
        get: function (){
          return 'edit-'+this.field.model
        }
      }
    },
    methods:{
      displayOnModal: function(){
        var self = this;
        console.log('display modal');
        $('#modal-'+this.field.model).modal();
        var entity_type=this.field.settings.target_type;;
        var bundle=this.field.settings.handler_settings.target_bundles;
        bundle = bundle[Object.keys(bundle)[0]];
        //on effectue une premiere requete
        $.ajax({
          url: '/api/custom/'+entity_type+'/'+bundle+'/listes_select/20',
          method: 'GET',
          // async : false,
          success: function (data) { console.log(data);
            if(data.infos.label){
              self.datas=data;
            }
          },
          error: function (error) { console.log(error);}
        });
      }
    },
    components: {
      'container-modal':{
        template: `<btmodal :body="modalbody" :model="model" :modalid="buildid" :modallabel="buildidlabel" :header="field.label"  :field="field" ></btmodal>`,
        props: {
          modalbody:[Object, Array],
          model:[Object, Array],
          field:[Object, Array],
        },
        computed: {
          /*
          text_ajouter:{
            get: function(){
              console.log(this.modalbody);
              return "Ajouter : "+this.modalbody.infos.label;
            }
          },*/
          buildid: {
            get: function (){
              return 'modal-'+this.field.model;
            }
          },
          buildidlabel: {
            get: function (){
              return 'label-'+this.field.model;
            }
          },
        },
        methods:{
        },
      }
    }
  });
  Vue.component('form-generate', {
    delimiters: ['${', '}'],
    template: '#form-template',
    props: {
      fields:[Object, Array],
      model0:[Object, Array],
      submit:{
        type: [Object, Array],
        default: function () {
            return {label:'enregistre', callback:'ev_bonjour',};
          }
      },
      settings_base:[Object, Array],
    },    
    data : function () {
      return {
        classe: 'form-builder my-5'
      }
    },
    methods:{
      save_f2: function(){
        console.log(' Déclenche le parent Niveau suivant');
        this.$emit('ev_saveform');
      }
    },
    components: {      
      'formfield':{        
        props: {
          renderfield:[Object, Array],
          model:[Object, Array],
          settings:[Object, Array],
          //type:String,
        },
        template: ` <component v-bind:is="template_input" class="form-group" :field="renderfield" :model="model"  @ev_saveimage="saveImage" :label="renderfield.label" :name="renderfield.name" :id_html="build_id_html"></component>
        `,
        created: function() {
          if(this.renderfield.multiple && this.renderfield.multiple.number){
            this.$options.template = '<fieldset class="form-group">'+this.$options.template+'</fieldset>';
          }
        },
        methods:{
          saveImage: function(file){
            var self = this;
            /*
            */
            console.log(this.renderfield);
            console.log(' Save image ');
            console.log(file);
            var entity_type_id = 'node'; var bundle = field ='';
            var filename = (file.name).replace(/[^a-zA-Z0-9.]/g,'-');
            filename = filename.toLowerCase();
            field = this.renderfield.model;
            if(this.settings.type[0].target_type == 'node_type'){
              entity_type_id = 'node';
            }
            var formData = new FormData();
            formData.append('data', file);
            if(this.settings.type[0].target_id){bundle=this.settings.type[0].target_id;}  
              getCsrfToken(function (csrfToken) {                
                var url = '/file/upload/'+entity_type_id+'/'+bundle+'/'+field+'?_format=json';
                console.log(url);
                $.ajax({
                  type: 'POST',
                  url: url,
                  data: file,
                  contentType: false,
                  cache: false,
                  processData:false,
                  beforeSend: function(xhr){
                    xhr.setRequestHeader('X-CSRF-Token', csrfToken);
                    xhr.setRequestHeader('Content-Disposition', 'file; filename="'+filename+'"');
                    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                  },
                  success: function(datas){
                    console.log(datas);
                    presave_image_fid(datas);
                  },
                  error: function (error) { console.log('false');
                    console.log(error);
                  }
              });
            });
            function presave_image_fid(datas){
              console.log('image haved save succes, and retuen fid ');
              console.log(self.model[self.renderfield.model].target_ids);
              self.model[self.renderfield.model].target_ids.push({target_id:datas.fid[0].value, alt:''});
              console.log(self.model);
            }
          },
        },
        computed: {
          template_input: {
            get: function (){
              if(this.renderfield.type === 'input'){
                var component_name = 'input_' + this.renderfield.inputType;
              }else{
                var component_name = 'input_' + this.renderfield.type;
              }
              isComponentExists = component_name in Vue.options.components
              if(isComponentExists){
                console.log(' Template is define ok');
                return component_name;
              }else{
                console.log(' Template not define Error : '+component_name);
              }              
            },
          },
          build_id_html: {
            get: function(){
              return 'edit-'+this.renderfield.name;
            },
          },        
        },
      },      
    },    
  }); 
  var FormGenerate = new Vue({
    delimiters: ['${', '}'], 
    el: '#FormGenerate',
    data:{
      formdatas:{
        fields:[],
        model:{},
        submit:{
          label:'Enregistrer',
          callback:'ev_bonjour',
        },
        settings:{
          type: [{
            target_id: "equipements",
            target_type: "node_type",
          }],
        }
      },
    },
    mounted: function () {
      var self = this;
      
      $.ajax({
        url: '/api/custom/node/equipements/definition/false',
        method: 'GET',
        // async : false,
        success: function (data) { console.log(data);
          var fieldsAll = generate_schema_form(data);
          self.formdatas.model = fieldsAll.model;
          self.formdatas.fields = fieldsAll.fields;
          //console.log(self.formdatas);
          //console.log(fieldsAll);
        },
        error: function (error) { console.log('false');
            console.log(error);
        }
    });       
    },
    methods:{
      saveform: function(){
        console.log('Custom methode : saveform');
        var newNode = buildNode(this.formdatas);
        getCsrfToken(function (csrfToken) {
          console.log('Before save Node')
          console.log(newNode);
          postEntity(callback2, csrfToken, newNode);          
        });
      },
      
    },
  });
  
  /**
   * 
   */
  function callback2(datas){
    console.log('form haved save with succes');
    //console.log(datas);
  }
  
  /**
   * 
   */
  function buildNode(formdatas){
    var node = {};
    node['type']=formdatas.settings.type;   
    $.each(formdatas.model, function(index, valeur){
      // save image
      if(valeur.image_data == "" || valeur.image_data){
        if(valeur.target_ids.length > 0){
          //add default alt
          $.each(valeur.target_ids, function(key, element){
            if(valeur.target_ids[key].alt == ""){
              valeur.target_ids[key].alt = formdatas.model['title'];
            }
          });
          node[index]= valeur.target_ids;
        }        
      }
      // save term taxonomies
      else if(valeur.label_term == "" || valeur.label_term){
        if(valeur.target_ids.length > 0){
          node[index]= valeur.target_ids;
        }        
      }
      else {
        node[index]={
            value:valeur,
        };
      }
      
    });
    return node;    
  }
  
  /**
   * 
   */
  function generate_schema_form(data){
    // more infos
    // https://icebob.gitbooks.io/vueformgenerator/content/installation.html
    // https://blog.rangle.io/how-to-create-data-driven-user-interfaces-in-vue/
    // https://vuejsfeed.com/blog/generate-forms-using-json-schema-and-vue-js
    // https://jsfiddle.net/mani04/5zyozvx8/
    // https://stackoverflow.com/questions/49106045/preview-an-image-before-it-is-uploaded-vuejs
    // https://github.com/vue-generators/vue-form-generator/issues/226   ( how to add bouton "add more" )
    // https://antonreshetov.github.io/vue-form-components/#/components/input  (genrateur de form beau design )
    // 
    
    var fields = new Array(); var model = {}; var booleens = defaultFieldNotDisplay();
    $.each( data, function( key, value ) {
      if(value.type == "string"){
        fields.push({
            type: "input",
            inputType: "text",
            label: value.label,
            model: value.name,
            settings:value.settings,
        });
        model[value.name]='';
      }
      if(value.type == "boolean" ){
        if(booleens[value.name]){}else{
        model[value.name]='';
        if(value.defaults[0]){
          if(value.defaults[0].value){
            model[value.name]=true;
          }else{
            model[value.name]=false;
          }
          
        }        
        fields.push({
          type: "radio",
          label: value.label,
          model: value.name,
          multi: true,
          textOn: value.settings.on_label,
          textOff: value.settings.off_label,
          settings:value.settings,
        });
        }
      }
      if(value.type == "list_string"){ 
        model[value.name]='';
        fields.push({
          type: "select",
          label: value.label,
          model: value.name,
          values: value.settings.allowed_values,
          settings:value.settings,
        });
      }
      if(value.type == "entity_reference"){
      	if(value.settings.target_type == "taxonomy_term"){
      	  model[value.name]={
      	    target_ids:[],
      	    label_term:''
      	  };
      	  fields.push({
      	    type: "autocomplete",
      	    label: value.label,
      	    model: value.name,
      	    values: value.settings.allowed_values,
      	    settings:value.settings,
      	  });
      	}
      	if(value.settings.target_type == "node"){
      	  model[value.name]={
              target_ids:[],
              label_term:''
            };
      	  fields.push({
            type: "select_in_modal",
            label: value.label,
            model: value.name,
            values: value.settings.allowed_values,
            settings:value.settings,
          });
      	}
      }
      if(value.type == "image"){
        model[value.name]={
          image_data:[],
          target_ids:[],
        };
        fields.push({
          type: "image",
          label: value.label,
          model: value.name,
          preview:true,
          multiple:{
            number:true,
            infiny:true,
          },
          settings:value.settings,
        });
      }
    });
        
    return {fields, model};
  }
  
  /**
   * 
   */
  function defaultFieldNotDisplay(){
    return {
      'sticky' : true,
      'revision_default' : true,
      'promote':true,
      'default_langcode':true,
      'content_translation_outdated':true,
    };
  }
  /**
   * 
   */
  function postEntity(callback2, csrfToken, entity, url='/node?_format=json') {
    //console.log(entity);
    var datas;
    var headers = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken, 
    };
    datas = JSON.stringify(entity);
    jQuery.ajax({
      url: url,
      method: 'POST',
      headers: headers,
      data: datas,
      success: function (datas) {
        callback2(datas);
        console.log(datas);
      },
      error: function (error) { console.log('false');
        console.log(error);
      }
    });
  }
  
  /**
   * 
   */
  function getCsrfToken(callback) {
    jQuery
      .get(Drupal.url('rest/session/token'))
      .done(function (data) {
        var csrfToken = data;
        callback(csrfToken);
      });
  }
  
  /**
   * 
   * @param index
   * @returns
   */
  function _supprimer_ligne(index, lignes, poubeles=[], put_in_trash=false){
    console.log('ligne : '+index+' delete '); 
    //console.log(lignes);
    //console.log(factureV1.ventes);    
    if(put_in_trash){
      poubeles.push(lignes[index]);
      //doit etre automatique.
      factureV1.etat.ventes_delete = true;
    }
    // Delete
    lignes.splice(index,1);
    //console.log(ligne);
  }
  
  /*  
  var newNode = {
      type: [{
          target_id: "article",
          target_type: "node_type",
        }],
      title: {
        value: 'Example node title'
      }
    };
  console.log(newNode);
 */ 
  
});