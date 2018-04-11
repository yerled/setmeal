<template>
  <el-dialog  width="800px"
    :title="$t('Setmeal.popCreate.title')"
    :close-on-click-modal="false"
    :visible="visible"
    @close="close">
    <el-steps :active="step" finish-status="success">
      <el-step v-for="item of steps"
        :key="item"
        :title="$t(`Setmeal.popCreate.step_${item}`)">
      </el-step>
    </el-steps>
    <el-alert type="error" v-show="errorTip" :title="errorTip" show-icon :closable="false"></el-alert>
    <div class="body">
      <div class="item main" v-show="stepName === 'main'">
        <el-form ref="SetmealCreateForm"
          :model="setmeal"
          :rules="rules">
          <el-form-item :label="$t('Setmeal.name')" prop="name"
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
          <el-form-item :label="$t('Setmeal.limit')"
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
          <el-form-item :label="$t(`Setmeal.${type}_count`)"
            :label-width="formLabelWidth"
            v-for="(item, type) of counter"
            :key="type">
            <el-input-number
              v-model="item.value"
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
            <template v-if="'flavor_id' in resource.configuration">
              <el-form-item :label="$t('flavor')"
                :label-width="formLabelWidth">
                <el-select
                  v-model="resource.configuration.flavor_id"
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
            <el-form-item v-if="'volume_type' in resource.configuration"
              :label="$t('volume_type')"
              :label-width="formLabelWidth">
              <el-radio-group size="medium" class="tab-radio-group"
                v-model="resource.configuration.volume_type">
                <el-radio-button v-for="type of volume_type"
                  :key="type"
                  :label="type">{{$t(type)}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="'size' in resource.configuration"
              :label="`${$t('size')}(G)`"
              :label-width="formLabelWidth">
              <el-slider show-input
                v-model="resource.configuration.size"
                :format-tooltip="convertSizeG"
                :min="10" :max="860">
              </el-slider>
            </el-form-item>
            <el-form-item v-if="'line' in resource.configuration"
              :label="$t('line')"
              :label-width="formLabelWidth">
              <el-select v-model="resource.configuration.line">
                <el-option
                  v-for="line in lineList"
                  :key="line.name"
                  :label="$t(line.name)"
                  :value="line.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="'ratelimit' in resource.configuration"
              :label="`${$t('ratelimit')}(M)`"
              :label-width="formLabelWidth">
              <el-slider show-input
                v-model="resource.configuration.ratelimit"
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
      errorTip: '',
      set_meal_periods: [{
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
      }],
      discountList: [],
      counter: {
        instance: {
          value: 1,
          min: 0,
          max: 10,
        },
        volume: {
          value: 1,
          min: 0,
          max: 10,
        },
        floating_ip: {
          value: 1,
          min: 0,
          max: 10,
        },
        router: {
          value: 1,
          min: 0,
          max: 1,
        },
      },
      resourcesDict: {
        // init by this.created
      },
      setmeal: {
        name: '',
        description: '',
        unlimited: true,
        price: 0,
        limit: 1,
      },
      rules: {
        name: [
          { required: true, message: this.$t('Setmeal.popCreate.nameRequired'), trigger: 'blur' },
        ]
      },
    }
  },
  computed: {
    ...mapState({
      formLabelWidth: 'formLabelWidth',
      flavors: 'flavors',
    }),
    flavorList () {
      return this.$store.getters.flavorList.map(e => {
        e.name = e.__nameAndDesc
        return e
      })
    },
    visible () {
      return this.$store.getters.SetmealPopVisible.create
    },
    discount_price () {
      return this.set_meal_periods.map(e => {
        return this.setmeal.price * 30 * e.period * e.discount / 100
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
    resourceNames () {
      return Object.keys(this.defaultResource)
    },
    defaultResource () {
      let defaultFlavor = this.flavorList[0]
      let defaultVolumeType = this.volume_type[0]
      let defaultLine = this.lineList[0]
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
          if (e.flavor_id === target.configuration.flavor_id) {
            target.vcpus = e.vcpus
            target.ram = e.ram
            return true
          }
        })
      } else if (type === 'vcpus') {
        this.flavorList.some(e => {
          if (e.vcpus === target.vcpus) {
            target.configuration.flavor_id = e.flavor_id
            target.ram = e.ram
            return true
          }
        })
      } else if (type === 'ram') {
        this.flavorList.some(e => {
          if (e.vcpus === target.vcpus && e.ram === target.ram) {
            target.configuration.flavor_id = e.flavor_id
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
          dict.push(JSON.parse(JSON.stringify(this.defaultResource[resourceType])))
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
      if (this.step === 0) {
        this.$refs['SetmealCreateForm'].validate((valid) => {
          if (valid) {
            this.step++
          } else {
            return false
          }
        })
      } else if (this.step < this.stepLen - 1) {
        this.step++
        // 动态绑定价格可能很麻烦，我打算在跳转到价格页面时再手动计算
        if (this.step === this.stepLen - 1) {
          this.calcPrice()
        }
      }
    },
    calcPrice () {
      this.setmeal.price = 0
      this.resourceNames.forEach(type => {
        let resourceArr = this.resourcesDict[type]
        resourceArr.price = 0
        resourceArr.forEach(e => {
          e.price = this._calcSinglePrice(e.configuration)
          e.configDesc = this._initConfigDesc(e.configuration)
          resourceArr.price += e.price
          this.setmeal.price += e.price
        })
      })
    },
    _calcSinglePrice (resource) {
      return 1
    },
    _initConfigDesc (config) {
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
      // this.$refs['SetmealCreateForm'].resetFields()
      let data = this.generateData()
      this.$store.dispatch('createSetmeal', data)
      this.errorTip = this.$t('createFailed')
      // this.close()
    },
    generateData () {
      let set_meal = {
        name: this.setmeal.name,
        price: this.setmeal.price,
        description: this.setmeal.description,
        limit: this.setmeal.unlimited ? 0 : this.setmeal.limit,
      }

      let set_meal_resources = []
      this.resourceNames.forEach(e => {
        this.resourcesDict[e].forEach(e2 => {
          set_meal_resources.push({
            type: e,
            configuration: Object.assign({}, e2.configuration),
            price: e2.price,
          })
        })
      })
      let set_meal_periods = this.set_meal_periods.map((e, i) => {
        return {
          period: e.period,
          discount: e.discount / 100,
          discount_price: this.discount_price[i],
        }
      })

      return {
        set_meal,
        set_meal_resources,
        set_meal_periods,
      }
    },
    close () {
      this.$store.commit('updateSetmealPopVisible', {name: 'create', visible: false})
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
    this.resourceNames.forEach(e => {
      this.$set(this.resourcesDict, e, [Object.assign({}, this.defaultResource[e])])
      this.$watch(`counter.${e}.value`, function (newVal, oldVal) {
        this.updateResourceCount(e, newVal, oldVal)
      })
    })
  },
}
</script>
