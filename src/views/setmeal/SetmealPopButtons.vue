<template>
  <div>
    <el-button class="back" v-show="step > 0" @click="back">{{$t('back')}}</el-button>
    <el-button v-show="step < stepLen - 1" @click="next">{{$t('next')}}</el-button>
    <el-button type="primary" v-show="step > stepLen - 2" @click="confirm">{{$t('confirm')}}</el-button>
  </div>
</template>

<style lang="less" scoped>
.el-button {
  width: 70px;
  &.back {
    background-color: #627c80;
  }
}
</style>

<script>
export default {
  name: 'SetmealPopButtons',
  data () {
    return {

    }
  },
  props: {
    step: {
      type: Number,
      required: true,
    },
    stepLen: {
      type: Number,
      required: true,
    }
  },
  methods: {
    back () {
      if (this.step > 0) {
        this.$emit('update:step', this.step - 1)
      }
    },
    next () {
      this.$emit('next')
    },
    confirm () {
      this.$emit('confirm')
    },
  }
}
</script>
