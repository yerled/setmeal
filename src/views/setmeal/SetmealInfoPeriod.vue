<template>
  <div class="item price" v-show="stepName === 'price'">
    <el-collapse>
      <el-collapse-item
        v-for="(resources, type) of resourcesDict"
        :key="type">
        <template slot="title">
          <div class="price_title">
            <span class="resource_name">{{`${$t(type)}${$t('total_price')}`}}</span>
            <span class="price">
              <Money :class="['big', 'balance']" prefix="￥" :money="resources.price" unit="day"></Money>
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
              <Money :class="['zero']" prefix="￥" :money="item.price" unit="day"></Money>
            </span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="total_price">
      <div class="price_title">
        <span class="resource_name">
          {{`${$t('Setmeal.setmeal')}${$t('total_price')}`}}
        </span>
        <span class="price">
          <Money :class="['big']" prefix="￥" :money="setmeal.price" unit="day"></Money>
        </span>
      </div>
      <div class="period"
        v-for="(item, index) of set_meal_periods"
        :key="index">
        <span class="discount_title">
          {{`${$t(`discount${item.period}`)}`}}
        </span>
        <el-input-number :max="100" :min="1" v-model="item.discount"></el-input-number>%
        <Money :class="['big']" prefix="￥" :money="discount_price[index]" :unit="`month${item.period}`"></Money>
      </div>
    </div>
  </div>
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
.total_price {
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

