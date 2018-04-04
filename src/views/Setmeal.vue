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
    <SetmealDetail
      :detail="detail"
      :visible="visibleCenter.detail"
      @leaveDetail="leaveDetail">
    </SetmealDetail>
    <SetmealCreate 
      :visible="popVisible.create"
      @done="hidePop">
    </SetmealCreate>
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
      detail: {id: 'id1111'},
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
    showPop ({field}) {
      this.$store.commit('updateSetmealVisibleCenter', {
        type: 'create',
        value: true,
      })
    },
    update (items) {
      alert(`update ${items[0].name}`)
    },
    purchase (items) {
      alert(`purchase ${items[0].name}`)
    },
    enterDetail () {
      this.$router.push({name: 'Setmeal'})
    },
    leaveDetail (data) {
      this.$router.push({name: 'SetmealDetail', params: {id: data.id}})
    },
  },
  created () {
    this.refreshTable()
  },
  beforeRouteEnter: (to, from, next) => {
    console.log('enter')
    console.dir(to)
    next()
  },
  beforeRouteUpdate: (to, from, next) => {
    console.log('update')
    console.dir(to)
    next()
  },
}
</script>
