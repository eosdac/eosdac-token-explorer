<template>
<q-page >

  <div v-if="!isvalidtxid && !isloading" style="border:1px solid #491289;background-color:#1E2128;margin-top:40px;text-align:center;padding:20px" class="rounded">
    <div style="margin-bottom:20px">This transaction id is not related to eosDAC</div>
    <q-btn
      color="brand"
      @click="$router.push('/transfers')"
      label="Go Home"
    />
  </div>

<div v-if="isvalidtxid && !isloading" class="animate-pop">


<div class="overflow-hidden">
    <div class="row q-mt-sm gutter-sm" style="margin-bottom:20px;">
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class=" rounded shadow-5" style="max-height:60px; background: #F8840C;">
          <div class="row">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-01"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{type.toUpperCase()}}</p>
              <span class="q-subheading">Type</span>
            </div>
            <div class="col-xs-5 relative-position  ">
<!--               <div style="font-size:14px;margin-top:12px; padding-right:10px" class="text-right" :class="{'text-negative q-mb-none q-mt-lg': change24 < 0, 'text-positive q-mb-none q-mt-lg': change24 > 0}">{{change24}}% (24h)</div> -->
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">Transaction</p>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3 ">
              <!-- <img src="~assets/Eosio_logo.svg" style="width:40px; margin-top:7px;margin-left:10px"> -->
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-02"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{trxdata.from}}</p>
              <span class="q-subheading">From</span>
            </div>
            <div class="col-xs-5 relative-position">
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">Account</p>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-02"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{trxdata.to}}</p>
              <span class="q-subheading">To</span>
            </div>
            <div class="col-xs-5 relative-position">

              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">Account</p>
            </div>

          </div>
        </div>
      </div>

      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div class="bg-primary rounded shadow-5" style="height:60px;">
          <div class="row fit">
            <div class="col-xs-3">
              <q-icon class="q-ma-sm text-mywhite2" style="font-size:45px;" name="icon-item-03"></q-icon>
            </div>
            <div class="col-xs-4 text-left">
              <p class="q-mb-none q-mt-sm q-headline text-weight-light text-white big" style="line-height:24px;">{{trxdata.quantity.slice(0,-7)}}</p>
              <span class="q-subheading">EOSDAC</span>
            </div>
            <div class="col-xs-5 relative-position">
              <p class="small q-mb-xs absolute" style="bottom:0;right:10px;">Amount</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <!-- end row -->

  <q-tabs color="brand" >
    <q-tab default  slot="title"  name="tab-1" label="DETAILS" />
    <q-tab  slot="title"  name="tab-2" label="RAW TRANSACTION" />

    <q-tab-pane name="tab-1" class="shadow-5">

      <div style="overflow:hidden;color:white"><span class="text-mywhite">Txid:</span> {{trxid}}</div>
      <div class="row q-mt-sm gutter-sm" style="margin-bottom:20px;">
        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div  style="">

            <q-table
            :pagination="{rowsPerPage: 0}"
              ref="table"
              color="brand"
              hide-header
              hide-bottom
              separator="horizontal"
              dark
              :data="tabledata"
              :columns="columns"
            >
              <q-td slot="body-cell-dataval" slot-scope="props" :props="props">
                <router-link v-if="props.row.datakey=='from' || props.row.datakey=='to' " :to="{path: '/account/'+props.value}" >{{ props.value }}</router-link>
                <span v-else>{{props.value}}</span>
              </q-td>
              <q-td slot="body-cell-datakey" slot-scope="props" :props="props" class="text-mywhite">
                <span>{{props.value.charAt(0).toUpperCase()+ props.value.slice(1)}}:</span>
              </q-td>
            </q-table>

          </div>
        </div>

        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div class="rounded" style="height:100%; background: #2F333C;padding:10px">
            <p class="q-headline text-weight-light text-white big" style="line-height:24px;">MEMO / INFO:</p>
            <p>{{memo_info}}</p>
          </div>
        </div>
        
      </div>

    </q-tab-pane>

    <q-tab-pane name="tab-2" class="shadow-5">
      <q-scroll-area 
          style="height: 400px; padding:20px; font-size:13px"
          class="bg-mydark"
          :delay="10000"
          :thumb-style="{
              right: '0px',
              borderRadius: '2px',
              background:'#491289' ,
              width: '15px',
              opacity: 1
          }"
        >
          <div v-html="rawtx" class="json-pretty bg-primary"></div>
      </q-scroll-area>     

    </q-tab-pane>
  </q-tabs>



  </div>

</q-page >
</template>

<style>
td{
  border-top:1px solid blue;
}
.json-pretty {
    
}
.json-selected {
    background-color: rgba(139, 191, 228, 0.19999999999999996);
}

.json-string {
    color: #6caedd;
}

.json-key {
    color: #ec5f67;
}

.json-boolean {
    color: #99c794;
}

.json-number {
    color: #99c794;
}

</style>

<script>

const prettyHtml = require('json-pretty-html').default;

export default {
  data () {
    return {
      isloading: true,
      isvalidtxid:false,
      trxid: this.$route.params.transactionid,
      type:'',
      trxdata:'',
      rawtx:'dddddd',
      memo_info:'',
      columns: [
        { name: 'datakey', label: '', field: 'datakey', align:'left'},
        { name: 'dataval', label: '', field: 'dataval', align:'left'}

      ],
      tabledata:[]

    }
  },
  
  methods:{
  	getTransaction: function(){
      this.isloading=true;
  		this.$eos.getTransaction(this.$route.params.transactionid).then(tx =>{
  			// console.log(tx)
  			if(tx.traces[0]){
  				this.isvalidtxid=true
  			}
        else{
  				return false
  			}
        console.log(tx)
  			this.rawtx = prettyHtml(tx);
  			this.type= tx.traces[0].act.name;
  			this.trxdata = tx.traces[0].act.data;
        this.memo_info = this.trxdata.memo;
        delete this.trxdata.memo;

        let temp = [];
        for(var key in this.trxdata) {
            if(this.trxdata.hasOwnProperty(key)) {
                temp.push({datakey:`${key}`, dataval: this.trxdata[key]});
            }
        }
        let blocktime=new Date(tx.block_time);
        // temp.push({datakey:`blocktime`, dataval: new Date(tx.block_time).toString() });
        temp.push({datakey:`Date`, dataval: blocktime.toDateString() });
        temp.push({datakey:`Time`, dataval: blocktime.getHours()+':'+('0'+blocktime.getMinutes()).slice(-2)+':'+blocktime.getSeconds()});
        temp.push({datakey:`blocknumber`, dataval: tx.block_num });
        console.log(temp)
        this.tabledata = temp;
        this.isloading=false;
  			
  		})
      .catch(e =>{
        this.isloading=false;
        this.$q.notify({message:'Error getting TX from node.', color:'negative'});

      });
  	}

  },

  mounted: function(){
  	this.getTransaction();
  }
   
}
</script>