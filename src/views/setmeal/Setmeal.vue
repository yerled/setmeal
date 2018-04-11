<template>
  <div class="module setmeal">
    <TableView
      moduleName = "Setmeal"
      :detailTabs = "['tab2', 'tab3']"
      @refreshTable = "refreshTable"
      @refreshDetail = "refreshDetail"
      @updateSelection = "updateSelection"
      @create = "showPop"
      @update = "showPop"
      @purchase = "showPop"
      @delete = "deleteSetmeal"
      @enterDetail="enterDetail"
      @leaveDetail="leaveDetail">
    </TableView>
    <SetmealCreate></SetmealCreate>
    <!-- <SetmealUpdate :data="singleSelection"></SetmealUpdate> -->
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
    showPop ({name}) {
      this.$store.commit('updateSetmealPopVisible', {
        name,
        visible: true,
      })
    },
    deleteSetmeal ({data}) {
      this.$store.dispatch('DeleteSetmeal', data[0].set_meal_id).then(res => {
        this.refreshTable()
      })
    },
    enterDetail (data) {
      this.$store.commit('updateDetailVisible', true)
      this.$store.commit('updateDetail', data)
      this.$router.push({name: 'SetmealDetail', params: {id: data.set_meal_id}})
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
