<template>
  <el-dialog width="650px"
    :title="$t(`IssueSetmeal.pop.detail.title`)"
    :visible="visible"
    @close="close">
    <div class="body">
      <SetmealInfoResource :dict="resourceDescDict"></SetmealInfoResource>
      <SetmealInfoPeriod :periods="periods" :totalPrice="totalPrice"></SetmealInfoPeriod>
    </div>
    <div slot="footer">
      <el-button class="back" @click="cancel">{{$t('cancel')}}</el-button>
      <el-button type="primary" @click="purchase">{{$t('purchase')}}</el-button>
    </div>
  </el-dialog>
</template>

<style lang="less" scoped>
.body {
  height: 420px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

<script>
import SetmealInfoResource from './SetmealInfoResource'
import SetmealInfoPeriod from './SetmealInfoPeriod'
import { mapGetters } from 'vuex'

export default {
  name: 'IssueSetmealDetail',
  components: {
    SetmealInfoResource,
    SetmealInfoPeriod,
  },
  data () {
    return {
      resourceDict: {
        instance: [],
        volume: [],
        floating_ip: [],
        router: [],
      },
      rawData: {},
      totalPrice: 0,
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
    ...mapGetters(['flavorDict']),
    visible () {
      return this.$store.getters.IssueSetmealPopVisible.detail
    },
    resourceNames () {
      return Object.keys(this.resourceDict)
    },
    resourceDescDict () {
      let dict_bak = JSON.parse(JSON.stringify(this.resourceDict))
      this.resourceNames.forEach(type => {
        let resourceArr = dict_bak[type]
        resourceArr.forEach(e => {
          e.configDesc = this._initConfigDesc(e.configuration)
        })
      })
      return dict_bak
    },
  },
  methods: {
    initData (data) {
      if (data) {
        this.rawData = data
      }
      let rawData = this.rawData

      /* infoResource */
      this.resourceDict = {
        instance: [],
        volume: [],
        floating_ip: [],
        router: [],
      }
      rawData.resources && rawData.resources.forEach(e => {
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
      this.totalPrice = Number(rawData.set_meal ? rawData.set_meal.price : rawData.price)

      /* infoPeriod */
      let periods = []
      rawData.periods && rawData.periods.forEach(e => {
        periods.push({
          period: e.period,
          discount: e.discount * 100,
          discount_price: e.discount_price,
        })
      })
      this.periods = periods
    },
    _initConfigDesc (config) {
      let arr = []
      if ('flavor_id' in config) {
        let flavor = this.flavorDict[config.flavor_id]
        arr.push(`${this.$t('flavor')}:${flavor ? flavor.__nameAndDesc : config.flavor_id}`)
      }
      if ('volume_type' in config) {
        arr.push(`${this.$t('volume_type')}:${this.$t(config.volume_type)}`)
      }
      if ('size' in config) {
        arr.push(`${this.$t('size')}:${config.size} GB`)
      }
      if ('line' in config) {
        arr.push(`${this.$t('line')}:${this.$t(config.line)}`)
      }
      if ('ratelimit' in config) {
        arr.push(`${this.$t('ratelimit')}:${config.ratelimit} MB`)
      }
      return arr.join('; ')
    },
    purchase () {
      this.$emit('purchase', this.rawData)
      this.close()
    },
    cancel () {
      this.close()
    },
    close () {
      this.$store.commit('updateIssueSetmealPopVisible', {name: 'detail', visible: false})
    },
  },
}
</script>
