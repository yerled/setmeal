<template>
  <span class="cell" @click="click">
    <Status v-if="column.type === 'status'" :status="value"></Status>
    <span v-else :class="column.type">{{ value }}</span>
  </span>
</template>

<style lang="less" scoped>
@import '../styles/variable.less';

.cell {
  white-space: nowrap;
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
