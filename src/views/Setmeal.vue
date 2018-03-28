<template>
  <div>
    <TableView
      :moduleName = "moduleName"
      @create = "showPop"
      @update = "showPop"
      @purchase = "showPop">
    </TableView>
    <SetmealCreate :visible="popVisible.create"
      @done="hidePop">
    </SetmealCreate>
  </div>
</template>

<script>
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
      popVisible: {
        create: false,
      },
    }
  },
  methods: {
    refreshTable () {
      this.$store.dispatch('refreshSetmeal')
    },
    showPop ({field}) {
      this.popVisible[field] = true
    },
    hidePop (field) {
      this.popVisible[field] = false
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
