<template>
  <div class="dict">
    <div class="item"
      v-for="(value, key) of data"
      :key="key">
      <span class="key">{{i18nKey(key)}}</span>
      <span class="value">
        <template v-if="noSlot">
          <Money v-if="value && value.type === 'price'" prefix="￥" :money="value.value" :unit="value.unit"></Money>
          <Status v-else-if="value && value.type === 'status'" :status="value.value"></Status>
          <span v-else>{{value}}</span>
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
    .key {
      width: 80px;
      color: #738295;
      text-align: right;
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
  },
  computed: {
    noSlot () {
      return !this.$scopedSlots.default
    }
  },
  methods: {
    i18nKey (key) {
      let moduleName = this.$props.moduleName
      if (moduleName) {
        return this.$t(`${moduleName}.${key}`)
      }
      return key
    }
  }
}
</script>
