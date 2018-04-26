<template>
  <div class="total_price">
    <div class="price_title">
      <span class="resource_name">
        {{`${$t('Setmeal.setmeal')}${$t('total_price')}`}}
      </span>
      <span class="price">
        <Money :class="['big']" prefix="￥" :money="totalPrice" unit="hour"></Money>
      </span>
    </div>
    <div class="period"
      v-for="(item, index) of periods"
      :key="index">
      <span class="discount_title">
        {{`${$t(`discount${item.period}`)}:`}}
      </span>
      {{$t('discount')}}
      <el-input-number :max="100" :min="1" v-model="item.discount"></el-input-number>%
      <Money :class="['big']" prefix="￥" :money="discountPrice[index]" :fixed="4"></Money>
    </div>
  </div>
</template>

<style lang="less" scoped>
.total_price {
  margin-left: 20px;
  width: 566px;
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
    margin-right: 20px;
  }
  .price_title {
    height: 50px;
    line-height: 50px;
    .resource_name {
      font-weight: bold;
      font-size: 18px;
    }
  }
  .period {
    margin-top: 10px;
  }
}
</style>

<script>
export default {
  name: 'SetmealInfoPeriod',
  data () {
    return {

    }
  },
  props: {
    periods: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Array,
      required: true,
    },
  },
}
</script>
