<template>
  <div class="module setmeal">
    <TableView
      moduleName="Setmeal"
      @refreshTable="refreshTable"
      @refreshDetail="refreshDetail"
      @updateSelection="updateSelection"
      @create="create"
      @update="update"
      @issue="issue"
      @shelve="shelve"
      @purchase="purchase"
      @delete="deleteSetmeal"
      @enterDetail="enterDetail"
      @leaveDetail="leaveDetail">
    </TableView>
    <SetmealCreate></SetmealCreate>
    <SetmealUpdate ref="popUpdate"></SetmealUpdate>
    <SetmealPurchase ref="popPurchase"></SetmealPurchase>
  </div>
</template>

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
    refreshDetail () {
      this.$store.dispatch('UpdateSetmealDetail')
    },
    refreshTable () {
      this.$store.dispatch('SelectSetmealList')
    },
    updateSelection (selection) {
      this.multipleSelection = selection
    },
    create () {
      this.showPop('create')
    },
    update () {
      this.showPop('update')
      this.initPopData('popUpdate')
    },
    purchase () {
      this.showPop('purchase')
      this.initPopData('popPurchase')
    },
    initPopData (popRef) {
      let pop = this.$refs[popRef]
      pop.initData(JSON.parse(JSON.stringify(this.singleSelection)))
      this.$store.dispatch('SelectSetmealDetail', this.singleSelection.set_meal_id).then(res => {
        pop.initData(JSON.parse(JSON.stringify(res.data)))
      })
    },
    issue () {
      let title = this.$t('Setmeal.issue')
      let content = this.$t('Setmeal.actionConfirm').replace('{{action}}', this.$t('issue'))
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
    },
    shelve () {
      let title = this.$t('Setmeal.shelve')
      let content = this.$t('Setmeal.actionConfirm').replace('{{action}}', this.$t('shelve'))
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
