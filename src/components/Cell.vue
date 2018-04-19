<template>
  <span class="cell" @click="click">
    <Status v-if="type === 'status'" :status="value"></Status>
    <span v-else :class="type">{{ value }}</span>
  </span>
</template>

<style lang="less" scoped>
@import '../styles/variable.less';

.cell {
  white-space: nowrap;
  .caption, .link {
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
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    field () {
      return this.$props.config.value
    },
    type () {
      return this.$props.config.type
    },
    value () {
      let value = this.$props.config.value
      if (this.type === 'date') {
        value = this.$dateFormat(value)
      } else if (this.type === 'month_period') {
        value = this.$t(`month${value}`)
      }
      return value
    },
  },
  methods: {
    click () {
      this.$emit('click')
    },
  },
}
</script>
