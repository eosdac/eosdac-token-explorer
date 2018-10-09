<template>
<q-page>

  <div class="overflow-hidden">
    <div class="row q-mt-sm gutter-sm" style="margin-bottom:20px;">
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="max-height:60px;">
          <div class="row">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-03"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{eosdacprice.toFixed(4)}}</p>
              <span class="q-subheading">USD</span>
            </div>
            <div class="col-xs-5 relative-position  ">
              <div style="font-size:14px;margin-top:12px; padding-right:10px" class="text-right" :class="{'text-negative q-mb-none q-mt-lg': change24 < 0, 'text-positive q-mb-none q-mt-lg': change24 > 0}">{{change24}}% (24h)</div>
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">
                <a class="text-mywhite" target="_blank" href="https://coinmarketcap.com/currencies/eosdac/">source coinmarketcap</a>
              </p>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-9"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{circulatingcount}}</p>
              <span class="q-subheading">EOSDAC</span>
            </div>
            <div class="col-xs-5 relative-position">
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">{{$t('circulating_supply')}}</p>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-8"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{membercount}}</p>
              <span class="q-subheading">{{$t('members')}}</span>
            </div>
            <div class="col-xs-5 relative-position">

              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;"></p>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-05"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{hodlercount}}</p>
              <span class="q-subheading">{{$t('holders')}}</span>
            </div>
            <div class="col-xs-5 relative-position">
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">{{$t('token_holders')}}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <!-- end row -->

  <q-tabs color="brand">
    <q-route-tab default slot="title" to="/transfers" :label="$t('TRANSFERS')" />
    <q-route-tab slot="title" to="/holders" :label="$t('HOLDERS')" />
    <!--   <q-tab slot="title" name="tab-3" label="MEMBERS"/>
    <q-tab slot="title" name="tab-4" label="VOTES" /> -->

    <div style="min-height:500px" > <!-- <div style="background:#1E2128;">  -->
      <router-view  />
    </div>
    <!-- </q-tab-pane> -->
  </q-tabs>
  <br>
  <tokenactivity :urlprop="`${this.$store.state.app.explorer_config.settings.base_api_url}?chart=tokenactivity`"></tokenactivity>
</q-page>
</template>

<script>
import tokenactivity from '../components/tokenactivitychart'
export default {
    components :{
        tokenactivity
    },
  data() {
    // new Intl.NumberFormat().format(circulatingcount)
    return {
      eosdacprice: 0,
      change24: 0,
      circulatingcount: 0,
      hodlercount: 0,
      membercount: 0,
      isfocus: true
    }
  },

  methods: {
    getPrice: function() {
      if(!this.isfocus){return false}
      this.$axios.get(`${this.$store.state.app.explorer_config.settings.cmc_token_ticker_url}`)
        .then(response => {
          this.change24 = response.data.data.quotes.USD.percent_change_24h;
          this.eosdacprice = response.data.data.quotes.USD.price;
        })
        .catch(e => {
          this.$q.notify({message:this.$t('error_cmc_request'), color:'negative'});
        })
    },

    getEosDacStats: function() {
      if(!this.isfocus){return false}
      this.$axios.get(`${this.$store.state.app.explorer_config.settings.base_api_url}?get=tokenstats`)
        .then(response => {
          // console.log(response.data[0].tot_bal_db)
          this.hodlercount = response.data[0].tot_hodlers;
          this.circulatingcount = response.data[0].tot_bal_db;
        })
        .catch(e => {
          this.$q.notify({message:this.$t('error_server_stats'), color:'negative'});
        })
    },

    async getMemberCount(){
        let lb='';
        let temp = [];

        while(lb !== null){
          let c = await this.getMembers(lb);
          if(c){
              if(lb === c[c.length-1].sender){
                lb = null;
              }
              else{
                if(lb != ''){
                  //remove first entry except for the first run
                  c.shift(); 
                }
                //set lower_bound to the last received candidate_name
                lb = c[c.length-1].sender; 
                temp.push(...c);
              }
          }
        }
        let real_members = temp;
        this.membercount = real_members.length;
    },
    getMembers(lb=''){
        return this.$eos.getTableRows({
            "json":"true",
            "scope":"eosdactokens",
            "code":"eosdactokens",
            "table":"members",
            "lower_bound":lb,
            "upper_bound":"",
            "limit":0,
            "key_type":"",
            "index_position":""
        }).then(res => res.rows).catch(e => {console.log(e); return false;})
    }

  },

  created: function() {
    var self = this;
    this.getPrice();
    this.getEosDacStats();
    this.getMemberCount();

    setInterval(function() {
      self.getPrice();
      self.getEosDacStats();
    }, 30000);
    // this.getEosDacStats();
    
  },

  watch: {
    '$q.appVisible' (val) {
      this.isfocus = val;
    }
  }

}
</script>
