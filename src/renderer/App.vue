<template>
  <div id="app">
    <span class="clause"><span class="seg">seg11</span><span class="seg">seg12</span></span>
    <span class="space"><span class="space"> </span></span>
    <span class="clause"><span class="seg">seg21</span><span class="seg">seg22</span></span>
    <ambis-popup></ambis-popup>
    <recursive-popup></recursive-popup>
  </div>
</template>

<script>
  import AmbisPopup from '@/components/AmbisPopup'
import RecursivePopup from '@/components/RecursivePopup'
  export default {
    name: 'electron-vue',
    components: {
      AmbisPopup,
      RecursivePopup
    }
  }
</script>

<style>
  /* CSS */
</style>
