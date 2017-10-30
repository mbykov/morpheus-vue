<template>
  <div id="app">
       <div id="text" class="split split-horizontal text" @mouseover="showDict"  @mouseleave="hideSeg" @click="showRec">
         <p>我们一块儿 blabla 去吃中饭吧 blabla </p>
         <p>民事案件 mínshì  刑事案件 xíngshì ànjiàn</p>
         <p>陀洹道,xū tuó huá</p>
         <p>ambi: 我们现在没有钱。</p>
         <p>ambi: 想法國。</p>
         <p>ambi: 研究生命。</p>
       </div>

       <div id="results" class="split split-horizontal">
         <ambis-popup v-show="ambis"></ambis-popup>
         <recursive-popup v-show="recsegs"></recursive-popup>
         <!-- <transition> -->
         <dicts :odict="odict"></dicts>
         <hanzi :ohanzi="ohanzi"></hanzi>
         <!-- </transition> -->
       </div>
  </div>
</template>

<script src="./app-vue.js">
</script>

<style src="./app-vue.css">
</style>
