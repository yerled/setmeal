<template>
  <DetailView
    :detail="detail"
    :visible.sync="visible"
    :tabs="tabs"
    @close="close">
    <div>details</div>
    <div slot="tab2"> tab2</div>
  </DetailView>
</template>

<script>
export default {
  data () {
    return {
      tabs: ['tab2'],
    }
  },
  props: {
    detail: {
      type: Object,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close () {
      this.$emit('leaveDetail')
    },
  },
}
</script>
