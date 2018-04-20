<template>
  <div class="module record">
    <TableView
      moduleName="Record"
      @refreshTable="refreshTable"
      @renewal="renewal"
      @update="updateRenewal"
      @updateSelection="updateSelection"
      @enterDetail="enterDetail"
      @leaveDetail="leaveDetail">
    </TableView>
    <RecordRenewal ref="popRenewal"></RecordRenewal>
    <RecordUpdateRenewal ref="popUpdateRenewal"></RecordUpdateRenewal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import RecordRenewal from './RecordRenewal'
import RecordUpdateRenewal from './RecordUpdateRenewal'

export default {
  name: 'Record',
  components: {
    RecordRenewal,
    RecordUpdateRenewal,
  },
  data () {
    return {
      multipleSelection: [],
    }
  },
  computed: {
    ...mapGetters({
      popVisible: 'RecordPopVisible',
    }),
    singleSelection () {
      if (this.multipleSelection.length) {
        return this.multipleSelection[0]
      }
      return {}
    },
  },
  methods: {
    async refreshTable () {
      this.$store.commit('updateRecordLoading', true)
      await this.$store.dispatch('SelectRecordList')
      this.$store.commit('updateRecordLoading', false)
    },
    updateSelection (selection) {
      this.multipleSelection = selection
    },
    renewal () {
      this.showPop('renewal')
      this.initPopData('popRenewal')
    },
    updateRenewal () {
      this.showPop('updateRenewal')
      this.initPopData('popUpdateRenewal')
    },
    initPopData (popRef) {
      let pop = this.$refs[popRef]
      pop.initData(JSON.parse(JSON.stringify(this.singleSelection)))
    },
    showPop (name) {
      this.$store.commit('updateRecordPopVisible', {
        name,
        visible: true,
      })
    },
    enterDetail (data) {
      this.$store.commit('updateDetailVisible', true)
      this.$store.commit('updateDetail', data)
      this.$router.push({name: 'RecordDetail', params: {id: data.user_set_meal_id}})
      // this.$store.dispatch('UpdateRecordDetail')
    },
    leaveDetail () {
      this.$store.commit('updateDetailVisible', false)
      this.$store.commit('updateDetail', {})
      this.$router.push({name: 'Record'})
    },
  },
  created () {
    this.refreshTable()
  },
}
</script>
