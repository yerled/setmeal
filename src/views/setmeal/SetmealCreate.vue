<template>
  <el-dialog  width="800px"
    :title="$t(`Setmeal.pop.create.title`)"
    :close-on-click-modal="false"
    :visible="visible"
    @close="close">
    <el-steps finish-status="success" :active="step">
      <el-step v-for="item of steps"
        :key="item"
        :title="$t(`Setmeal.pop.step_${item}`)">
      </el-step>
    </el-steps>
    <el-alert :type="tip.type" v-show="tip.content" :title="tip.content" show-icon :closable="false"></el-alert>
    <div class="body">
      <SetmealInfoMain ref="mainForm" v-show="step === 0" :setmeal.sync="setmeal" :counter.sync="counter"></SetmealInfoMain>
      <SetmealInfoInstance v-show="step === 1" :instances.sync="resourceDict.instance"></SetmealInfoInstance>
      <SetmealInfoVolume v-show="step === 2" :volumes.sync="resourceDict.volume"></SetmealInfoVolume>
      <SetmealInfoLine v-show="step === 3" :lines.sync="resourceDict.floating_ip" type="floating_ip"></SetmealInfoLine>
      <SetmealInfoLine v-show="step === 4" :lines.sync="resourceDict.router" type="router"></SetmealInfoLine>
      <SetmealInfoResource v-show="step === 5" :dict="resourcePriceDict"></SetmealInfoResource>
      <SetmealInfoPeriod v-show="step === 5" :periods.sync="periods" :totalPrice="totalPrice" :discountPrice="discountPrice"></SetmealInfoPeriod>
    </div>
    <setmealPopButtons slot="footer" :step.sync="step" :stepLen="stepLen" :loading="loading"
      @confirm="create"
      @next="stepNext">
    </setmealPopButtons>
  </el-dialog>
</template>

<style lang="less" scoped>
.body {
  height: 380px;
  overflow: auto;
  .resource {
    .el-card {
      margin-bottom: 10px;
    }
  }
}
</style>

<script>
import SetmealInfoMain from './SetmealInfoMain'
import SetmealInfoInstance from './SetmealInfoInstance'
import SetmealInfoVolume from './SetmealInfoVolume'
import SetmealInfoLine from './SetmealInfoLine'
import SetmealInfoResource from './SetmealInfoResource'
import SetmealInfoPeriod from './SetmealInfoPeriod'
import SetmealPopButtons from './SetmealPopButtons'
import { mapGetters } from 'vuex'
import {initDictFromList} from '../../utils'

export default {
  name: 'SetmealCreate',
  components: {
    SetmealInfoMain,
    SetmealInfoInstance,
    SetmealInfoVolume,
    SetmealInfoLine,
    SetmealInfoResource,
    SetmealInfoPeriod,
    SetmealPopButtons,
  },
  data () {
    return {
      step: 0,
      tip: {
        type: 'error',
        content: '',
      },
      setmeal: {
        name: '',
        description: '',
        unlimited: true,
        limitNumber: 1,
      },
      counter: {
        instance: {
          value: 0,
          min: 0,
          max: 10,
        },
        volume: {
          value: 0,
          min: 0,
          max: 10,
        },
        floating_ip: {
          value: 0,
          min: 0,
          max: 10,
        },
        router: {
          value: 0,
          min: 0,
          max: 1,
        },
      },
      resourceDict: {
        instance: [],
        volume: [],
        floating_ip: [],
        router: [],
      },
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
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      flavorList: 'flavorList',
      flavorDict: 'flavorDict',
      productList: 'productList',
      productDict: 'productDict',
    }),
    visible () {
      return this.$store.getters.SetmealPopVisible.create
    },
    steps () {
      return ['main', ...this.resourceNames, 'price']
    },
    stepLen () {
      return this.steps.length
    },
    limit () {
      return this.setmeal.unlimited ? 0 : this.setmeal.limitNumber
    },
    resourceNames () {
      return Object.keys(this.defaultResource)
    },
    defaultResource () {
      let defaultFlavor = this.$store.getters.flavorList[0] || {}
      let defaultVolumeType = this.$store.getters.volumeTypeList[0] || {}
      let defaultLine = this.$store.getters.lineList[0] || {}
      return {
        instance: {
          type: 'instance',
          vcpus: defaultFlavor.vcpus,
          ram: defaultFlavor.ram,
          configuration: {
            flavor_id: defaultFlavor.flavor_id,
          },
        },
        volume: {
          type: 'volume',
          configuration: {
            volume_type: defaultVolumeType,
            size: 50,
          },
        },
        floating_ip: {
          type: 'floating_ip',
          configuration: {
            line: defaultLine.name,
            ratelimit: 10,
          },
        },
        router: {
          type: 'router',
          configuration: {
            line: defaultLine.name,
            ratelimit: 10,
          },
        },
      }
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
    discountPrice () {
      return this.periods.map(e => {
        return this.totalPrice * 24 * 30 * e.period * e.discount / 100
      })
    },
    dataForCommit () {
      let set_meal = {
        name: this.setmeal.name,
        description: this.setmeal.description,
        limit: this.limit,
        price: this.totalPrice,
      }

      let resources = []
      this.resourceNames.forEach(e => {
        this.resourcePriceDict[e].forEach(ee => {
          let e2 = Object.assign({}, ee)
          resources.push({
            type: e,
            configuration: JSON.stringify(e2.configuration),
            price: e2.price,
          })
        })
      })

      let periods = this.periods.map((e, i) => {
        return {
          period: e.period,
          discount: e.discount / 100,
          discount_price: this.discountPrice[i],
        }
      })

      return {
        set_meal,
        resources,
        periods,
      }
    },
  },
  methods: {
    initDictFromList,
    stepNext () {
      if (this.step === 0) {
        let form = this.$refs.mainForm.$refs.SetmealInfoMain
        form.validate((valid) => {
          if (valid) {
            this.step++
          } else {
            return false
          }
        })
      } else if (this.step < this.stepLen - 1) {
        this.step++
      }
    },
    _calcSinglePrice (type, resource) {
      let dict = this.productDict
      let product, result
      /* eslint-disable no-fallthrough */
      switch (type) {
        case 'instance':
          product = dict[`instance:${this.flavorDict[resource.flavor_id].name}`]
          product && (result = product.unit_price)
          break
        case 'volume':
          product = dict[`${resource.volume_type === 'sata' ? 'sata.' : ''}volume.size`]
          product && (result = product.unit_price * resource.size)
          break
        case 'floating_ip':
        case 'router':
          product = dict[`ip.floating.${resource.line}`]
          product && (result = product.unit_price * resource.ratelimit)
          break
        default: result = 0
      }
      return Number(Number(result).toFixed(4))
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
    updateTotalPrice (price) {
      this.totalPrice = price
    },
    updateResourceCount (resourceType, newVal, oldVal) {
      let dict = this.resourceDict[resourceType]
      let difference = newVal - oldVal
      if (difference) {
        for (let i = 0; i < Math.abs(difference); i++) {
          if (difference > 0) {
            dict.push(JSON.parse(JSON.stringify(this.defaultResource[resourceType])))
          } else {
            dict.pop()
          }
        }
      }
    },
    create () {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$store.dispatch('CreateSetmeal', this.dataForCommit)
        .then(res => {
          this.$message.success(this.$t('createSuccess'))
          this.refreshTable()
          this.close()
          this.reset()
        }).catch(err => {
          console.log(err)
          this.tip.content = this.$t('createFailed')
        }).finally(res => {
          this.loading = false
        })
    },
    close () {
      this.$store.commit('updateSetmealPopVisible', {name: 'create', visible: false})
    },
    reset () {
      this.setmeal = {
        name: '',
        description: '',
        price: 0,
        limitNumber: 1,
        unlimited: true,
      }
      this.tip.content = ''
      this.step = 0
    },
    refreshTable () {
      this.$store.dispatch('SelectSetmealList')
    },
    init () {
      this.resourceNames.forEach(e => {
        this.$watch(`counter.${e}.value`, function (newVal, oldVal) {
          this.updateResourceCount(e, newVal, oldVal)
        })
      })
    },
  },
  created () {
    this.init()
  },
}
</script>
