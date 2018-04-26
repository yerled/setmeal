<template>
  <div class="module">
    <ButtonGroup
      moduleName="Record"
      :selection="multipleSelection"
      @refresh="refresh"
      @doAction="doAction">
    </ButtonGroup>
    <TableView
      moduleName="Record"
      @refresh="refresh"
      @updateSelection="updateSelection"
      @enterDetail="enterDetail"
      @leaveDetail="leaveDetail">
    </TableView>
    <RecordRenewal ref="popRenewal"></RecordRenewal>
    <RecordUpdateRenewal ref="popUpdateRenewal"></RecordUpdateRenewal>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
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
    ...mapState(['detailVisible']),
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
    refresh () {
      if (this.detailVisible) {
        this.refreshDetail()
      } else {
        this.refreshTable()
      }
    },
    async refreshTable () {
      this.$store.commit('updateRecordLoading', true)
      await this.$store.dispatch('SelectRecordList')
      this.$store.commit('updateRecordLoading', false)
    },
    refreshDetail () {
      // this.$store.dispatch('UpdateSetmealDetail')
    },
    updateSelection (selection) {
      this.multipleSelection = selection
    },
    doAction (field) {
      switch (field) {
        case 'renewal':
          this.showPop('renewal')
          this.initPopData('popRenewal')
          break
        case 'updateRenewal':
          this.showPop('updateRenewal')
          this.initPopData('popUpdateRenewal')
          break
        default:
      }
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
