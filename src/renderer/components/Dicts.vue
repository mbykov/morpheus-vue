<template>
  <div id="dicts">
    <div id="dict-glyph"><span class="dict-glyph">{{dict.dict}}</span> <span class="dict-other">{{dict.other}}</span></div>
    <div v-for="dns in dict.dbns">
      <div v-for="dn in dns">
        <br>
        <span class="dname">{{dn.dname}}</span>
        <div v-for="(doc, idx) in dn.docs">
          <span class="pinyin">{{idx + 1}}. {{doc.pinyin}}</span>
          <span class="pos">{{doc.pos}}</span>
          <div class="trns" v-for="(trn, idy) in doc.trns">
            {{trn}}
          </div>
          <div class="note" v-if="doc.cf">note: {{doc.cf}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { EventBus } from './bus.js'
  export default {
    name: 'dicts',
    // props: ['odict'], // не задействовано, потому что bus.event
    created () {
      EventBus.$on('show-dict', dict => {
        console.log('nice-dict:', dict)
        this.dict = dict
      })
    },
    data: function () {
      return {
        dict: ''
      }
    }
    // watch: {
    //   odict: function (newdict) {
    //     console.log('DICT CHANGED', newdict)
    //     this.dict = JSON.parse(JSON.stringify(newdict))
    //   }
    // },
    // components: {},
    // methods: {
    // }
  }
</script>

<style src="./dicts.css">
</style>
