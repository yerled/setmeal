<template>
  <span :class="classArr" class="money">
    {{prefix}}
    <span class="price">
      {{money | money(fixed)}}
    </span>
    <span class="unit">
      {{computedUnit}}
    </span>
  </span>
</template>

<style lang="less" scoped>
.money {
  color: #f78913;
  .price
  &.balance {
    color: #1eb9a5;
  }
  &.zero {
    color: #36787d;
  }
  &.big {
    .price {
      font-size: 20px;
      font-weight: bold;
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
    money: {
      type: [Number, String],
      default: 0,
    },
    fixed: {
      type: Number,
      default: -1,
    },
    unit: {
      type: [String],
    },
    prefix: {
      type: [String],
    },
  },
  computed: {
    classArr () {
      let arr = ['money']
      if (Number.parseFloat(this.$props.money) === 0) {
        arr.push('zero')
      }
      return arr
    },
    computedUnit () {
      let unit = this.$t('rmb')
      if (this.$props.unit) {
        unit += ` / ${this.$t(`${this.$props.unit}`)}`
      }
      return unit
    },
  },
}
</script>
