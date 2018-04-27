<template>
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
    <el-form-item :label-width="formLabelWidth" :label="$t('IssueSetmeal.expire_dispose')">
      <el-radio-group v-model="form.expire_dispose" class="column-radio">
        <el-radio label="auto_renewal">{{$t('IssueSetmeal.desc_auto_renewal')}}</el-radio>
        <el-radio label="deleted">{{$t('IssueSetmeal.desc_deleted')}}</el-radio>
        <el-radio label="recover">{{$t('IssueSetmeal.desc_recover')}}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'SetmealPurchaseForm',
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      formLabelWidth: 'formLabelWidth',
    }),
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
    periods: {
      type: Array,
      required: true,
    },
  }
}
</script>
