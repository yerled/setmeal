<template>
  <el-dialog  width="800px"
    :title="$t(`Record.pop.renewal.title`)"
    :close-on-click-modal="false"
    :visible="visible"
    @close="close">
    <el-alert :type="tip.type" v-show="tip.content" :title="tip.content" show-icon :closable="false"></el-alert>
    <div class="body">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" :label="$t('period')">
          <el-select v-model="form.period">
            <el-option v-for="period of periods"
              :key="period.period_id"
              :value="period.period_id"
              :label="period.desc">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('Record.auto_renewal')">
          <el-switch v-model="form.auto_renewal"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="renewal">{{$t('confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      tip: {
        type: '',
        content: '',
      },
      form: {
        period: '',
      },
      rawdata: {
        
      },
    }
  },
  computed: {
    ...mapState(['formLabelWidth']),
    visible () {
      return this.$store.getters.RecordPopVisible.renewal
    },
    dataForCommit () {
      return {}
    },
  },
  methods: {
    close () {
      this.$store.commit('updateRecordPopVisible', {name: 'renewal', visible: false})
    },
    initData (data) {
      if (data) {
        this.rawData = data
      }
      let rawData = this.rawData

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
    renewal () {
      this.$store.dispatch('UpdateRenewal', {
        id: this.rawdata.user_set_meal_id,
        data: this.dataForCommit,
      }).then(res => {
        this.$message.success(this.$t('RenewalSuccess'))
        this.refreshTable()
        this.close()
        this.reset()
      }).catch(err => {
        console.log(err)
        this.tip.content = this.$t('RenewalFailed')
      })
    },
  }
}
</script>
