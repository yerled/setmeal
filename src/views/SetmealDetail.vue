<template>
  <DetailView
    :detail="detail"
    :visible="visible"
    :tabs="tabs"
    @close="leaveDetail">
    <el-collapse :value="['basic_attributes']">
      <el-collapse-item name="basic_attributes">
        <span slot="title" class="resource_name">{{$t('basic_attributes')}}</span>
        <el-row>
          <el-col :span="12">
            <Dict :data="basic_attributes"></Dict>
          </el-col>
          <el-col :span="12">
            <Dict :data="periodDict"></Dict>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item
        v-for="(dict, type) of resourceDict"
        :key="type"
        :name="type">
        <Dict :data="dict"></Dict>
      </el-collapse-item>
    </el-collapse>
  </DetailView>
</template>

<style lang="less" scoped>
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import { initDictFromList } from '../utils'

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
    ...mapGetters({
      flavorList: 'flavorList',
    }),
    flavorDict () {
      return this.initDictFromList(this.flavorList, 'flavor_id')
    },
    basic_attributes () {
      let detail = this.detail
      let attrs = ['name', 'instance_count', 'volume_count', 'floating_ip_count', 'router_count']
      let result = {}
      attrs.forEach(attr => {
        result[this.$t(`Setmeal.${attr}`)] = detail[attr]
      })
      return result
    },
    periodDict () {
      let dict = {}
      let periods = this.detail.periods || []
      periods.forEach(e => {
        dict[e.period] = {
          discount: e.discount * 100,
          discount_price: e.discount_price,
        }
      })
      return dict
    },
    periods () {
      let detail = this.detail.period
      let attrs = Object.keys(this.periodDict).sort((a, b) => a - b)
      let result = {}
      attrs.forEach(attr => {
        result[this.$t(`discount${attr}`)] = periodDict[attr]
      })
      return {}
    },
    resourceDict () {
      let dict = {}
      let counter = {}
      let resources = this.detail.resources || []
      resources.forEach(e => {
        let type = e.type
        if (dict[type] === undefined) {
          dict[type] = {}
          counter[type] = 0
        }
        counter[type]++
        console.log(e.configuration.flavor_id)
        let flavor_id = e.configuration.flavor_id
        let desc = this.flavorDict[flavor_id] ? this.flavorDict[flavor_id].__desc : flavor_id
        dict[type][`${this.$t(type)} ${counter[type]}`] = desc
      })
      return dict
    },
  },
  methods: {
    initDictFromList,
    leaveDetail () {
      this.$store.commit('updateDetailVisible', false)
      this.$store.commit('updateDetail', {})
      this.$router.push({name: 'Setmeal'})
    },
  },
  mounted () {
    this.$store.dispatch('refreshSetmealDetail')
  },
}
</script>
