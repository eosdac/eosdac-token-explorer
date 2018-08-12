<template>
<div>
  <q-layout view="hhr LpR lff">
    <q-layout-header reveal v-if="!$q.platform.within.iframe">
      <q-toolbar color="primary" >
        <div class="absolute-center row justify-between items-center pagewidth">

          <router-link :to="{path: '/transfers/'}" class="text-mywhite">
            <span>
            <img id="logo" src="~assets/icon-signet-eosdac-BETA-explorer-225x48.svg" style="height:48px">
          </span>
          </router-link>

          
          <div id="top_search" style="display:inline-block;" >
            <mysearch></mysearch>
          </div>
          <!-- <LangSelector/> -->
        </div>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <q-page  style="margin:0 auto;margin-bottom:50px; box-sizing: border-box;" class="pagewidth">
        <div>
          <router-view />
        </div>
      </q-page>
    </q-page-container>

    <q-layout-footer reveal v-if="!$q.platform.within.iframe">
      <q-toolbar color="primary">
        <div class="absolute-center pagewidth">
          <img id="logo" src="~assets/icon-footer-eosdac-explorer-165x48.svg" style="height:40px">
        </div>
      </q-toolbar>
    </q-layout-footer>

    <q-btn
      v-back-to-top.animate="{offset: 500, duration: 200}"
      round
      color="brand"
      class="fixed-bottom-right animate-pop"
      style="margin: 0 20px 15px 0; z-index:9999"
    >
      <q-icon name="keyboard_arrow_up" />
    </q-btn>
    
  </q-layout>


     <q-modal v-model="isNotSynced"  minimized ref="modalRef" :content-css="{maxWidth: '40vw', borderRadius:'5px'}" >
      <div style="padding: 20px; border:1px solid #491289" class="bg-primary rounded">
        <div class="row justify-center q-mb-sm">
          <q-spinner-gears color="brand" class="center" :size="100" />  
        </div>

        <p v-html="$t('error_node_not_synced')"></p>
        <q-btn color="brand" @click="isNotSynced=false" label="OK" />
      </div>
</q-modal> 
</div>






</template>

<script>
import mysearch from '../components/search';
import LangSelector from 'components/lang-selector';
// import { Quasar } from 'quasar';

export default {
  name: 'LayoutDefault',
  components:{
    mysearch,
    LangSelector
  },
  data () {
    return {
      isNotSynced:false,

    }
  },

  methods: {

    async checkIfNodeSynced(){

      let test_node = 'https://eu.eosdac.io/v1/chain/get_info';
      let explorer_node = `${this.$store.state.app.explorer_config.settings.httpendpoint_node}/v1/chain/get_info`;

      //get headblock of external node
      let res_test = await this.getHeadBlock(test_node);
      //wait 600ms
      await new Promise(done => setTimeout(done, 800));
      //get headblock of explorer node
      let res_explorer = await this.getHeadBlock(explorer_node);

      if(res_test != null){//if test node is live

        if(res_test >= res_explorer){
          //show warning notification
          this.isNotSynced = true;
          // this.$q.notify({
          //   message:this.$t('error_node_not_synced'), 
          //   color:'warning', 
          //   timeout: 0, 
          //   textColor: 'black', 
          //   icon:'warning',
          //   actions: [ { label: 'Close' } ]
          // });
        }
        else{
          this.isNotSynced = false;
        }

      }      
    },

    getHeadBlock(url){
      return this.$axios(url).then(res => {
        if(res.data.head_block_num != undefined){
          console.log(res.data.head_block_num);
          return res.data.head_block_num;
        }
        else{
          return null;
        }
      }).catch(e => {console.log(e); return null});
    }

  },
  mounted(){
    this.$i18n.locale = this.$q.i18n.getLocale();

  },
  created: function() {
    var self = this;
    this.checkIfNodeSynced();


    // setInterval(function() {
    //   self.getPrice();
    //   self.getEosDacStats();
    // }, 10000);
    // this.getEosDacStats();
  },
}
</script>