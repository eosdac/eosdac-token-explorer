<template>
<div>
  <div class="shadow-5">
  <q-table
    style="background:#1E2128"
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
    <q-td slot="body-cell-account" slot-scope="props" :props="props">
      <router-link :to="{path: '/account/' + props.value}" >{{ props.value }}</router-link>
    </q-td>

    <q-td slot="body-cell-balance" slot-scope="props" :props="props">
      {{ props.value }}
    </q-td>

    <q-td slot="body-cell-is_member" slot-scope="props" :props="props">
      <span v-if="props.value == 1">Yes</span>
      <span v-if="props.value == 0">No</span>
    </q-td>

    <q-td slot="body-cell-has_voted" slot-scope="props" :props="props" :style="{width:'80%'}">
      <span v-if="props.value == 1">Yes</span>
      <span v-if="props.value == 0">No</span>
    </q-td>

    <template slot="top-right" slot-scope="props">
      <q-search hide-underline v-model.trim="filter" />
      <q-btn
        flat round dense color="brand"
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
      />
    </template>

    <template slot="top-left" slot-scope="props">
      <div class="q-table-title" style="margin-right:20px">{{title}}</div>
      <q-btn color="positive" dense size="xs" @click="opened = true" :label="$t('top_100_chart')" />
    
    </template>
  </q-table>
  </div>
      

    <q-modal v-model="opened" maximized content-css="background:#2F333E;width:100%!important">

       <q-btn color="brand" round @click="opened = false" icon="icon-basic-01" style="position:absolute;z-index:99999;top:10px;right:10px"/>
       <test></test>

    </q-modal>

  
</div>
</template>

<script>
import Chart from 'chart.js';
import test from '../components/hodlerchart'


export default {
  components:{test},
  data () {
    return {
      opened:false,
      filter: '',
      loading: false,
      serverPagination: {
        page: 1,
        rowsPerPage: this.$store.state.app.rowsPerPage,
        rowsNumber: 1, // specifying this determines pagination is server-side
      },

      serverData: [],
      title:'Holders',
      columns: [
        { name: 'rank', label: '', field: 'rank', align: 'center', ignoreapi:true},
        { name: 'account', label: this.$t('account'), field: 'account', align: 'center', searchable:true},
        { name: 'balance', label: 'EOSDAC', field: 'balance' , align: 'left'},
        { name: 'is_member', label: 'Is Member?', field: 'is_member' , align: 'center'},
        { name: 'has_voted', label: 'Has Voted?', field: 'has_voted' , align: 'center'}
      ]
    }
  },

  methods: {
    request (props) {

      this.loading = true

      this.$axios
      .get(this.$tableApi.adapt('hodlers',1, this.columns, props) )
      .then(({ data }) => {

        this.serverPagination = props.pagination;
        let table = this.$refs.table;
        let rows = data.data;
        let { page, rowsPerPage, sortBy, descending } = props.pagination;

        if (props.filter) {
          rows = table.filterMethod(rows, props.filter);
        }
        if (sortBy) {
          rows = table.sortMethod(rows, sortBy, descending);
        }
        this.serverPagination.rowsNumber = data.recordsTotal == data.recordsFiltered ? data.recordsTotal : data.recordsFiltered;

        this.serverData = rows;
        this.loading = false;

        this.$store.commit('app/setRowsPerPage', props.pagination.rowsPerPage);
      })
      .catch(error => {
        this.loading = false;
        this.$q.notify({message:this.$t('error_server_table'), color:'negative'});
      })
    },


  },
  mounted () {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  }
}
</script>