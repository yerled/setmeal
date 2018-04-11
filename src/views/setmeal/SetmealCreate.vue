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
      <SetmealInfoMain v-show="step === 0" :setmeal.sync="setmeal" :counter.sync="counter"></SetmealInfoMain>
      <SetmealInfoInstance v-show="step === 1" :instances.sync="resourcesDict.instance"></SetmealInfoInstance>
      <SetmealInfoVolume v-show="step === 2" :volumes.sync="resourcesDict.volume"></SetmealInfoVolume>
      <SetmealInfoLine v-show="step === 3" :lines.sync="resourcesDict.floating_ip" type="floating_ip"></SetmealInfoLine>
      <SetmealInfoLine v-show="step === 4" :lines.sync="resourcesDict.router" type="router"></SetmealInfoLine>
      <!-- <SetmealInfoPeriod v-show="step === 5" :info.sync="periods"></SetmealInfoPeriod> -->
    </div>
    <setmealPopButtons :step.sync="step" :stepLen="6" 
      @confirm="create"
      @validateInfoMain="validateInfoMain"></setmealPopButtons>
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
</style>

<script>
import SetmealInfoMain from './SetmealInfoMain'
import SetmealInfoInstance from './SetmealInfoInstance'
import SetmealInfoVolume from './SetmealInfoVolume'
import SetmealInfoLine from './SetmealInfoLine'
import SetmealInfoPeriod from './SetmealInfoPeriod'
import setmealPopButtons from './setmealPopButtons'

export default {
  name: 'SetmealCreate',
  components: {
    SetmealInfoMain,
    SetmealInfoInstance,
    SetmealInfoVolume,
    SetmealInfoLine,
    SetmealInfoPeriod,
    setmealPopButtons
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
      resourcesDict: {
        instance: [],
        volume: [],
        floating_ip: [],
        router: [],
      },
      instances: [],
      volumes: [],
      floating_ips: [],
      routers: [],
      periods: [],
    }
  },
  computed: {
    visible () {
      return this.$store.getters.SetmealPopVisible.create
    },
    steps () {
      return ['main', ...this.resourceNames, 'price']
    },
    resourceNames () {
      return Object.keys(this.defaultResource)
    },
    defaultResource () {
      let defaultFlavor = this.$store.getters.flavorList[0]
      let defaultVolumeType = this.$store.getters.volumeTypeList[0]
      let defaultLine = this.$store.getters.lineList[0]
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
    total_price () {
      return 0
    },
    limit () {
      return setmeal.unlimited ? 0 : setmeal.limitNumber
    },
    dataForCommit () {
      let set_meal = {
        name: this.setmeal.name,
        description: this.setmeal.description,
        limit: this.limit,
        price: total_price,
      }

      let resources = []
      this.resourceNames.forEach(e => {
        this.resourcesDict[e].forEach(ee => {
          let e2 = Object.assign({}, ee)
          resources.push({
            type: e,
            configuration: JSON.stringify(e2.configuration),
            price: e2.price,
          })
        })
      })

      let periods = this.set_meal_periods.map((e, i) => {
        return {
          period: e.period,
          discount: e.discount / 100,
          discount_price: this.discount_price[i],
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
    close () {
      this.$store.commit('updateSetmealPopVisible', {name: 'create', visible: false})
    },
    validateInfoMain () {
      let form = this.$children[0].$children[2].$refs['SetmealInfoMain']
      form.validate((valid) => {
        if (valid) {
          this.step++
        } else {
          return false
        }
      })
    },
    confirm () {

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
    create () {
      this.$store.dispatch('CreateSetmeal', this.dataForCommit)
        .then(res => {
          this.refreshTable()
          this.close()
          this.$refs['SetmealCreateForm'].resetFields()
        }).catch(err => {
          console.log(err)
          this.errorTip = this.$t('createFailed')
        })
    },
  },
  created () {
    this.resourceNames.forEach(e => {
      this.$watch(`counter.${e}.value`, function (newVal, oldVal) {
        this.updateResourceCount(e, newVal, oldVal)
      })
      this.counter[e].value = 1
    })
  },
}
</script>
