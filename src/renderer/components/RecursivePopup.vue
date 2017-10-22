<template>
  <div id="recursive-popup">
    <!-- <span class="segs"> -->
      <!-- {{dictsegs}} -->
    <!-- </span> -->
    <span class="segs">
      <span v-for="dict in dictsegs">
        <!-- {{dict}} -->
        <span class="seg" @mouseover="showSegg">{{dict}}</span>
      </span>
    </span>
  </div>
</template>

<script>
  import {log, q} from '../utils'
  export default {
    name: 'recursive-popup',
    props: ['segs', 'coords'],
    data: function () {
      return {
        dictsegs: null,
        seghtml: ''
      }
    },
    watch: {
      segs: function (segs) {
        log('segs', segs)
        let dictsegs = (segs) ? segs.map(seg => { return seg.dict }) : []
        this.dictsegs = dictsegs
        // this.dictsegs = (segs) ? segs.map(seg => { return seg.dict }) : []
        // // this.seghtml = dictsegs.map(seg => { return ['<span class="seg" @click="showSegg" >', seg, '</span>'].join('') }).join('')
        // log('dictsegs', this.dictsegs)
        // // log('HTML', this.seghtml)
        let osegs = q('.segs')
        placePopup(this.coords, osegs)
      }
    },
    components: {},
    methods: {
      showSegg: function (ev) {
        this.$parent.$options.methods.showSeg(ev)
        // log('==>', this.$parent.$options.methods)
      }
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
