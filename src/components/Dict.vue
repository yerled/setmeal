<template>
  <div class="dict">
    <div class="item"
      v-for="(value, key) of data"
      :key="key">
      <span class="key">{{key}}</span>
      <span class="value">{{value}}</span>
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
  },
}
</script>
