<template>
  <TableView
      :module = "module"
      :buttons="buttons"
      :columns="columns"
      :tableData="tableData"
      >
  </TableView>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'Setmeal',
  data () {
    return {
      module: 'setmeal',
      buttons: [{
        type: 'primary',
        field: 'create',
      }],
      columns: [{
        field: 'name',
      }, {
        field: 'desc',
      }, {
        field: 'status',
      }],
      tableData: [{name: '黄金套餐', 
        desc: 'data in setmeal.vue',
        status: 'published',
      }],
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
  },
  created () {
    this.refreshTable()
  },
}
</script>
