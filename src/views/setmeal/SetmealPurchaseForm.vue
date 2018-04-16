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
    <!-- <el-form-item :label-width="formLabelWidth" :label="$t('Setmeal.expiration_rules')">
      <span class="desc">
        1、实例欠费或到期停机后，实例将进入回收期，即，实例的计算资源（vCPU+内存）不再保留，但云盘数据和分配的公网IP地址会保留15天（自停机当日算起）；
        2、实例欠费或到期15天后，实例会全部释放，数据和IP地址将无法找回；
        3、本地磁盘数据欠费或到期后的保留时间仍为7天。停机7天后，本地盘数据将随计算资源一起释放不再保留；分配的IP地址及挂载到本地磁盘实例的云盘数据，则会继续保留至停机15天后释放。考虑到此次变更正值春节期间，2018年3月1日前，阿里云临时将本地盘实例到期或欠费停机后，本地盘释放时间由7天调整为15天，2018年3月1日起,实例欠费或到期后，本地磁盘数据保留时间恢复为7天。
      </span>
    </el-form-item> -->
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
