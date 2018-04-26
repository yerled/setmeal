<template>
  <el-dialog width="500px"
    :title="$t(`IssueSetmeal.pop.detail.title`)"
    :close-on-click-modal="false"
    :visible="visible"
    @close="close">
    <SetmealInfoResource :dict="resourcePriceDict"></SetmealInfoResource>
    <!-- <SetmealInfoPeriod :periods.sync="periods" :totalPrice="totalPrice" :discountPrice="discountPrice"></SetmealInfoPeriod> -->
  </el-dialog>
</template>

<script>
import SetmealInfoResource from './SetmealInfoResource'
// import SetmealInfoPeriod from './SetmealInfoPeriod'

export default {
  name: 'SetmealPurchaseForm',
  components: {
    SetmealInfoResource,
    // SetmealInfoPeriod,
  },
  data () {
    return {
      resourceDict: {
        instance: [],
        volume: [],
        floating_ip: [],
        router: [],
      },
      counter: {
        instance: 0,
        volume: 0,
        floating_ip: 0,
        router: 0,
      },
      rawData: {},
      periods: [
        {
          period: 1,
          discount: 95,
        }, {
          period: 2,
          discount: 90,
        }, {
          period: 3,
          discount: 85,
        }, {
          period: 6,
          discount: 80,
        }, {
          period: 12,
          discount: 75,
        }
      ],
    }
  },
  computed: {
    visible () {
      return this.$store.getters.IssueSetmealPopVisible.detail
    },
    resourcePriceDict () {
      let dict_bak = JSON.parse(JSON.stringify(this.resourceDict))
      let price = 0
      this.resourceNames.forEach(type => {
        let resourceArr = dict_bak[type]
        resourceArr.price = 0
        resourceArr.forEach(e => {
          e.price = this._calcSinglePrice(type, e.configuration)
          e.configDesc = this._initConfigDesc(e.configuration)
          resourceArr.price += e.price
          price += e.price
        })
        resourceArr.price = Number(resourceArr.price.toFixed(4))
      })
      price = Number(price.toFixed(4))
      this.updateTotalPrice(price)
      return dict_bak
    },
  },
  methods: {
    initData (data) {
      if (data) {
        this.rawData = data
      }
      let rawData = this.rawData
      this.step = 0
      this.tip.content = ''

      /* infoMain */
      let setmeal = rawData.set_meal ? rawData.set_meal : rawData
      this.setmeal = {
        name: setmeal.name,
        description: setmeal.description,
        unlimited: setmeal.limit === 0,
        limitNumber: setmeal.limit,
      }

      /* infoResource */
      this.resourceDict = {
        instance: [],
        volume: [],
        floating_ip: [],
        router: [],
      }
      this.unwatchCounter = true
      this.counter.instance.value = 0
      this.counter.volume.value = 0
      this.counter.floating_ip.value = 0
      this.counter.router.value = 0
      rawData.resources && rawData.resources.forEach(e => {
        this.counter[e.type].value++
        if (typeof e.configuration === 'string') {
          e.configuration = JSON.parse(e.configuration)
        }
        let obj = {
          type: e.type,
          configuration: e.configuration,
        }
        if (e.type === 'instance') {
          let flavor = this.flavorDict[e.configuration.flavor_id] || {}
          obj.vcpus = flavor.vcpus
          obj.ram = flavor.ram
        }
        this.resourceDict[e.type].push(obj)
      })
      this.$nextTick(() => {
        this.unwatchCounter = false
      })

      /* infoPeriod */
      let periods = []
      rawData.periods && rawData.periods.forEach(e => {
        periods.push({
          period: e.period,
          discount: e.discount * 100
        })
      })
      this.periods = periods

      /* onlyUpdatePeriod */
      if (this.onlyUpdatePeriod) {
        this.step = 5
      }
    },
    close () {
      this.$store.commit('updateIssueSetmealPopVisible', {name: 'detail', visible: false})
    },
  },
}
</script>
