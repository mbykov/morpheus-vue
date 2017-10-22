<template>
  <div id="recursive-popup">
    <span class="segs">{{dictsegs}}</span>
  </div>
</template>

<script>
  import {log, q} from '../utils'
  export default {
    name: 'recursive-popup',
    props: ['segs', 'coords'],
    data: function () {
      return {
        dictsegs: null
      }
    },
    watch: {
      segs: function (segs) {
        this.dictsegs = (segs) ? segs.map(seg => { return seg.dict }) : null
        let osegs = q('.segs')
        log('COORDS', this.coords)
        placePopup(this.coords, osegs)
      }
    },
    components: {},
    methods: {
    }
  }

  function placePopup (coords, el) {
    var top = [coords.top, 'px'].join('')
    var left = [coords.left, 'px'].join('')
    el.style.top = top
    el.style.left = left
  }
</script>

<style>
  .segs {
    border: 1px solid rgba(0, 0, 0, 0.2);
    /* background-color: #8aba87; */
    /* color: white; */
    /* line-height: 24px; */
    background-color: white;
    color: black;
    display: 'block';
    padding: 3px;
    position: absolute;
    z-index: 1000;
    box-shadow: 0.15em 0.15em 1em rgba(0, 0, 0, 0.75);
    /* box-shadow: 0 0 10px 1px rgba(0,0,0,.3); */
    height: auto;
    top: 250px;
    left: 300px;
    /* font-family: 'DejaVu Sans'; */
    font-size: 26px;
    padding: 3px;
}
</style>
