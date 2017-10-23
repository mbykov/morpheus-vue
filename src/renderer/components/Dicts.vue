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
          <!-- <span class="trns">{{doc.trns}}</span> -->
          <div class="trns" v-for="(trn, idy) in doc.trns">
            {{trn}}
          </div>
          <div class="note" v-if="doc.cf">note: {{doc.cf}}</div>
        </div>
      </div>
    </div>

<!-- 他家白天一般 没有人，你还是晚上去吧。Tā jiā báitiā   !!!!!!!!!!!!!!! ОШИБКА !!             -->

    <!-- <hr> -->
    <!-- <p>{{dict}}</p> -->
  </div>
</template>

<script>
  import { EventBus } from './bus.js'
  export default {
    name: 'dicts',
    props: ['odict'],
    created () {
      EventBus.$on('i-got-clicked', segs => {
        console.log('nice:', segs)
        this.dict = {dict: 'kuku'}
      })
    },

    data: function () {
      return {
        dict: ''
        // JSON.parse(JSON.stringify(this.dict))
      }
    },
    watch: {
      odict: function (newdict) {
        console.log('DICT CHANGED', newdict)
        this.dict = JSON.parse(JSON.stringify(newdict))
      }
    },
    components: {},
    methods: {
    }
  }
  EventBus.$on('i-got-clicked', data => {
    console.log('nice, nice', data)
  })
</script>

<style src="./dicts.css">
</style>
