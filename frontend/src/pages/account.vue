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
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{eosdacbalance}}</p>
              <span class="q-subheading">EOSDAC</span>
            </div>
            <div class="col-xs-5 relative-position  ">
<!--               <div style="font-size:14px;margin-top:12px; padding-right:10px" class="text-right" :class="{'text-negative q-mb-none q-mt-lg': change24 < 0, 'text-positive q-mb-none q-mt-lg': change24 > 0}">{{change24}}% (24h)</div> -->
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">{{ $t('balance') }}</p>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3 ">
              <!-- <img src="~assets/Eosio_logo.svg" style="width:40px; margin-top:7px;margin-left:10px"> -->
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-04"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{eosbalance}}</p>
              <span class="q-subheading">EOS</span>
            </div>
            <div class="col-xs-5 relative-position">
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">{{ $t('liquid_balance') }}</p>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-06"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{votes}}</p>
              <span class="q-subheading">{{ $t('VOTES') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2"  style="font-size:45px;" name="icon-item-8"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">
                <span v-if="ismember" class="text-positive">YES <span  class="q-caption"> v{{ismember}}</span></span>
                <span v-if="!ismember" class="text-negative">NO</span>
              </p>
              <span class="q-subheading">{{ $t('MEMBER') }}</span>
            </div>
            <div class="col-xs-5 relative-position">
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">{{ $t('status') }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <!-- end row -->

  <q-tabs color="brand" >
    <q-tab default @click="displayTransfers"  slot="title"   :label="$t('TRANSFERS')" />
    <!-- <q-tab slot="title"     label="VOTES" /> -->
  </q-tabs>

  <div class="bg-mydark shadow-5" >
  <q-table
    ref="table"
    color="brand"
    dark
    
    :rows-per-page-options=[3,5,7,10,20,50,100]
    :title="title"
    :data="serverData"
    :columns="columns"
    :filter="filter"
    row-key="name"
    :pagination.sync="serverPagination"
    :loading="loading"
    @request="request"
  >


  <q-td slot="body-cell-direction" slot-scope="props" :props="props">
    <div class="label_out label_in_out" v-if="title == props.row._from">OUT</div>
    <div class="label_in label_in_out" v-if="title == props.row._to">IN</div>
  </q-td>

  <q-td slot="body-cell-_memo"  slot-scope="props" :props="props">
    <span style="font-weight:lighter; width:200px;display:inline-block; overflow:hidden">{{decodeURIComponent(props.value)}}</span>
  </q-td>

  <q-td slot="body-cell-_from" slot-scope="props" :props="props">
    <router-link  v-if="title != props.value" :to="{path: '/account/'+props.value}" >{{ props.value }}</router-link>
    <span v-else>{{props.value}}</span>
  </q-td>

  <q-td slot="body-cell-_to" slot-scope="props" :props="props">
    <router-link v-if="title != props.value" :to="{path: '/account/'+props.value}" >{{ props.value }}</router-link>
    <span v-else>{{props.value}}</span>
  </q-td>

  <q-td slot="body-cell-txid" slot-scope="props" :props="props">
    <router-link :to="{path: '/transaction/' + props.value}" >{{ props.value.slice(0,10)+'...' }}</router-link>
  </q-td>


    <template slot="top-right" slot-scope="props">
      <q-search hide-underline v-model.trim="filter"/>
      <q-btn
        flat round dense color="brand"
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
      />
    </template>

  </q-table>
  </div>
  <br>
  <!-- <tokenactivity :urlprop="'http://51.38.42.79/explorer/explorer_api.php?chart=tokenactivity&account='+title"></tokenactivity> -->
  
</q-page>
</template>


<style lang="stylus">
@import '~variables'



.label_in_out{
    border-radius:5px;
    display:inline-block;
    width:30px;
    text-align:center;
    padding:1px 0px 1px 0px;
    font-size:12px;
    color:black
}
.label_in{
    background: #21BA45;

}
.label_out{
    background: #F2C037;
}
</style>



<script>
import tokenactivity from '../components/tokenactivitychart'
const moment = require('moment');

var IntlRelativeFormat = require('intl-relativeformat');
if (!global.Intl) {
    global.Intl = require('intl'); // polyfill for `Intl`
}
var rf = new IntlRelativeFormat('en');

export default {
  components:{
    tokenactivity
  },
  data () {
    return {
      ismember: false,
      eosdacbalance:0,
      eosbalance:0,
      votes:0,
      filter: '',
      loading: false,
      serverPagination: {
        page: 1,
        rowsPerPage: this.$store.state.app.rowsPerPage,
        rowsNumber: 10 // specifying this determines pagination is server-side
      },

      serverData: [],
      title: this.$route.params.accountname,
      columns: [
        { name: 'account_action_seq', label: 'Seq', field: 'account_action_seq', align:'left'},
        { name: '_from', label: this.$t('from'), field: '_from', align:'right', searchable:true },
        { name: 'direction', label: '', field: '', align:'center', ignoreapi:true },
        { name: '_to', label: this.$t('to'), field: '_to', align:'right', searchable:true },
        { name: '_quantity', label: this.$t('quantity'), field: '_quantity', align:'right' },
        { name: '_symbol', label: this.$t('symbol'), field: '_symbol', align:'right' },
        { name: '_memo', label: this.$t('memo'), field: '_memo', align:'right' },
        { name: 'block_time', label: this.$t('block_time'), field: 'block_time', align:'right', format: val => rf.format( new Date(moment.utc(val).format() ) ) },
        { name: 'txid', label: 'Txid', field: 'txid', align:'left'}
      ]
    }
  },
  
  methods: {
    displayTransfers (e){
        console.log('display transfer function')

    },

    getVotes(){
      this.$eos.getTableRows({json: "true", scope: "daccustodian", code: "daccustodian", table: "votes", lower_bound: this.title, limit:1}).then(res =>{
        if(!res.rows.length){
          this.votes = 0;
          return false;
        }
        else{
          if (res.rows[0].voter === this.title){
              this.votes = res.rows[0].candidates.length;
          }
          else{
            this.votes = 0;
          }
        }
      }).catch(e => {
          this.$q.notify({message:this.$t('error_node_member'), color:'negative'});
      })
    },
    getBalances(){
      this.$eos.getCurrencyBalance({account: this.title, code: "eosdactokens", symbol: "EOSDAC"}).then(x=>{
          if(x.length !=0){
            this.eosdacbalance = x[0].slice(0,-7);
          }
          else{
            this.eosdacbalance = 0;
          }
      }).catch(e => { 
          this.$q.notify({message: this.$t('error_node_balance'), color:'negative'});
      });

      this.$eos.getCurrencyBalance({account: this.title, code: "eosio.token", symbol: "EOS"}).then(x=>{
        if(x.length !=0){
          this.eosbalance = x[0].slice(0,-4);
        }
        else{
          this.eosbalance = 0;
        }
      }).catch(e => { 
          this.$q.notify({message:this.$t('error_node_balance'), color:'negative'});
      });
    },
    getMemberStatus(){
      this.$eos.getTableRows({json: "true", scope: "eosdactokens", code: "eosdactokens", table: "members", lower_bound: this.title, limit:1}).then(res =>{
        if(!res.rows.length){
          this.ismember = false;
          return false;
        }
        else{
          if (res.rows[0].sender === this.title){
              this.ismember = res.rows[0].agreedtermsversion;
          }
          else{
            this.ismember = false;
          }
        }
      }).catch(e => {
          this.$q.notify({message:this.$t('error_node_member'), color:'negative'});
      })

    },

    request (props) {
      this.loading = true
      this.$axios
      .get(this.$tableApi.adapt('accounttransfers',0, this.columns, props)+`&account=${this.title}`)
      .then(({ data }) => {
        this.serverPagination = props.pagination
        let table = this.$refs.table
        let rows = data.data
        let { page, rowsPerPage, sortBy, descending } = props.pagination

        if (props.filter) {
          rows = table.filterMethod(rows, props.filter)
        }
        if (sortBy) {
          rows = table.sortMethod(rows, sortBy, descending)
        }
        this.serverPagination.rowsNumber = data.recordsTotal == data.recordsFiltered ? data.recordsTotal : data.recordsFiltered
        this.serverData = rows
        this.loading = false
        this.$store.commit('app/setRowsPerPage', props.pagination.rowsPerPage);
      })
      .catch(error => {
        this.loading = false;
        this.$q.notify({message:this.$t('error_server_table'), color:'negative'});
      })
    }
  },

  mounted () {
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    });
    this.getBalances();
    this.getMemberStatus();
    this.getVotes();
  },

watch: {
 '$route': function(){
            this.title = this.$route.params.accountname
            this.request({
                pagination: this.serverPagination,
                filter: this.filter
            });
            this.getBalances();
            this.getMemberStatus();
            this.getVotes();
          }
},

}
</script>
