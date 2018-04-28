<template>
  <div class="dict">
    <div class="item"
      v-for="(value, key) of data"
      :key="key">
      <span :style="keyStyle">{{i18nKey(key)}}</span>
      <span class="value">
        <template v-if="noSlot">
          <Cell :config="getConfig(value)"></Cell>
        </template>
        <slot :value="value"></slot>
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dict {
  .item {
    height: 28px;
    span {
      display: inline-block;
    }
    .value {
      padding-left: 20px;
    }
  }
}
</style>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      },
    },
    moduleName: {
      type: String,
    },
    labelWidth: {
      type: [String, Number],
      default: '80px',
    },
  },
  computed: {
    noSlot () {
      return !this.$scopedSlots.default
    },
    keyStyle () {
      let width = this.$props.labelWidth
      if (typeof width === 'number') {
        width += 'px'
      }
      return {
        width,
        color: '#738295',
        textAlign: 'right',
      }
    },
  },
  methods: {
    i18nKey (key) {
      let moduleName = this.$props.moduleName
      if (moduleName) {
        return this.$t(`${moduleName}.${key}`)
      }
      return key
    },
    getConfig (c) {
      if (typeof c === 'object') {
        return c
      } else {
        return {
          value: c
        }
      }
    },
  }
}
</script>
