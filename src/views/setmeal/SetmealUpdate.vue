<template>
  <el-dialog  width="800px"
      :title="$t(`Setmeal.pop.update.title`)"
      :close-on-click-modal="false"
      :visible="visible"
      @close="close">
    <el-steps finish-status="success" :active="step" v-if="!onlyUpdatePeriod">
      <el-step v-for="item of steps"
        :key="item"
        :title="$t(`Setmeal.pop.step_${item}`)">
      </el-step>
    </el-steps>
    <el-alert :type="tip.type" v-show="tip.content" :title="tip.content" show-icon :closable="false"></el-alert>
    <div class="body">
      <template v-if="!onlyUpdatePeriod">
        <SetmealInfoMain ref="mainForm" v-show="step === 0" :setmeal.sync="setmeal" :counter.sync="counter"></SetmealInfoMain>
        <SetmealInfoInstance v-show="step === 1" :instances.sync="resourceDict.instance"></SetmealInfoInstance>
        <SetmealInfoVolume v-show="step === 2" :volumes.sync="resourceDict.volume"></SetmealInfoVolume>
        <SetmealInfoLine v-show="step === 3" :lines.sync="resourceDict.floating_ip" type="floating_ip"></SetmealInfoLine>
        <SetmealInfoLine v-show="step === 4" :lines.sync="resourceDict.router" type="router"></SetmealInfoLine>
        <SetmealInfoResource v-show="step === 5" :dict="resourcePriceDict"></SetmealInfoResource>
      </template>
        <SetmealInfoPeriod v-show="step === 5" :periods.sync="periods" :totalPrice="totalPrice" :discountPrice="discountPrice"></SetmealInfoPeriod>
    </div>
    <!-- <div slot="footer">
      <el-button type="primary" @click="update">{{$t('confirm')}}</el-button>
    </div> -->
    <setmealPopButtons :step.sync="step" :stepLen="6" slot="footer" :hideStep="true"
      @confirm="update"
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
import SetmealCreate from './SetmealCreate'

export default {
  name: 'SetmealUpdate',
  extends: SetmealCreate,
  data () {
    return {
      rawData: {},
      unwatchCounter: false,
    }
  },
  computed: {
    id () {
      return this.rawData.set_meal_id || this.rawData.set_meal.id
    },
    visible () {
      return this.$store.getters.SetmealPopVisible.update
    },
    onlyUpdatePeriod () {
      return this.rawData.status === 'off_shelve'
    },
  },
  methods: {
    update () {
      this.$store.dispatch('UpdateSetmeal', {
        id: this.rawData.set_meal_id,
        data: this.dataForCommit
      }).then(res => {
        this.refreshTable()
        this.close()
      }).catch(err => {
        console.log(err)
        this.tip.content = this.$t('createFailed')
      })
    },
    initData (data) {
      if (data) {
        this.rawData = data
      }
      let rawData = this.rawData
      this.step = 0
      this.setmeal = {
        name: rawData.name,
        description: rawData.description,
        unlimited: rawData.limit === 0,
        limitNumber: rawData.limit,
      }
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
      rawData.resources.forEach(e => {
        this.counter[e.type].value++

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
    },
    close () {
      this.$store.commit('updateSetmealPopVisible', {name: 'update', visible: false})
    },
    init () {
      this.resourceNames.forEach(e => {
        this.$watch(`counter.${e}.value`, function (newVal, oldVal) {
          if (!this.unwatchCounter) {
            this.updateResourceCount(e, newVal, oldVal)
          }
        })
      })
    },
  },
}
</script>
