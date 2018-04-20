<template>
  <el-dialog  width="800px"
      :title="$t(`Setmeal.pop.purchase.title`)"
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
      <SetmealPurChaseAllocateInstance v-show="step === 0" ref="instanceForms" :instances="instances"></SetmealPurChaseAllocateInstance>
      <SetmealPurChaseAllocateOther  v-show="step === 1" ref="otherForms" :resources="resources"></SetmealPurChaseAllocateOther>
      <el-alert type="info" v-show="step === 2"
        :title="$t('Setmeal.expiration_rules')" 
        :description="$t('Setmeal.expiration_rules_desc')"></el-alert>
      <SetmealPurChaseForm v-show="step === 2" ref="mainForm" :form="form" :periods="periods"></SetmealPurChaseForm>
    </div>
    <SetmealPopButtons slot="footer" :step.sync="step" :stepLen="steps.length" :loading="loading"
      @confirm="purchase"
      @next="stepNext">
    </SetmealPopButtons>
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
.body2 {
  height: 210px;
}
</style>

<script>
import SetmealPurChaseAllocateInstance from './SetmealPurChaseAllocateInstance'
import SetmealPurChaseAllocateOther from './SetmealPurChaseAllocateOther'
import SetmealPurChaseForm from './SetmealPurChaseForm'
import SetmealPopButtons from './SetmealPopButtons'
import { mapGetters } from 'vuex'

export default {
  name: 'SetmealPurchase',
  components: {
    SetmealPurChaseAllocateInstance,
    SetmealPurChaseAllocateOther,
    SetmealPurChaseForm,
    SetmealPopButtons,
  },
  data () {
    return {
      step: 0,
      tip: {
        type: 'error',
        content: '',
      },
      instances: [],
      resources: [],
      form: {
        auto_renewal: true,
        period: 1,
      },
      periods: [],
      rawData: {},
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['subnetList', 'flavorList', 'flavorDict', 'lineDict', 'subnetDict',
      'imageDict', 'systemImageList', 'snapImageList', 'keytList']),
    visible () {
      return this.$store.getters.SetmealPopVisible.purchase
    },
    steps () {
      return ['allocateInstance', 'allocateOther', 'purchase']
    },
    dataForCommit () {
      let server = this.instances.map(e => {
        let imageRef = e.isSystemImage ? e.systemImage : e.snapImage
        let image = this.imageDict[imageRef]
        let subnet_id = e.subnet_id
        let subnet = this.subnetDict[subnet_id]
        let result = {
          set_meal_resource_id: e.set_meal_resource_id,
          display_name: e.name,
          imageRef,
          metadata: {
            image_name: image.name,
            image_label: image.image_label,
          },
          networks: [{
            uuid: subnet.network_id,
            subnet_id,
          }],
          min_count: 1,
          max_count: 1,
        }
        if (e.isKeyt) {
          result.key_name = e.keyt
        } else {
          result.admin_pass = e.password
        }
        return result
      })
      
      let volume = []
      let router = []
      let floatingip = []
      // eslint-disable-next-line
      this.resources.forEach(({type, name, set_meal_resource_id, configuration}) => {
        if (type === 'volume') {
          volume.push({
            set_meal_resource_id,
            display_name: name,
            display_description: '',
          })
        } else if (type === 'floating_ip') {
          let subnet = this.lineDict[configuration.line][0]
          floatingip.push({
            set_meal_resource_id,
            floating_network_id: subnet.network_id,
            subnet_id: subnet.id,
          })
        } else if (type === 'router') {
          router.push({
            set_meal_resource_id,
            display_name: name,
            admin_state_up: true,
          })
        }
      })

      return {
        period_id: this.form.period,
        auto_renewal: this.form.auto_renewal,
        server,
        volume,
        router,
        floatingip,
      }
    },
    defualtInstance () {
      let defaultSubnet = this.subnetList[0] || {}
      let defaultSystemImage = this.systemImageList[0] || {}
      let defaultSnapImage = this.snapImageList[0] || {}
      let defualtKeyt = this.keytList[0] || {}
      return {
        isSystemImage: false,
        systemImage: defaultSystemImage.id,
        snapImage: defaultSnapImage.id,
        subnet_id: defaultSubnet.id,
        isKeyt: true,
        isWindows: defaultSystemImage.image_label && 
          defaultSystemImage.image_label.toLowerCase() === 'windows',
        password: '',
        keyt: defualtKeyt.name,
      }
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

      /* instances and resources */
      this.instances = []
      this.resources = []
      let counter = {
        instance: 0,
        volume: 0,
        floating_ip: 0,
        router: 0,
      }
      rawData.resources.forEach(e => {
        counter[e.type]++
        if (typeof e.configuration === 'string') {
          e.configuration = JSON.parse(e.configuration)
        }
        let configDesc = this._initConfigDesc(e.configuration)

        let defaultName = `${this.$t(e.type)}-${counter[e.type]}`
        if (e.type === 'instance') {
          let defaultInstance = JSON.parse(JSON.stringify(this.defualtInstance))
          defaultInstance.name = defaultName
          defaultInstance.configDesc = configDesc
          defaultInstance.set_meal_resource_id = e.set_meal_resource_id
          this.instances.push(defaultInstance)
          return
        }

        let obj = {
          name: defaultName,
          type: e.type,
          set_meal_resource_id: e.set_meal_resource_id,
          configuration: e.configuration,
          configDesc: configDesc
        }
        this.resources.push(obj)
      })

      /* infoPeriod */
      let periods = []
      rawData.periods.forEach(e => {
        periods.push({
          period_id: e.period_id,
          desc: `${this.$t(`periodMonth${e.period}`)} ￥${e.discount_price} ${this.$t('rmb')}`
        })
      })
      this.periods = periods
      this.form.period = this.periods[0].period_id
    },
    _initConfigDesc (config) {
      let arr = []
      if ('flavor_id' in config) {
        let flavor = this.flavorDict[config.flavor_id]
        arr.push(flavor ? flavor.__desc : config.flavor_id)
      }
      if ('volume_type' in config) {
        arr.push(this.$t(config.volume_type))
      }
      if ('size' in config) {
        arr.push(`${config.size}GB`)
      }
      if ('line' in config) {
        arr.push(this.$t(config.line))
      }
      if ('ratelimit' in config) {
        arr.push(`${config.ratelimit}MB`)
      }
      return arr.join('  ')
    },
    stepNext () {
      if (this.step === 0) {
        let instanceFormDict = this.$refs.instanceForms.$refs
        let instanceValid = Object.keys(instanceFormDict).every(e => {
          let singleValid
          // yerled instanceFormDict: {form0: Array(1), form1: Array(1)}
          instanceFormDict[e][0].validate((valid) => {
            singleValid = valid
          })
          return singleValid
        })

        if (instanceValid) {
          this.step++
        }
      } else if (this.step === 1) {
        let otherFormDict = this.$refs.otherForms.$refs
        let otherValid = Object.keys(otherFormDict).every(e => {
          let singleValid
          // yerled 同上
          otherFormDict[e][0].validate((valid) => {
            singleValid = valid
          })
          return singleValid
        })

        if (otherValid) {
          this.step++
        }
      } else if (this.step < this.stepLen - 1) {
        this.step++
      }
    },
    purchase () {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$store.dispatch('PurchaseSetmeal', this.dataForCommit).then(res => {
        // this.refreshTable()
        this.close()
        this.$message.success(this.$t('Setmeal.purchaseSuccess'))
      }).catch(err => {
        console.log(err)
        this.tip.content = this.$t('Setmeal.purchaseFailed')
      }).finally(res => {
        this.loading = false
      })
    },
    close () {
      this.$store.commit('updateSetmealPopVisible', {name: 'purchase', visible: false})
    },
  }
}
</script>
