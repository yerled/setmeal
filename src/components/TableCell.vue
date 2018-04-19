<template>
  <Cell @click="click" :config="config"></Cell>
</template>

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
    config () {
      return {
        value: this.value,
        type: this.type,
      }
    },
    field () {
      return this.$props.column.field
    },
    type () {
      return this.$props.column.type
    },
    value () {
      let value = `${this.$props.row[this.field]}`
      let format = this.$props.column.format
      if (typeof format === 'function') {
        value = format(this.$props.row, this)
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
