<template>
  <div class="IssueSetmeal">
    <el-card shadow="hover" :body-style="bodyStyle"
      v-for="setmeal of setmealList"
      :key="setmeal.id">
      <div slot="header">
        <span>{{setmeal.name}}</span>
      </div>
      <div class="desc">
        {{setmeal.description}}
      </div>
      <div class="price">
        <span>{{`${$t('IssueSetmeal.discount_price')}:`}}</span>
        <Money class="big" prefix="￥" :fixed="2"
          :money="setmeal.discount_price" :unit="`month${setmeal.period}`">
        </Money>
      </div>
      <div class="buttonGroup">
        <el-button @click="showDetail(setmeal)">{{$t('IssueSetmeal.detail')}}</el-button>
        <el-button @click="purchase(setmeal)">{{$t('purchase')}}</el-button>
      </div>
    </el-card>
    <SetmealPurchase ref="popPurchase"></SetmealPurchase>
    <SetmealDetail ref="popDetail"></SetmealDetail>
  </div>
</template>

<style lang="less" scoped>
.IssueSetmeal {
  box-sizing: border-box;
  height: 100%;
  background: #eef0f3;
  padding: 20px;
  display: flex;
  flex-flow: row wrap;
  .el-card {
    width: 240px;
    height: 240px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    .desc {
      flex: 1;
    }
    .price {
      height: 50px;
    }
    .buttonGroup {
      height: 30px;
      display: flex;
      .el-button {
        flex: 1;
      }
    }
  }
}
</style>

<script>
import { mapGetters } from 'vuex'
import SetmealPurchase from './SetmealPurchase'
import SetmealDetail from './SetmealDetail'

export default {
  name: 'IssueSetmeal',
  components: {
    SetmealPurchase,
    SetmealDetail,
  },
  data () {
    return {
      bodyStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 10px 15px 20px',
      },
    }
  },
  computed: {
    ...mapGetters({
      setmealList: 'IssueSetmealList',
      popVisible: 'IssueSetmealPopVisible',
    }),
  },
  methods: {
    init () {
      this.$store.dispatch('SelectIssueSetmealList')
    },
    showDetail (setmeal) {

    },
    purchase (setmeal) {
      this.showPop('purchase')
      this.initPopData('popPurchase', setmeal)
    },
    initPopData (popRef, setmeal) {
      let pop = this.$refs[popRef]
      let data_bak = JSON.parse(JSON.stringify(setmeal))
      pop.initData(data_bak)
      this.$store.dispatch('SelectIssueSetmealDetail', data_bak.set_meal_id).then(res => {
        pop.initData(JSON.parse(JSON.stringify(res.data)))
      })
    },
    showPop (name) {
      this.$store.commit('updateIssueSetmealPopVisible', {
        name,
        visible: true,
      })
    },
  },
  created () {
    this.init()
  },
}
</script>
