<template>
  <div>
    <div id="div1" style="margin-top:10%;margin-left:10%;width: 30px;height: 30px;background: gray"></div>

    <div id="div2" style="margin-top:30%;margin-left:40%;width: 100px;height: 100px;background: blue"></div>
  </div>

</template>

<script>

export default {
  props: {

  },
  data() {
    return {

    }
  },
  created(){

  },
  mounted() {
    let div1 = document.getElementById("div1");
    div1.onmousedown = function(){
      console.log("div1",div1);
    }



    /**
    document.onmouseup = function(){
      //oDiv.style.display = "none";
      a = 0;
    }

    document.onmousedown = function(){
      a = 1
    }

    window.onmousemove = function(ev) {
      if(a===1){
        var ev = ev || window.event;
        var ofLeft = document.documentElement.offsetLeft || document.body.offsetLeft;
        var ofTop = document.documentElement.offsetTop || document.body.offsetTop;
        var oLeft = ev.clientX + ofLeft;
        var oTop = ev.clientY + ofTop;
        oDiv.style.display = "block";
        oDiv.style.left = oLeft + "px";
        oDiv.style.top = oTop +　"px";
      }

    }
     */

  },
  methods: {

  }

}
</script>

<style scoped>

</style>

