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
        <el-row>
          <el-col :span="12">
            <Dict :data="basic_attributes" moduleName="Setmeal"></Dict>
          </el-col>
          <el-col :span="12">
            <Dict :data="periodDict" moduleName="Setmeal">
              <template slot-scope="props">
                <span>{{props.value.discount}}</span>
                <Money prefix="￥" :money="props.value.price"></Money>
              </template>
            </Dict>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item
        v-for="(dict, type) of resourceDict"
        :key="type"
        :name="type">
        <span slot="title">{{$t(type)}}</span>
        <Dict :data="dict"></Dict>
      </el-collapse-item>
    </el-collapse>
  </DetailView>
</template>

<style lang="less" scoped>
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import { initDictFromList } from '../../utils'

export default {
  data () {
    return {
      tabs: [],
      counter: {
        instance: 0,
        volume: 0,
        floating_ip: 0,
        router: 0,
      },
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
    detail () {
      let detail = JSON.parse(JSON.stringify(this.$store.state.detail))
      detail.resources && detail.resources.forEach(resource => {
        if (typeof resource.configuration === 'string') {
          resource.configuration = JSON.parse(resource.configuration)
        }
      })
      return detail
    },
    flavorDict () {
      return this.initDictFromList(this.flavorList, 'flavor_id')
    },
    basic_attributes () {
      let setmeal = this.detail.set_meal || this.detail
      let counter = this.counter
      return {
        name: setmeal.name,
        limit: setmeal.limit || this.$t('unlimited'),
        price: {value: setmeal.price, type: 'price', unit: 'hour'},
        status: {value: setmeal.status, type: 'status'},
        description: setmeal.description,
        instance_count: counter.instance,
        volume_count: counter.volume,
        floating_ip_count: counter.floating_ip,
        router_count: counter.router,
        updated_at: this.$dateFormat(setmeal.updated_at),
        created_at: this.$dateFormat(setmeal.created_at),
      }
    },
    periodDict () {
      let periods = this.detail.periods || []
      let dict = {}
      periods.forEach(e => {
        dict[`discount${e.period}`] = {
          discount: `${this.$t('discount')} ${e.discount * 100}%`,
          price: e.discount_price,
        }
      })
      return dict
    },
    resourceDict () {
      let dict = {}
      let counter = this.counter
      let resources = this.detail.resources || []
      resources.forEach(e => {
        let type = e.type
        let configuration = e.configuration
        if (dict[type] === undefined) {
          dict[type] = {}
          counter[type] = 0
        }
        counter[type]++
        let descArr = []
        if ('flavor_id' in configuration) {
          let flavor_id = configuration.flavor_id
          descArr.push(this.flavorDict[flavor_id] ? this.flavorDict[flavor_id].__desc : flavor_id)
        }
        if ('volume_type' in configuration) {
          descArr.push(this.$t(configuration.volume_type))
        }
        if ('size' in configuration) {
          descArr.push(`${configuration.size}G`)
        }
        if ('line' in configuration) {
          descArr.push(this.$t(configuration.line))
        }
        if ('ratelimit' in configuration) {
          descArr.push(`${configuration.ratelimit}M`)
        }
        dict[type][`${this.$t(type)} ${counter[type]}`] = descArr.join(' ')
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
}
</script>
