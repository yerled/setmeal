<template>
  <div class="module record">
    <TableView
      moduleName="Record"
      @refreshTable="refreshTable"
      @refreshDetail="refreshDetail"
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
  name: 'Setmeal',
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
    refreshDetail () {
      this.$store.dispatch('UpdateSetmealDetail')
    },
    refreshTable () {
      this.$store.dispatch('SelectRecordList')
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
      this.$store.dispatch('SelectSetmealDetail', this.singleSelection.user_set_meal_id).then(res => {
        pop.initData(JSON.parse(JSON.stringify(res.data)))
      })
    },
    deleteSetmeal () {
      let title = this.$t('Setmeal.delete')
      let content = this.$t('Setmeal.actionConfirm').replace('{{action}}', this.$t('delete'))
      this.$confirm(content, title, {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'error'
      }).then(() => {
        this.$store.dispatch('DeleteSetmeal', this.singleSelection.set_meal_id).then(res => {
          this.$message.success(this.$t('deleteSuccess'))
          this.refreshTable()
        }).catch(err => {
          console.log(err)
          this.$message.error(this.$t('deleteFaild'))
        })
      })
    },
    showPop (name) {
      this.$store.commit('updateSetmealPopVisible', {
        name,
        visible: true,
      })
    },
    enterDetail (data) {
      this.$store.commit('updateDetailVisible', true)
      this.$store.commit('updateDetail', data)
      this.$router.push({name: 'SetmealDetail', params: {id: data.set_meal_id}})
      this.$store.dispatch('UpdateSetmealDetail')
    },
    leaveDetail () {
      this.$store.commit('updateDetailVisible', false)
      this.$store.commit('updateDetail', {})
      this.$router.push({name: 'Setmeal'})
    },
  },
  created () {
    this.refreshTable()
  },
}
</script>
