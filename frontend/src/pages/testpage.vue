<template>
  <div>
<br><br><br>
<!-- <display21bps></display21bps> -->
<q-input v-model="form.image" />
{{form.image}}

    <div class="wrapper">
      <transition name="fade">
        <img  :class="fitcontainer"  v-bind:src="form.image" v-on:load="onLoaded" v-show="loaded" ref="profile_pic">
      </transition>
   </div>




</div>
</template>

<style>
.wrapper {
  width: 120px;
  height: 120px;
  background: blue;
  overflow:hidden;
}

.fade-enter-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter {
  opacity: 0;
}
.fitheight{
  height:100%;
}
.fitwidth{
  width:100%;
}
</style>

<script>

import display21bps from '../components/display21bps';

export default {
  components:{
    display21bps
  },
  data () {
    return {
      fitcontainer:'fitheight',
      loaded:false,
      form:{
          "givenName": "kas",
          "familyName": "",
          "gender": "",
          "description": "",
          "email": "",
          "url": "",
          "image": "",
          "sameAs": [],
          "timezone": ""
        }


    }
  },

  
  methods:{
     onLoaded() {
        let img = this.$refs.profile_pic;
        if(img.width < img.height){
          this.fitcontainer = 'fitwidth';
        }

      console.log(img.width +' '+ img.height)
      this.loaded = true;
    }

  },

  mounted: function(){
   }
   
}
</script>