<template>
  <el-dialog  width="600px"
    :title="$t(`Record.pop.updateRenewal.title`)"
    :close-on-click-modal="false"
    :visible="visible"
    @close="close">
    <el-alert :type="tip.type" v-show="tip.content" :title="tip.content" show-icon :closable="false"></el-alert>
    <div class="body">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" :label="$t('Record.expire_dispose')">
          <el-radio-group v-model="form.expire_dispose" class="column-radio">
            <el-radio label="auto_renewal">{{$t('Record.desc_auto_renewal')}}</el-radio>
            <el-radio label="deleted">{{$t('Record.desc_deleted')}}</el-radio>
            <el-radio label="recover">{{$t('Record.desc_recover')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('period')" v-show="form.expire_dispose === 'auto_renewal'">
          <el-select v-model="form.period">
            <el-option v-for="period of periods"
              :key="period.period_id"
              :value="period.period_id"
              :label="period.desc">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="updateRenewal" :loading="loading">{{$t('confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      tip: {
        type: 'error',
        content: '',
      },
      form: {
        period: '',
        expire_dispose: '',
      },
      rawData: {
        
      },
      periods: [],
      loading: false,
    }
  },
  computed: {
    ...mapState(['formLabelWidth']),
    visible () {
      return this.$store.getters.RecordPopVisible.updateRenewal
    },
    dataForCommit () {
      let expire_dispose = this.form.expire_dispose
      let data = { expire_dispose }
      if (expire_dispose === 'auto_renewal') {
        data.period_id = this.period
      }
      return data
    },
  },
  methods: {
    close () {
      this.$store.commit('updateRecordPopVisible', {name: 'updateRenewal', visible: false})
    },
    async initData (data) {
      if (data) {
        this.rawData = data
      }
      let rawData = this.rawData

      /* infoPeriod */
      let res = await this.$store.dispatch('SelectRecordDetail', rawData.user_set_meal_id)
      if (res.data && res.data.periods) {
        this.periods = res.data.periods.map(e => {
          return {
            period_id: e.period_id,
            desc: `${this.$t(`periodMonth${e.period}`)} ￥${e.discount_price} ${this.$t('rmb')}`
          }
        })
        this.form.period = res.data.renewal_period_id
        // this.form.expire_dispose = res.data.expire_dispose
      }
    },
    updateRenewal () {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$store.dispatch('UpdateRenewal', {
        id: this.rawData.user_set_meal_id,
        data: this.dataForCommit,
      }).then(res => {
        this.$message.success(this.$t('updateRenewalSuccess'))
        this.refreshTable()
        this.close()
      }).catch(err => {
        console.log(err)
        this.tip.content = this.$t('updateRenewalFailed')
      }).finally(res => {
        this.loading = false
      })
    },
    refreshTable () {
      this.$store.dispatch('SelectRecordList')
    },
  }
}
</script>
