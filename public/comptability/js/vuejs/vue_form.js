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
      id_html:{type: String,default: "edit-inputtypetext"},
      name:[Object, Array],   
    },
    template: '#form-template-input-text',
    data : function () {
      return {
        //name:'',
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
        //datas forms news form
        sub_fields:[],
        sub_models:{},
        settings:{
          type: [{
            target_id: "",
            target_type: "node_type",
          }],
        },
      }
    },
    methods:{
      changetemplate: function(){
        if(this.template_modalbody == 'search-box'){
          var self = this;
          var entity_type = self.field.settings.target_type;
          var bundle = self.field.settings.handler_settings.target_bundles;
          bundle = bundle[Object.keys(bundle)[0]];
          self.settings.type[0].target_id=bundle;
          $.ajax({
            url: '/api/custom/'+entity_type+'/'+bundle+'/definition/false',
            method: 'GET',
            // async : false,
            success: function (data) { console.log(data);
              var fieldsAll = generate_schema_form(data);
              self.sub_fields = fieldsAll.fields;
              self.sub_models = fieldsAll.model;  
            },
            error: function (error) { console.log(error); }
          });
          self.template_modalbody='form-generate';                
        }else{
          var newform = null;
          this.template_modalbody = 'search-box';
        }
      },
      saveform: function(){
        //console.log('enregistrement du formaulaire btmodal');
        //console.log(this.sub_models);
        var formdatas={
            fields:this.sub_fields,
            model:this.sub_models,
            settings:this.settings,
        };
        var newNode = buildNode(formdatas);
        getCsrfToken(function (csrfToken) {
          console.log('Before save Node')
          console.log(newNode);
          postEntity(callback2, csrfToken, newNode);          
        });
        
      },
      execute_action: function(params){
        console.log('execute_action');
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
      field:[Object, Array],
    },
    template: '#template-search-box',
    data : function () {
      return {
        label:'Rechercher ',
        id_html:'custom-id-text',
        nameinput:{
          value:''
        },
      }
    },
    
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
      model:[Object, Array],
      fields:[Object, Array],
      field:[Object, Array],
    },
    template: '#tableau-template',
    data : function () {
      return {
        arrayStructure:{
          type:''
        }
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
      numberlevel: function(){
          if( (this.rows && this.rows != {} ) ){
            var firstvalue=this.rows;
            firstvalue = firstvalue[Object.keys(firstvalue)[0]];
            console.log('firstvalue');
            console.log(firstvalue);
            if (typeof firstvalue === 'string' || firstvalue instanceof String){
              this.arrayStructure.type = 'string';
              return 'string';
            }
            this.arrayStructure.type = 'object';
            return true;
          }
      },
      select_and_close: function(index){
        //console.log('user select ligne');
        //console.log(this.field);
        //console.log(this.model);
        if(this.arrayStructure.type == 'string'){
          this.model[this.field.model].target_ids=index;
          this.model[this.field.model].label_node=this.rows[index];
          //close modal
          $('#modal-'+this.field.model).modal('hide');
        }
        
      }
    },
    computed: {
      // hide table if header or body is empty
      table_actif:{
        get: function(){
          console.log('tableau datas')
          console.log(this.rows);
          console.log(Object.keys(this.rows))
              console.log(Object.keys(this.rows).length);
          if( (this.headers && Object.keys(this.headers).length > 0  )  || (this.rows && Object.keys(this.rows).length > 0 ) ){return true;}else{return false;}
        }
      },
      show_empty_message:{
        get: function(){
          if( (this.headers && Object.keys(this.headers).length > 0  )  || (this.rows && Object.keys(this.rows).length > 0 ) ){return false;}else{return true;}
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
      },
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
        console.log('declanche la methode parent by template input_submit');
        this.$emit('ev_saveform');
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
      id_html:{type: String,default: "edit-inputtypetext"}
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
              }
              // Start the reader job - read file as a data url (base64 format)
              readerfile.readAsDataURL(input.files[0]);
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
      //name:[Object, Array],
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
            if(data && data.infos && data.infos.label){
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
////component
  /// textarea_html
  Vue.component('input_textarea_html',{
    delimiters: ['${', '}'],
    props: {
      label:{type: String,default: "input type text"},
      id_html:{type: String,default: "edit-inputtypetext"},
      name:[Object, Array],
    },
    template: '#form-template-textarea-html',
    data : function () {
      return {
      }
    },
  });
  
  /// textarea_html
  Vue.component('input_textarea_string',{
    delimiters: ['${', '}'],
    props: {
      label:{type: String,default: "input type text"},
      id_html:{type: String,default: "edit-inputtypetext"},
      name:[Object, Array],
    },
    template: '#form-template-textarea-string',
    data : function () {
      return {
      }
    },
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
            return {label:'enregistre', callback:'ev_saveform', classe:'btn-outline-success'};
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
        console.log(' Déclenche le parent Niveau superieur : '+this.submit.callback);
        this.$emit(this.submit.callback);
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
        template: ` <component v-bind:is="template_input" class="form-group" :field="renderfield" :model="model"  @ev_saveimage="saveImage" :label="renderfield.label" :name="model[renderfield.model]" :id_html="build_id_html"></component>
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
                console.log(' Template is define ok : '+component_name);
                return component_name;
              }else{
                console.log(' Template not define Error : '+component_name);
              }              
            },
          },
          build_id_html: {
            get: function(){ 
              return 'edit-'+this.renderfield.model;
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
          callback:'ev_saveform',
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
      // save textarea
      else if(valeur.format && valeur.format != "" || valeur.processed){
        node[index]=[{
            value:  valeur.processed,
            format: valeur.format,
        }];
      }
      // save reference entity
      else if(valeur.label_node == "" || valeur.label_node){
        if(valeur.target_ids  && valeur.target_ids.length > 0){
          node[index]=[{
            target_id:  valeur.target_ids,
            target_type: valeur.target_type,
          }];
        }else{
          node[index]="";
        }
        
      }
      else {
        node[index]=valeur;
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
    
    var fields = new Array(); var model = {}; var configs = defaultFieldNotDisplay();
    $.each( data, function( key, value ) {
      //put filed config
      if(configs[value.name]){
        configs[value.name]=value;
      }
      else if(value.type == "string"){
        fields.push({
            type: "input",
            inputType: "text",
            label: value.label,
            model: value.name,
            settings:value.settings,
        });
        model[value.name]={
            value:'',  
        };
      }
      else if(value.type == "boolean" ){
        model[value.name]={
          value:'',  
        };
        if(value.defaults[0]){
          if(value.defaults[0].value){
            model[value.name]={
                value:true,
            };
          }else{
            model[value.name]={
                value:false,
            };
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
      else if(value.type == "list_string"){ 
        model[value.name]='';
        fields.push({
          type: "select",
          label: value.label,
          model: value.name,
          values: value.settings.allowed_values,
          settings:value.settings,
        });
      }
      else if(value.type == "entity_reference"){
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
      	else if(value.settings.target_type == "node"){
      	  model[value.name]={
              target_ids:[],
              label_node:'',
              target_type: "node",
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
      else if(value.type == "image"){
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
      else if(value.type == "text_long"){
        fields.push({
          type: "textarea_html",
          inputType: "text_long",
          label: value.label,
          model: value.name,
          settings:value.settings,
      });
        model[value.name]={
            value:'',  // valeur filtrer
            format:"full_html",  // format
          };
    }
    else if(value.type == "string_long"){
        fields.push({
          type: "textarea_string",
          inputType: "string_long",
          label: value.label,
          model: value.name,
          settings:value.settings,
      });
        model[value.name]={
            value:'',  
        };
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
      'revision_log':true,
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