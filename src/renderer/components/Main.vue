<template>
  <div id="main">
    <!-- <div id="text" class="split split-horizontal text" @mouseover="mainProc"  @mouseleave="hideSeg" @click="showRec"> -->
    <div id="text"  class="split split-horizontal text" @mouseover="mainProc"  @click="showRec" >
       <!-- @mouseleave="cleanUp" -->

      <!-- <p>== Main ==</p> -->
      <!-- <router-link to="/section" class="link">Go to Section</router-link> -->
      <!-- <router-link to="/title" class="link">Go to Title</router-link> -->

    </div>

    <div id="results" class="split split-horizontal">
      <ambis-popup :clean="clean"></ambis-popup>
      <recursive-popup :clean="clean"></recursive-popup>
      <dicts></dicts>
      <hanzi></hanzi>
    </div>

  </div>
</template>

<script src='./main-vue'>
</script>

<style src="./main-vue.css">
/* CSS */
.link {
    cursor: pointer;
}
</style>
