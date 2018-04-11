<template>
  <transition
    enter-active-class="slideInRight"
    leave-active-class="bounceOutRight">
    <div v-show="visible" class="detailView">
      <el-tabs  type="border-card"
        v-model="activeTab"
        @tab-click="toggleTab">
        <el-tab-pane name="details" :label="$t('details')">
          <slot></slot>
        </el-tab-pane>
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab"
          :name="tab"
          :label="$t(tab)">
          <slot :name="tab"></slot>
        </el-tab-pane>
      </el-tabs>
      <div class="left" @click="clickLeft">
        <Iconfont type="right"/>
      </div>
    </div>
  </transition>
</template>

<style lang="less" scoped>
@import '../styles/variable.less';

.detailView {
  position: absolute;
  top: 116px;
  left: 480px;
  right: 0px;
  bottom: 0px;
  &.slideInRight {
    animation-duration: 0.7s;
  }
  .left {
    width: 20px;
    height: 100%;
    position: absolute;
    left: -20px;
    top: 0;
    background-color: #c7ccce;
    cursor: pointer;
    z-index: 2;
    display: flex;
    align-items: center;
    color: #1a5b5e;
    border-radius: 50px 0 0 50px;
  }
  .el-tabs {
    border-left: none;
    // padding-left: 20px;
    width: 100%;
    height: 100%;
  }
}
</style>

<script>
export default {
  data () {
    return {
      activeTab: 'details',
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
    tabs: {
      type: Array,
      default () {
        return []
      },
    },
  },
  computed: {
    
  },
  methods: {
    toggleTab (tab, event) {
      console.log(tab)
    },
    clickLeft () {
      this.$emit('close')
    },
  },
}
</script>
