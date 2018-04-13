<template>
  <span class="cell" @click="click">
    <i v-if="icon" :class="`el-icon-${icon}`"></i>
    <span :class="column.type">{{ content }}</span>
  </span>
</template>

<style lang="less" scoped>
@import '../styles/variable.less';

.cell {
  white-space: nowrap;
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
  .caption {
    cursor: pointer;
    color: @color_link;
  }
  .price {
    font-weight: bold;
    color: #f78913;
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
    row: {
      type: Object,
    },
    column: {
      type: Object,
    },
  },
  computed: {
    field () {
      return this.$props.column.field
    },
    type () {
      return this.$props.column.type
    },
    value () {
      return this.$props.row[this.field]
    },
    icon () {
      let field = this.field
      let value = this.value
      if (field === 'status') {
        if (['draft'].includes(value)) {
          return 'info'
        } else if (['issue'].includes(value)) {
          return 'success'
        } else if (['off_shelve'].includes(value)) {
          return 'warning'
        }
      }
    },
    content () {
      let type = this.type
      let value = this.value
      switch (type) {
        case 'status': return this.$t(value)
      }
      return value
    },
  },
  methods: {
    click () {
      if (this.type === 'caption') {
        this.$emit('captionClick', this.$props.row)
      }
    },
  },
}
</script>
