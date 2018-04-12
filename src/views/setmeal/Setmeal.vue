<template>
  <div class="module setmeal">
    <TableView
      moduleName="Setmeal"
      :detailTabs="['tab2', 'tab3']"
      @refreshTable="refreshTable"
      @refreshDetail="refreshDetail"
      @updateSelection="updateSelection"
      @create="create"
      @update="update"
      @issue="issue"
      @shelve="shelve"
      @purchase="showPop"
      @delete="deleteSetmeal"
      @enterDetail="enterDetail"
      @leaveDetail="leaveDetail">
    </TableView>
    <SetmealCreate></SetmealCreate>
    <SetmealUpdate ref="popUpdate"></SetmealUpdate>
  </div>
</template>

<style lang="less" scoped>
.module {
  height: 100%;   
}
</style>

<script>
import {mapGetters} from 'vuex'
import SetmealCreate from './SetmealCreate'
import SetmealUpdate from './SetmealUpdate'
import SetmealDetail from './SetmealDetail'

export default {
  name: 'Setmeal',
  components: {
    SetmealCreate,
    SetmealUpdate,
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
      this.$store.commit('updateSetmealPopVisible', {name: 'create', visible: true})
    },
    update () {
      this.$store.commit('updateSetmealPopVisible', {name: 'update', visible: true})
      this.$refs.popUpdate.initData(JSON.parse(JSON.stringify(this.singleSelection)))
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
          status: 'issue',
        }).then(() => {
          this.$message.success(this.$t('Setmeal.shelveSuccess'))
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
    showPop ({name}) {
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
