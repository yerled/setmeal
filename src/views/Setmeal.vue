<template>
  <TableView
      :module = "module"
      :buttons="buttons"
      :columns="columns"
      :tableData="tableData"
      @create = "create"
      @update = "update"
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
        field: 'create',
        icon: 'add',
        action: 'create',
        type: 'primary',
      }, {
        field: 'update',
        icon: 'edit',
        action: 'update',
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
      }, {name: '白银套餐', 
        desc: 'data in setmeal.vue',
        status: 'drafted',
      }, {name: '青铜套餐', 
        desc: 'data in setmeal.vue',
        status: 'shelved',
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
    create () {
      alert('create')
    },
    update (item) {
      alert(`update ${item}`)
    },
  },
  created () {
    this.refreshTable()
  },
}
</script>
