<template>
  <transition 
    enter-active-class="slideInRight"
    leave-active-class="bounceOutRight">
    <div v-show="visible" class="detailView">
      {{detail.id}}
      fasdddddddddddddddddddddasdfasfdasfd
    </div>
  </transition>
</template>

<style lang="less" scoped>
.detailView {
  position: absolute;
  &.slideInRight {
    animation-duration: 0.7s;
  }
  top: 56px;
  left: 200px;
  right: 0px;
  bottom: 0px;
  background-color: gray;
}
</style>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    detail: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
