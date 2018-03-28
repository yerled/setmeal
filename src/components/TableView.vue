<template>
  <div>
    <div class="buttonGroup">
      <el-button v-for="button of config.buttons"
          :type="button.type"
          :key="button.field"
          :class="{disabled: buttonStatus[button.field]}"
          @click="doAction(button.field)">
        <Iconfont v-if="button.icon" :type="button.icon"/>
        {{$t(`${moduleName}.${button.field}`)}}
      </el-button>
    </div>
      <el-table
          :ref = "moduleName"
          :data="tableData"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="35">
        </el-table-column>
        <el-table-column 
            v-for="column of config.columns" 
            :key="column.field"
            :prop="column.field" 
            :label="$t(`${moduleName}.${column.field}`)">
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
// import {mapGetters} from 'vuex'

export default {
  name: 'TableView',
  data () {
    return {
      multipleSelection: [],
    }
  },
  props: {
    moduleName: {
      type: String,
      required: true,
    },
  },
  computed: {
    config () {
      return this.$store.getters[`${this.moduleName}Config`]
    },
    tableData () {
      const tableData = this.$store.getters[`${this.moduleName}TableData`]
      tableData.forEach(e => {
        if (e.__status__ === undefined) {
          e.__status__ = e.status
        }
      })
      return tableData
    },
    buttonStatus () {
      const self = this
      const statusObj = {}
      const selectionLen = this.multipleSelection.length
      this.config.buttons.forEach(e => {
        statusObj[e.field] = false
        if (e.selection) {
          if (e.selection === 'single' && selectionLen !== 1) {
            statusObj[e.field] = true
          } else if (e.selection === 'multiple' && selectionLen < 1) {
            statusObj[e.field] = true
          }
        }
        if (Array.isArray(e.validStatus) && self.multipleSelection.some(
          data => !e.validStatus.includes(data.__status__)
        )) {
          statusObj[e.field] = true
        }
      })
      return statusObj
    },
  },
  methods: {
    doAction (action) {
      if (!this.buttonStatus[action]) {
        this.$emit(action, this.multipleSelection)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    tableRowClassName ({row}) {
      if (this.multipleSelection.includes(row)) {
        return 'selected-row'
      }
      if (this.config.rowClass) {
        let warn = this.config.rowClass.warn
        if (Array.isArray(warn) && warn.includes(row.__status__)) {
          return 'warning-row'
        }
      }
      return ''
    }
  },
}
</script>
