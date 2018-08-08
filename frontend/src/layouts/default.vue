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
</div>
</template>

<script>
import mysearch from '../components/search'
export default {
  name: 'LayoutDefault',
  components:{
    mysearch
  },
  data () {
    return {

    }
  },

  methods: {

  },
  mounted :function(){

  }
}
</script>