<template>
  <div id="dicts">
    <div id="dict-glyph">{{dict.dict}}</div>
    <div v-for="dns in dict.docs">
      <div v-for="dn in dns">
        <br>
        <span class="dname">{{dn.dname}}</span>
        <div v-for="doc in dn.docs">
          <span class="pinyin">{{doc.pinyin}}</span>
          <span class="pos">{{doc.pos}}</span>
          <!-- <span class="trns">{{doc.trns}}</span> -->
          <div class="trns" v-for="(trn, idx) in doc.trns">
            {{idx + 1}}. {{trn}}
          </div>
        </div>
      </div>
    </div>

    <!-- <hr> -->
    <!-- <p>{{dict}}</p> -->
  </div>
</template>

<script>
  export default {
    name: 'dicts',
    props: ['dict'],
    components: {},
    methods: {
    }
  }
</script>

<style src="./dicts.css">
</style>
