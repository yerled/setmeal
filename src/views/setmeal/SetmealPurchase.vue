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
    <SetmealPopButtons :step.sync="step" :stepLen="steps.length" slot="footer"
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
    }
  },
  computed: {
    ...mapGetters(['subnetList', 'systemImageList', 'snapImageList', 'keytList']),

    visible () {
      return this.$store.getters.SetmealPopVisible.purchase
    },
    steps () {
      return ['allocateInstance', 'allocateOther', 'purchase']
    },
    dataForCommit () {
      let instance = this.instances.map(e => {
        return {
          set_meal_resource_id: e.set_meal_resource_id,
          name: e.name,
          image: e.isSystemImage ? e.systemImage : e.snapImage,
          subnet: e.subnet_id,
          password: e.isPassword ? this.password : e.keyt,
        }
      })
      
      let volume = []
      let router = []
      let floatingip = []
      this.resources.forEach(({type, name, set_meal_resource_id}) => {
        let obj = {name, set_meal_resource_id}
        if (type === 'volume') {
          volume.push(obj)
        } else if (type === 'floating_ip') {
          floatingip.push({set_meal_resource_id})
        } else if (type === 'router') {
          router.push(obj)
        }
      })

      return {
        period_id: this.form.period,
        auto_renewal: this.form.auto_renewal,
        instance,
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
        isPassword: true,
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

      /* instances and resources */
      this.instances = []
      this.resources = []
      rawData.resources.forEach(e => {
        let defaultName = `${this.$t(e.type)}-1`
        if (e.type === 'instance') {
          let defaultInstance = JSON.parse(JSON.stringify(this.defualtInstance))
          defaultInstance.name = defaultName
          defaultInstance.set_meal_resource_id = e.set_meal_resource_id
          this.instances.push(defaultInstance)
          return
        }

        if (typeof e.configuration === 'string') {
          e.configuration = JSON.parse(e.configuration)
        }
        let obj = {
          name: defaultName,
          type: e.type,
          set_meal_resource_id: e.set_meal_resource_id,
          configuration: e.configuration,
          configDesc: this._initConfigDesc(e.configuration)
        }
        this.resources.push(obj)
      })

      /* infoPeriod */
      let periods = []
      rawData.periods.forEach(e => {
        periods.push({
          period_id: e.period_id,
          desc: `${this.$t(`month${e.period}`)}  ￥${e.discount_price} ${this.$t('rmb')}`
        })
      })
      this.periods = periods
      this.form.period = this.periods[0].period_id
    },
    _initConfigDesc (config) {
      let arr = []
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
      this.$store.dispatch('PurchaseSetmeal', this.dataForCommit).then(res => {
        // this.refreshTable()
        this.close()
        this.$message.success(this.$t('Setmeal.purchaseSuccess'))
      }).catch(err => {
        console.log(err)
        this.tip.content = this.$t('Setmeal.purchaseFailed')
      })
    },
    close () {
      this.$store.commit('updateSetmealPopVisible', {name: 'purchase', visible: false})
    },
  }
}
</script>
