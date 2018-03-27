<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconType"></use>
  </svg>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: ['type'],
  computed: {
    iconType () {
      return `#icon-${this.type}`
    },
  },
}
</script>
