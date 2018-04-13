<template>
  <el-collapse>
    <el-collapse-item
      v-for="(resources, type) of dict"
      :key="type">
      <template slot="title">
        <div class="price_title">
          <span class="resource_name">{{`${$t(type)}${$t('total_price')}`}}</span>
          <span class="price">
            <Money :class="['big', 'balance']" prefix="￥" :money="resources.price" unit="hour"></Money>
          </span>
        </div>
      </template>
      <div class="price_items">
        <div class="price_item"
          v-for="(item, index) of resources"
          :key="index">
          <span class="resource_name">{{`${$t(type)} ${index + 1} `}}</span>
          <span class="configDesc">{{item.configDesc}}</span>
          <span class="price">
            <Money :class="['zero']" prefix="￥" :money="item.price" unit="hour"></Money>
          </span>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style lang="less" scoped>
.el-collapse, .total_price {
  margin-left: 20px;
  width: 666px;
  span {
    display: inline-block;
  }
  .resource_name {
    width: 100px;
  }
  .configDesc {
    margin-right: 30px;
  }
  .discount_title {
    width: 130px;
    text-align: right;
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
    dict: {
      type: Object,
      required: true,
    },
  },
  computed: {
    resourcesDict () {
      return {}
    },
  },
  methods: {
  },
}
</script>
