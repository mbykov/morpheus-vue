<template>
  <div id="app">
     <!-- @scroll="onWheel" -->
     <div id="text" class="split split-horizontal text" @mouseover="showDict"  @mouseleave="hideSeg" @click="showRec">
       <img :src="msrc">

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
