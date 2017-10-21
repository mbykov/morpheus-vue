<template>
  <div id="app">
       <div id="text" class="split split-horizontal text" @mouseover.prevent="showSeg"  @mouseleave.prevent="hideSeg">
         <!-- <span class="clause">KKK <span class="seg">seg11</span><span class="seg">seg12</span></span> -->
         <!-- <span class="space"><span class="space"> </span></span> -->
         <!-- <span class="clause"><span class="seg">seg21</span><span class="seg">seg22</span></span> -->
         case 民事案件 mínshì ànjiàn civil case / 刑事案件 xíngshì ànjiàn c
         <br>
         陀洹道,xū tuó huá
       </div>

       <div id="results" class="split split-horizontal">
         <ambis-popup v-show="showAmbis"></ambis-popup>
         <recursive-popup v-show="showRec"></recursive-popup>
         <dicts :dict="odict" v-show="showDict"></dicts>
       </div>


  </div>
</template>

<script src="./app-vue.js">
</script>

<style src="./app-vue.css">
</style>
