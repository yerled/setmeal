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
        <el-card class="box-card"
          v-for="(resource, index) of resourcesArr"
          :key="index">
          <div slot="header" class="clearfix">
            <span>{{$t(`resource.${resourceType}`) + ' ' + (index + 1)}}</span>
          </div>
          <el-form :model="resource">
            <el-form-item :label="$t('resource.flavor')"
              v-if="'flavor_id' in resourceConfig[resourceType].configuration"
              :label-width="formLabelWidth">
              <el-select v-model="resource.flavor_id">
                <el-option
                  v-for="item in flavors"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('resource.volume_type')"
              v-if="'type' in resourceConfig[resourceType].configuration"
              :label-width="formLabelWidth">
              <el-select v-model="resource.type">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('resource.size')"
              v-if="'size' in resourceConfig[resourceType].configuration"
              :label-width="formLabelWidth">
              <el-select v-model="resource.size">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('resource.line')"
              v-if="'line' in resourceConfig[resourceType].configuration"
              :label-width="formLabelWidth">
              <el-select v-model="resource.type">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('resource.ratelimit')"
              v-if="'ratelimit' in resourceConfig[resourceType].configuration"
              :label-width="formLabelWidth">
              <el-select v-model="resource.type">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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

export default {
  name: 'SetmealCreate',
  data () {
    return {
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
      }],
      step: 0,
      resourceConfig: {
        instance: {
          min: 0,
          max: 10,
          configuration: {
            flavor_id: 'flavor_id  demo',
          },
        },
        volume: {
          min: 0,
          max: 10,
          configuration: {
            type: '',
            size: 0,
          },
        },
        floating_ip: {
          min: 0,
          max: 10,
          configuration: {
            line: '',
            ratelimit: '',
          },
        },
        router: {
          min: 0,
          max: 1,
          configuration: {
            line: '',
            ratelimit: '',
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
    flavorCPU () {

    },
    flavorRAM () {
      let obj = {}
      this.flavors.forEach(e => {
        if (!(e.vcpus in obj)) {
          obj[e.vcpus] = []
        }
        obj[e.vcpus].push()
      })
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
  },
  methods: {
    updateResourceCount (resourceType, newVal, oldVal) {
      let dict = this.resourcesDict[resourceType]
      let difference = newVal - oldVal
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          dict.push(this.resourceConfig[resourceType])
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
      this.$set(this.counter, e, 0)
      this.$set(this.resourcesDict, e, [])
      this.$watch(`counter.${e}`, function (newVal, oldVal) {
        this.updateResourceCount(e, newVal, oldVal)
      })
    })
  },
}
</script>
