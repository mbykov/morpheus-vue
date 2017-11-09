<template>
  <div id="install" class="section">
      <h2><b>Dictionaries</b>:</h2>
      <table width="75%">
        <tr class="bold">
          <td></td><td>name</td><td>lang</td><td>remove</td><td>active</td>
        </tr>
        <tr v-for="info in cfg.infos" @click="toggleDict">
          <td><img :src="chcksrc" class="check" v-show="info.active"></td><td>{{info.name}}</td><td>{{info.lang}}</td><td>b</td><td><input type="checkbox" name="dict" class="active radio-dict"></td>
        </tr>
      </table>

      <p>&nbsp;</p>
      <h2><b>install precompiled</b>:</h2>
      <!-- <p @click="showTl">=== show title===</p> -->
  </div>
</template>

<script src="./install.js">
</script>

<style>
.bold {
    font-weight: bold;
}
.check {
    width: 25px;
}
</style>
