<template>
  <div id="app" @click="externaLink">
     <!-- @scroll="onWheel" -->
     <div id="text" class="split split-horizontal text" @mouseover="mainProc"  @mouseleave="hideSeg" @click="showRec">

       <div v-show="omain" id="main">main el
       </div>

       <div v-show="otitle" id="title">
         <img :src="msrc">
         <p>just copy some Chinese text (Ctrl-C) anywhere on a desktop and move mouse over it</p>
         <p>try, for example, this word: 你好</p>
         <p><a class="newslink" @click="showNew">new in this version</a></p>
         <!-- <p @click="showIn">=== show install===</p> -->
       </div>

       <install v-show="odict"> ===</install>

     </div>

       <div id="results" class="split split-horizontal">
         <ambis-popup v-show="ambis"></ambis-popup>
         <recursive-popup v-show="recsegs"></recursive-popup>
         <!-- <transition> -->
         <!-- <dicts :odict="odict" v-show="odict"></dicts> -->
         <dicts v-show="ores"></dicts>
         <hanzi :ohanzi="ohanzi" v-show="ohanzi"></hanzi>
         <!-- </transition> -->
       </div>
  </div>
</template>

<script src="./app-vue.js">
</script>

<style src="./app-vue.css">
</style>
