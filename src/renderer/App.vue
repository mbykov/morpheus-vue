<template>
  <div id="app">
       <div id="text" class="split split-horizontal text">
         <span class="clause"><span class="seg">seg11</span><span class="seg">seg12</span></span>
         <span class="space"><span class="space"> </span></span>
         <span class="clause"><span class="seg">seg21</span><span class="seg">seg22</span></span>
         <ambis-popup></ambis-popup>
         <recursive-popup></recursive-popup>
       </div>

       <div id="results" class="split split-horizontal">
         <div id="dicts-list">=dicts-list=</div>
         <div id="dicts">=dicts-results=</div>
       </div>

  </div>
</template>

<script src="./app-vue.js">
</script>

<style src="./app-vue.css">
</style>
