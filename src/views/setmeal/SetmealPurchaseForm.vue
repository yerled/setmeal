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
    <el-form-item :label-width="formLabelWidth" :label="$t('Setmeal.auto_renewal')">
      <el-switch v-model="form.auto_renewal"></el-switch>
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
