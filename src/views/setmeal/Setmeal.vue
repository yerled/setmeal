<template>
  <div class="module setmeal">
    <ButtonGroup
      moduleName="Setmeal"
      :selection="multipleSelection"
      @refresh="refresh"
      @doAction="doAction">
    </ButtonGroup>
    <TableView class="tableView"
      moduleName="Setmeal"
      @refresh="refresh"
      @updateSelection="updateSelection"
      @enterDetail="enterDetail"
      @leaveDetail="leaveDetail">
    </TableView>
    <SetmealCreate></SetmealCreate>
    <SetmealUpdate ref="popUpdate"></SetmealUpdate>
    <SetmealPurchase ref="popPurchase"></SetmealPurchase>
  </div>
</template>

<style lang="less" scoped>
.module {
  display: flex;
  flex-direction: column;
  height: 100%;
  .tableView {
    flex: 1;
  }
}
</style>

<script>
import {mapGetters} from 'vuex'
import SetmealCreate from './SetmealCreate'
import SetmealUpdate from './SetmealUpdate'
import SetmealPurchase from './SetmealPurchase'
import SetmealDetail from './SetmealDetail'

export default {
  name: 'Setmeal',
  components: {
    SetmealCreate,
    SetmealUpdate,
    SetmealPurchase,
    SetmealDetail,
  },
  data () {
    return {
      multipleSelection: [],
    }
  },
  computed: {
    ...mapGetters({
      popVisible: 'SetmealPopVisible',
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
      this.$store.commit('updateSetmealLoading', true)
      await this.$store.dispatch('SelectSetmealList')
      this.$store.commit('updateSetmealLoading', false)
    },
    refreshDetail () {
      this.$store.dispatch('UpdateSetmealDetail')
    },
    updateSelection (selection) {
      this.multipleSelection = selection
    },
    doAction (field) {
      console.log('show' + field)
      let title, content
      switch (field) {
        case 'create':
          this.showPop('create')
          break
        case 'update':
          this.showPop('update')
          this.initPopData('popUpdate')
          break
        case 'purchase':
          this.showPop('purchase')
          this.initPopData('popPurchase')
          break
        case 'issue':
          title = this.$t('Setmeal.issue')
          content = this.$t('Setmeal.actionConfirm').replace('{{action}}', this.$t('issue'))
          this.$confirm(content, title, {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('UpdateSetmealStatus', {
              id: this.singleSelection.set_meal_id,
              status: 'issue',
            }).then(() => {
              this.$message.success(this.$t('Setmeal.issueSuccess'))
              this.refreshTable()
            }).catch(err => {
              console.log(err)
              this.$message.error(this.$t('Setmeal.issueFaild'))
            })
          })
          break
        case 'shelve':
          title = this.$t('Setmeal.shelve')
          content = this.$t('Setmeal.actionConfirm').replace('{{action}}', this.$t('shelve'))
          this.$confirm(content, title, {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('UpdateSetmealStatus', {
              id: this.singleSelection.set_meal_id,
              status: 'off_shelve',
            }).then(() => {
              this.$message.success(this.$t('Setmeal.shelveSuccess'))
              this.refreshTable()
            }).catch(err => {
              console.log(err)
              this.$message.error(this.$t('Setmeal.shelveFaild'))
            })
          })
          break
        case 'delete':
          title = this.$t('Setmeal.delete')
          content = this.$t('Setmeal.actionConfirm').replace('{{action}}', this.$t('delete'))
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
          break
        default:
      }
    },
    initPopData (popRef) {
      let pop = this.$refs[popRef]
      pop.initData(JSON.parse(JSON.stringify(this.singleSelection)))
      this.$store.dispatch('SelectSetmealDetail', this.singleSelection.set_meal_id).then(res => {
        pop.initData(JSON.parse(JSON.stringify(res.data)))
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
