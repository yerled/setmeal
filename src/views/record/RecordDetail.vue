<template>
  <DetailView
    :detail="detail"
    :visible="visible"
    :tabs="tabs"
    @close="leaveDetail">
    <el-collapse 
      :value="['basic_attributes', 'instance', 'volume', 'floating_ip', 'router']">
      <el-collapse-item name="basic_attributes">
        <span slot="title">{{$t('basic_attributes')}}</span>
        <Dict :data="basic_attributes" moduleName="Record"></Dict>
      </el-collapse-item>
    </el-collapse>
  </DetailView>
</template>

<style lang="less" scoped>
</style>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      tabs: [],
    }
  },
  computed: {
    ...mapState({
      visible: 'detailVisible',
      detail: 'detail',
    }),
    detail () {
      return JSON.parse(JSON.stringify(this.$store.state.detail))
    },
    basic_attributes () {
      let record = this.detail
      return this.visible ? {
        uuid: record.user_set_meal_id,
        set_meal_name: record.set_meal_name,
        description: record.description,
        price: {value: `${record.discount_price} ${this.$t('rmb')}/${this.$t(`month${record.period}`)}`, type: 'price'},
        project_name: record.project_name,
        expire_dispose: {value: record.expire_dispose, type: 'status'},
        renewal_times: record.renewal_times,
        total_price: {value: `${record.total_price} ${this.$t('rmb')}`, type: 'price'},
        expire_at: this.$dateFormat(record.expire_at),
        created_at: this.$dateFormat(record.created_at),
      } : {}
    },
  },
  methods: {
    leaveDetail () {
      this.$store.commit('updateDetailVisible', false)
      this.$store.commit('updateDetail', {})
      this.$router.push({name: 'Record'})
    },
  },
}
</script>
