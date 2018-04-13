<template>
  <span>
    <i v-if="icon" :class="`el-icon-${icon}`"></i>
    {{$t(status)}}
  </span>
</template>

<style lang="less" scoped>
i {
  font-size: 1.3em;
  &.el-icon-success {
    color: #26b09c;
  }
  &.el-icon-info {
    color: #39546d;
  }
  &.el-icon-warning {
    color: #d6d078;
  }
  &.el-icon-error {
    color: #d45964;
  }
}
</style>

<script>
export default {
  name: 'Status',
  data () {
    return {
      statusList: ['success', 'info', 'warning', 'error'],
      statusStore: {
        issue: 0,
        draft: 1,
        off_shelve: 2,
      },
    }
  },
  props: {
    status: {
      type: String,
    },
  },
  computed: {
    icon () {
      return this.statusList[this.statusStore[this.$props.status] || 0]
    }
  }
}
</script>
