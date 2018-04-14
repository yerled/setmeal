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
    <SetmealPurchaseAllocation :instances="instances"></SetmealPurchaseAllocation>
    <!-- <SetmealPurchaseCheck></SetmealPurchaseCheck> -->
    <SetmealPopButtons :step.sync="step" :stepLen="steps.length" slot="footer"
      @confirm="purchase"
      @validateInfoMain="validateInfoMain">
    </SetmealPopButtons>
  </el-dialog>
</template>

<style lang="less" scoped>
.el-steps {
  width: 90%;
  margin: 0 auto;
}
</style>

<script>
import SetmealPurchaseAllocation from './SetmealPurchaseAllocation'
// import SetmealPurchaseCheck from './SetmealPurchaseCheck'
import SetmealPopButtons from './SetmealPopButtons'
import { mapGetters } from 'vuex'

export default {
  name: 'SetmealPurchase',
  components: {
    SetmealPurchaseAllocation,
    // SetmealPurchaseCheck,
    SetmealPopButtons,
  },
  data () {
    return {
      step: 0,
      tip: {
        type: 'error',
        content: '',
      },
      resourceDict: {
        volume: [],
        floating_ip: [],
        router: [],
      },
      instances: [],
      rawData: {},
    }
  },
  computed: {
    ...mapGetters(['subnetList', 'systemImageList', 'snapImageList', 'keytList']),
    visible () {
      return this.$store.getters.SetmealPopVisible.purchase
    },
    steps () {
      return ['allocation', 'purchase']
    },
    dataForCommit () {
      return {}
    },
    defualtInstance () {
      let defaultSubnet = this.subnetList[0] || {}
      let defaultSystemImage = this.systemImageList[0] || {}
      let defaultSnapImage = this.snapImageList[0] || {}
      let defualtKeyt = this.keytList[0] || {}
      return {
        isSystemImage: true,
        systemImage: defaultSystemImage.id,
        snapImage: defaultSnapImage.id,
        subnet_id: defaultSubnet.id,
        isPassword: true,
        password: '',
        keyt: defualtKeyt.id,
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

      /* infoResource and instances */
      this.resourceDict = {
        volume: [],
        floating_ip: [],
        router: [],
      }
      rawData.resources.forEach(e => {
        if (e.type === 'instance') {
          this.instances.push(JSON.parse(JSON.stringify(this.defualtInstance)))
          return
        }
        if (typeof e.configuration === 'string') {
          e.configuration = JSON.parse(e.configuration)
        }
        let obj = {
          name: this.resourceDict[e.type].length + 1,
          type: e.type,
          configuration: e.configuration,
          configDesc: this._initConfigDesc(e.configuration)
        }
        this.resourceDict[e.type].push(obj)
      })

      /* infoPeriod */
      let periods = []
      rawData.periods.forEach(e => {
        periods.push({
          period: e.period,
          discount: e.discount * 100
        })
      })
      this.periods = periods
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
    validateInfoMain () {
      let form = this.$refs.mainForm.$refs.SetmealInfoMain
      form.validate((valid) => {
        if (valid) {
          this.step++
        } else {
          return false
        }
      })
    },
    purchase () {
      this.$store.dispatch('PurchaseSetmeal', this.dataForCommit).then(res => {
        // this.refreshTable()
        this.close()
        this.$message.success(this.$t('purchaseSuccess'))
      }).catch(err => {
        console.log(err)
        this.tip.content = this.$t('purchaseFailed')
      })
    },
    close () {
      this.$store.commit('updateSetmealPopVisible', {name: 'purchase', visible: false})
    },
  }
}
</script>
