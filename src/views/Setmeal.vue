<template>
  <div>
    <TableView
      :moduleName = "moduleName"
      @create = "create"
      @update = "update"
      @purchase = "purchase">
    </TableView>
    <SetmealCreate :visible="CreatePopVisible" @done="createDone"></SetmealCreate>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import SetmealCreate from './SetmealCreate'

const moduleName = 'Setmeal'

export default {
  name: moduleName,
  components: {
    SetmealCreate,
  },
  data () {
    return {
      moduleName: moduleName,
      CreatePopVisible: false,
    }
  },
  getters: {
    // ...mapGetters({
    //   tableData: 'setmealTableData111111111',
    // }),
  },
  methods: {
    refreshTable () {
      this.$store.dispatch('refreshSetmeal')
    },
    create () {
      this.CreatePopVisible = true
    },
    createDone () {
      this.CreatePopVisible = false
    },
    update (items) {
      alert(`update ${items[0].name}`)
    },
    purchase (items) {
      alert(`purchase ${items[0].name}`)
    }
  },
  created () {
    this.refreshTable()
  },
}
</script>
