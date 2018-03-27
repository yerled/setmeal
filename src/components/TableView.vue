<template>
  <div>
    <div class="buttonGroup">
      <el-button plain v-for="button of buttons"
          :type="getButtonType(button)"
          :key="button.field">
        {{$t(`${module}.${button.field}`)}}
      </el-button>
    </div>
    <div class="table">
      <el-table :data="tableData">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column 
            v-for="column of columns" 
            :key="column.field"
            :prop="column.field" 
            :label="$t(`${module}.${column.field}`)">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../styles/variable.less';
.table {
  margin-top: 20px;
}
</style>

<script>
export default {
  name: 'TableView',
  data () {
    return {

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
    getButtonType (button) {
      return button.type === 'primary' ? 'primary' : 'info'
    },
  },
}
</script>
