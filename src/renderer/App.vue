<template>
  <div id="app">
       <div id="text" class="split split-horizontal text" @mouseover.prevent="showSeg"  @mouseleave.prevent="hideSeg" @click="showRec">
         <!-- <span class="clause">KKK <span class="seg">seg11</span><span class="seg">seg12</span></span> -->
         <!-- <span class="space"><span class="space"> </span></span> -->
         <!-- <span class="clause"><span class="seg">seg21</span><span class="seg">seg22</span></span> -->
         <p>我们一块儿 blabla 去吃中饭吧 blabla </p>
         <p>民事案件 mínshì  / 刑事案件 xíngshì ànjiàn</p>
         <p>陀洹道,xū tuó huá</p>
       </div>

       <div id="results" class="split split-horizontal">
         <ambis-popup v-show="showAmbis"></ambis-popup>
         <recursive-popup v-show="recsegs" :segs="recsegs" :coords="reccoords"></recursive-popup>
         <dicts :dict="odict"></dicts>
         <!-- v-show="showDict" -->
       </div>
  </div>
</template>

<script src="./app-vue.js">
</script>

<style src="./app-vue.css">
</style>
