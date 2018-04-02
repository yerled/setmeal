<template>
  <i :class="`el-icon-${icon}`"></i>
</template>

<style lang="less" scoped>

</style>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    field: {
      type: String,
    },
    value: {
      type: String,
    },
  },
  computed: {
    icon () {
      let field = this.$props.field
      let value = this.$props.value
      if (field === 'status') {
        if (['draft'].includes(value)) {
          return 'info'
        } else if (['issue'].includes(value)) {
          return 'success'
        } else if (['off_shelve'].includes(value)) {
          return 'warning'
        }
      } else if (field === '') {

      }
    }
  },
}
</script>
