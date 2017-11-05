<template>
  <div id="app" @click="externaLink">
     <!-- @scroll="onWheel" -->
     <div id="text" class="split split-horizontal text" @mouseover="showDict"  @mouseleave="hideSeg" @click="showRec">
       <img :src="msrc">
       <p>just copy some Chinese text (Ctrl-C) anywhere on a desktop and move mouse over it</p>
       <p>example: 你好</p>
       <p><a class="newslink" @click="showNew">new in this version</a></p>
       </div>

       <div id="results" class="split split-horizontal">
         <ambis-popup v-show="ambis"></ambis-popup>
         <recursive-popup v-show="recsegs"></recursive-popup>
         <!-- <transition> -->
         <dicts :odict="odict" v-show="odict"></dicts>
         <hanzi :ohanzi="ohanzi" v-show="ohanzi"></hanzi>
         <!-- </transition> -->
       </div>
  </div>
</template>

<script src="./app-vue.js">
</script>

<style src="./app-vue.css">
</style>
