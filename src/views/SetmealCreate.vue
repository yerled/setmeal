<template>
  <el-dialog  width="800px"
    :title="$t('Setmeal.popCreate.title')"
    :close-on-click-modal="!visible"
    :append-to-body="visible"
    :visible.sync="visible">
    <el-steps :active="step" finish-status="success">
      <el-step v-for="item of steps"
        :key="item"
        :title="$t(`Setmeal.popCreate.step_${item}`)">
      </el-step>
    </el-steps>
    <div class="body">
      <div class="item main" v-show="stepName === 'main'">
        <el-form ref="SetmealCreateForm"
          :model="setmeal"
          :rules="rules">
          <el-form-item :label="$t('Setmeal.popCreate.name')" prop="name"
            :label-width="formLabelWidth">
            <el-input v-model="setmeal.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('description')"
            :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="2"
              v-model="setmeal.description">
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('Setmeal.popCreate.limit')"
            :label-width="formLabelWidth">
            <el-switch
              v-model="setmeal.unlimited"
              :active-text="$t('Setmeal.popCreate.unlimited')">
            </el-switch>
            <el-input-number
              v-show="!setmeal.unlimited"
              v-model="setmeal.limit"
              :min="0" :max="10">
            </el-input-number>
          </el-form-item>
          <el-form-item :label="$t(`Setmeal.${key}_count`)"
            :label-width="formLabelWidth"
            v-for="(item, key) of resourceConfig"
            :key="key">
            <el-input-number
              v-model="counter[key]"
              :min="item.min" :max="item.max">
            </el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <div class="item resource"
        v-for="(resourcesArr, resourceType) of resourcesDict"
        :key="resourceType"
        v-show="stepName === resourceType">
        <el-card class="resource"
          v-for="(resource, index) of resourcesArr"
          :key="index">
          <div slot="header">
            <label>{{`${$t(resourceType)} ${index + 1}`}}</label>
          </div>
          <el-form :model="resource">
            <template v-if="'flavor_id' in resourceConfig[resourceType].configuration">
              <el-form-item :label="$t('flavor')"
                :label-width="formLabelWidth">
                <el-select
                  v-model="resource.flavor_id"
                  @change="updateFlavor(resource, 'flavor_id')">
                  <el-option
                    v-for="flavor in flavorList"
                    :key="flavor.flavor_id"
                    :label="flavor.name"
                    :value="flavor.flavor_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-radio-group size="medium" class="tab-radio-group"
                  v-model="resource.vcpus"
                  @change="updateFlavor(resource, 'vcpus')">
                  <el-radio-button v-for="cpu of flavorCPU"
                    :key="cpu"
                    :label="cpu">{{`${cpu}vCPU`}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-radio-group size="medium" class="tab-radio-group"
                  v-model="resource.ram"
                  @change="updateFlavor(resource, 'ram')">
                  <el-radio-button v-for="flavor of flavorList"
                    v-show="resource.vcpus == flavor.vcpus"
                    :key="flavor.flavor_id"
                    :label="flavor.ram">{{convertSize(flavor.ram, 'M')}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
            <el-form-item v-if="'volume_type' in resourceConfig[resourceType].configuration"
              :label="$t('volume_type')"
              :label-width="formLabelWidth">
              <el-radio-group size="medium" class="tab-radio-group"
                v-model="resource.volume_type">
                <el-radio-button v-for="type of volume_type"
                  :key="type"
                  :label="type">{{$t(type)}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="'size' in resourceConfig[resourceType].configuration"
              :label="`${$t('size')}(G)`"
              :label-width="formLabelWidth">
              <el-slider show-input
                v-model="resource.size"
                :format-tooltip="convertSizeG"
                :min="10" :max="860">
              </el-slider>
            </el-form-item>
            <el-form-item v-if="'line' in resourceConfig[resourceType].configuration"
              :label="$t('line')"
              :label-width="formLabelWidth">
              <el-select v-model="resource.line">
                <el-option
                  v-for="line in lineList"
                  :key="line.name"
                  :label="$t(line.name)"
                  :value="line.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="'ratelimit' in resourceConfig[resourceType].configuration"
              :label="`${$t('ratelimit')}(M)`"
              :label-width="formLabelWidth">
              <el-slider show-input
                v-model="resource.ratelimit"
                :format-tooltip="convertSizeM"
                :min="10" :max="1024">
              </el-slider>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="item price" v-show="stepName === 'price'">
        <el-collapse>
          <el-collapse-item
            v-for="(prices, type) of setmeal_resource_price"
            :key="type">
            <template slot="title">
              <div class="price_title">
                <span class="resource_name">{{`${$t(type)}${$t('total_price')}`}}</span>
                <span class="price">
                  <Money :class="['big']" prefix="￥" :money="prices.total" unit="day"></Money>
                </span>
              </div>
            </template>
            <div class="price_items">
              <div class="price_item"
                v-for="(item, index) of prices.items"
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
              <Money :class="['big']" prefix="￥" :money="total_price" unit="day"></Money>
            </span>
          </div>
          <div class="period"
            v-for="(period, index) of periodList"
            :key="index">
            <span class="discount_title">
              {{`${$t(period)}${$t('discount')}`}}
            </span>
            <el-input-number :max="100" v-model="discountList[index]"></el-input-number>%
            <Money :class="['big']" prefix="￥" :money="discountPriceList[index]" :unit="period"></Money>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button class="back" v-show="step > 0" @click="back">{{$t('back')}}</el-button>
      <el-button v-show="step < stepLen - 1" @click="next">{{$t('next')}}</el-button>
      <el-button type="primary" v-show="step > stepLen - 2" @click="create">{{$t('confirm')}}</el-button>
    </div>
  </el-dialog>
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
.el-steps {
  margin-left: 25px;
  margin-bottom: 15px;
}
.body {
  height: 380px;
  overflow: auto;
  .resource {
    .el-card {
      margin-bottom: 10px;
    }
  }
}
.el-button {
  width: 70px;
  &.back {
    background-color: #627c80;
  }
}
</style>

<script>
import {mapState} from 'vuex'
import {convertSize, initDictFromList} from '../utils'

export default {
  name: 'SetmealCreate',
  data () {
    return {
      step: 0,
      periodList: ['month1', 'month2', 'month3', 'month6', 'month12'],
      discountList: [],
      resourceConfig: {
        instance: {
          min: 0,
          max: 10,
          configuration: {
            flavor_id: '',
            vcpus: 0,
            ram: 0,
          },
        },
        volume: {
          min: 0,
          max: 10,
          configuration: {
            volume_type: 'ssd',
            size: 0,
          },
        },
        floating_ip: {
          min: 0,
          max: 10,
          configuration: {
            line: '',
            ratelimit: 0,
          },
        },
        router: {
          min: 0,
          max: 1,
          configuration: {
            line: '',
            ratelimit: 0,
          },
        },
      },
      counter: {
        // init by this.created
      },
      resourcesDict: {
        // init by this.created
      },
      setmeal_resource_price: {
        // init by this.created
      },
      setmeal: {
        name: '',
        description: '',
        unlimited: true,
        limit: 1,
      },
      rules: {
        name: [
          { required: true, message: this.$t('Setmeal.popCreate.nameRequired'), trigger: 'blur' },
        ]
      },
      total_price: 0,
    }
  },
  props: ['visible'],
  computed: {
    ...mapState(['formLabelWidth']),
    discountPriceList () {
      return this.periodList.map((e, i) => {
        return this.total_price * 30 * e.replace('month', '') * this.discountList[i] / 100 
      })
    },
    volume_type () {
      return ['ssd', 'sata']
    },
    lineList () {
      return [{
        name: 'doubleLine',
      }, {
        name: '3LINE_BGP'
      }, {
        name: 'ALLLINE_BGP'
      }]
    },
    flavors () {
      return [{
        id: 'flavor1',
        name: 'flavorName1',
        vcpus: 1,
        ram: 512,
      }, {
        id: 'flavor2',
        name: 'flavorName2',
        vcpus: 1,
        ram: 1024,
      }, {
        id: 'flavor3',
        name: 'flavorName3',
        vcpus: 2,
        ram: 2048,
      }, {
        id: 'flavor4',
        name: 'flavorName4',
        vcpus: 3,
        ram: 4096,
      }]
    },
    flavorList () {
      return this.flavors.map(({id, name, vcpus, ram}) => {
        return {
          flavor_id: id,
          vcpus,
          ram,
          name: `${name} (${vcpus}vCPU/${convertSize(ram, 'M')})`,
        }
      })
    },
    flavorDict () {
      return this.initDictFromList(this.flavorList, 'flavor_id')
    },
    flavorCPU () {
      return Array.from(new Set(this.flavors.map(e => e.vcpus)))
    },
    stepLen () {
      return this.steps.length
    },
    stepName () {
      return this.steps[this.step]
    },
    steps () {
      return ['main', ...this.resourceNames, 'price']
    },
    resources () {
      let arr = []
      this.resourceNames.forEach(e => {
        this.resourcesDict[e].forEach(e2 => {
          arr.push({type: e, configuration: e2})
        })
      })
      return arr
    },
    resourceNames () {
      return Object.keys(this.resourceConfig)
    },
    defaultResource () {
      return {
        instance: this.flavorList[0],
        volume: {
          volume_type: this.volume_type[0],
          size: 50,
        },
        floating_ip: {
          line: this.lineList[0].name,
          ratelimit: 10,
        },
        router: {
          line: this.lineList[0].name,
          ratelimit: 10,
        },
      }
    },
  },
  methods: {
    convertSize,
    initDictFromList,
    convertSizeM (value) {
      return this.convertSize(value, 'M')
    },
    convertSizeG (value) {
      return this.convertSize(value, 'G')
    },
    updateFlavor (target, type) {
      if (type === 'flavor_id') {
        this.flavorList.some(e => {
          if (e.flavor_id === target.flavor_id) {
            target.vcpus = e.vcpus
            target.ram = e.ram
            return true
          }
        })
      } else if (type === 'vcpus') {
        this.flavorList.some(e => {
          if (e.vcpus === target.vcpus) {
            target.flavor_id = e.flavor_id
            target.ram = e.ram
            return true
          }
        })
      } else if (type === 'ram') {
        this.flavorList.some(e => {
          if (e.vcpus === target.vcpus && e.ram === target.ram) {
            target.flavor_id = e.flavor_id
            return true
          }
        })
      }
    },
    updateResourceCount (resourceType, newVal, oldVal) {
      let dict = this.resourcesDict[resourceType]
      let difference = newVal - oldVal
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          dict.push(Object.assign({}, this.defaultResource[resourceType]))
        }
      } else {
        dict.length = newVal
      }
    },
    back () {
      if (this.step > 0) {
        this.step--
      }
    },
    next () {
      if (this.step < this.stepLen - 1) {
        this.step++
        // 动态绑定价格可能很麻烦，我打算在跳转到价格页面时再手动计算
        if (this.step === this.stepLen - 1) {
          this.calcPrice()
        }
      }
    },
    resetPrice () {
      this.resourceNames.forEach(e => {
        this.$set(this.setmeal_resource_price, e, {total: 0, items: []})
      })
      this.total_price = 0
    },
    calcPrice () {
      this.resetPrice()
      this.resources.forEach(e => {
        let price = this._calcSinglePrice(e)
        let configDesc = this._initDescFromConfig(e.configuration)

        this.setmeal_resource_price[e.type].items.push({
          price,
          configDesc,
        })
        this.setmeal_resource_price[e.type].total += price
        this.total_price += price
      })
    },
    _calcSinglePrice (resource) {
      return 1
    },
    _initDescFromConfig (config) {
      let arr = []
      if ('flavor_id' in config) {
        arr.push(`${this.$t('flavor')}:
          ${this.flavorDict[config.flavor_id].name}`)
      }
      if ('volume_type' in config) {
        arr.push(`${this.$t('volume_type')}:
          ${this.$t(config.volume_type)}`)
      }
      if ('size' in config) {
        arr.push(`${this.$t('size')}:
          ${config.size} GB`)
      }
      if ('line' in config) {
        arr.push(`${this.$t('line')}:
          ${this.$t(config.line)}`)
      }
      if ('ratelimit' in config) {
        arr.push(`${this.$t('ratelimit')}:
          ${config.ratelimit} MB`)
      }
      return arr.join('; ')
    },
    create () {
      this.$refs['SetmealCreateForm'].validate((valid) => {
        if (valid) {
          let data = Object.assign({status: 'drafted'}, this.setmeal)
          this.$refs['SetmealCreateForm'].resetFields()
          this.$store.dispatch('createSetmeal', data)
          this.visible = false
        } else {
          return false
        }
      })
    },
  },
  watch: {
    visible (value) {
      if (!value) {
        this.$emit('done', 'create')
      }
    },
  },
  created () {
    this.resetPrice()
    // init counter and resourcesDict
    this.resourceNames.forEach(e => {
      this.$set(this.counter, e, 1)
      this.$set(this.resourcesDict, e, [Object.assign({}, this.defaultResource[e])])
      this.$watch(`counter.${e}`, function (newVal, oldVal) {
        this.updateResourceCount(e, newVal, oldVal)
      })
    })
    // init discountList
    this.periodList.forEach(e => {
      this.discountList.push(100)
    })
  },
}
</script>
