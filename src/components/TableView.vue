<template>
  <div>
    <div class="buttonGroup">
      <el-button v-for="button of buttons"
          :type="button.type"
          :key="button.field"
          @click="doAction(button.action)">
        <Iconfont v-if="button.icon" :type="button.icon"/>
        {{$t(`${module}.${button.field}`)}}
      </el-button>
    </div>
      <el-table
          :ref = "module"
          :data="tableData"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="35">
        </el-table-column>
        <el-table-column 
            v-for="column of columns" 
            :key="column.field"
            :prop="column.field" 
            :label="$t(`${module}.${column.field}`)">
        </el-table-column>
      </el-table>
  </div>
</template>

<style lang="less" scoped>
.buttonGroup {
  padding: 10px 0;
}
</style>

<script>
export default {
  name: 'TableView',
  data () {
    return {
      multipleSelection: [],
    }
  },
  props: {
    module: {
      type: String,
      required: true,
    },
    buttons: {
      type: Array,
    },
    columns: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
    },
  },
  methods: {
    doAction (action) {
      this.$emit(action, 'payload from TableView')
    },
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
    },
  },
}
</script>
