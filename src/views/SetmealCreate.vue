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
          <el-form-item :label="$t('Setmeal.popCreate.desc')"
            :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="2"
              v-model="setmeal.desc">
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
          <el-form-item :label="$t(`Setmeal.popCreate.counter.${key}`)"
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
            <label>{{$t(`resource.${resourceType}`) + ' ' + (index + 1)}}</label>
          </div>
          <el-form :model="resource">
            <template v-if="'flavor_id' in resourceConfig[resourceType].configuration">
              <el-form-item :label="$t('resource.flavor')"
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
              :label="$t('resource.volume_type')"
              :label-width="formLabelWidth">
              <el-radio-group size="medium" class="tab-radio-group"
                v-model="resource.volume_type">
                <el-radio-button v-for="type of volume_type"
                  :key="type"
                  :label="type">{{$t(`resource.${type}`)}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="'size' in resourceConfig[resourceType].configuration"
              :label="`${$t('resource.size')}(G)`"
              :label-width="formLabelWidth">
              <el-slider show-input
                v-model="resource.size"
                :format-tooltip="convertSizeG"
                :min="10" :max="860">
              </el-slider>
            </el-form-item>
            <el-form-item v-if="'line' in resourceConfig[resourceType].configuration"
              :label="$t('resource.line')"
              :label-width="formLabelWidth">
              <el-select v-model="resource.line">
                <el-option
                  v-for="line in lineList"
                  :key="line.name"
                  :label="$t(`resource.${line.name}`)"
                  :value="line.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="'ratelimit' in resourceConfig[resourceType].configuration"
              :label="`${$t('resource.ratelimit')}(M)`"
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
    </div>
    <div slot="footer">
      <el-button class="back" v-show="step > 0" @click="back">{{$t('Setmeal.popCreate.back')}}</el-button>
      <el-button v-show="step < stepLen - 1" @click="next">{{$t('Setmeal.popCreate.next')}}</el-button>
      <el-button type="primary" v-show="step > stepLen - 2" @click="create">{{$t('Setmeal.popCreate.confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<style lang="less" scoped>
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
import {convertSize} from '../utils'

export default {
  name: 'SetmealCreate',
  data () {
    return {
      step: 0,
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
      setmeal: {
        name: '',
        desc: '',
        unlimited: true,
        limit: 1,
      },
      price: [],
      rules: {
        name: [
          { required: true, message: this.$t('Setmeal.popCreate.nameRequired'), trigger: 'blur' },
        ]
      },
    }
  },
  props: ['visible'],
  computed: {
    ...mapState(['formLabelWidth']),
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
      }, ]
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
        arr = arr.concat(this.resourcesDict[e])
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
      }
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
    // init counter and resourcesDict
    this.resourceNames.forEach(e => {
      this.$set(this.counter, e, 1)
      this.$set(this.resourcesDict, e, [Object.assign({}, this.defaultResource[e])])
      this.$watch(`counter.${e}`, function (newVal, oldVal) {
        this.updateResourceCount(e, newVal, oldVal)
      })
    })
  },
}
</script>
