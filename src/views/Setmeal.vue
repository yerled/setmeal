<template>
  <div class="module setmeal">
    <TableView
      moduleName = "Setmeal"
      :detailTabs = "['tab2', 'tab3']"
      @create = "showPop"
      @update = "showPop"
      @purchase = "showPop"
      @enterDetail="enterDetail"
      @leaveDetail="leaveDetail">
    </TableView>
    <!-- <SetmealDetail
      :detail="detail"
      :visible="popVisible.detail"
      @leaveDetail="leaveDetail">
    </SetmealDetail> -->
    <SetmealCreate :visible="popVisible.create"></SetmealCreate>
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
import SetmealDetail from './SetmealDetail'

export default {
  name: 'Setmeal',
  components: {
    SetmealCreate,
    SetmealDetail,
  },
  data () {
    return {
      
    }
  },
  computed: {
    ...mapGetters({
      popVisible: 'SetmealPopVisible',
    })
  },
  methods: {
    refreshTable () {
      this.$store.dispatch('refreshSetmeal')
    },
    showPop ({name}) {
      this.$store.commit('updateSetmealPopVisible', {
        name,
        visible: true,
      })
    },
    update (items) {
      alert(`update ${items[0].name}`)
    },
    purchase (items) {
      alert(`purchase ${items[0].name}`)
    },
    enterDetail (data) {
      this.$store.commit('updateDetailVisible', true)
      this.$store.commit('updateDetail', data)
      this.$router.push({name: 'SetmealDetail', params: {id: data.id}})
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
