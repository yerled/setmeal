<template>
  <div class="content">
    <div class="buttonGroup">
      <el-button v-for="button of config.buttons"
          :type="button.type"
          :key="button.field"
          :class="{disabled: buttonStatus[button.field]}"
          @click="doAction(button.field)">
        <Iconfont v-if="button.icon" :type="button.icon"/>
        {{$t(`${moduleName}.${button.field}`)}}
      </el-button>
      <el-button class="refresh"
        @click="refresh">
        <Iconfont type="refresh"/>
      </el-button>
    </div>
    <el-table :row-class-name="tableRowClassName" height="100%" :border="true" :ref = "moduleName"
      :data="tableData"
      @sort-change="handleSortChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="35">
      </el-table-column>
      <el-table-column
          v-for="column of config.columns"
          :key="column.field"
          :prop="column.field"
          :sortable="needPagination ? 'custom' : true"
          :filters="column.filters"
          :filter-method="column.filter_method"
          :label="$t(`${moduleName}.${column.field}`)">
          <template slot-scope="scope">
            <TableCell :row="scope.row" :column="column" @captionClick="captionClick"></TableCell>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next" :total="total_count"
      v-show="needPagination"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<style lang="less" scoped>
.content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  .buttonGroup {
    padding: 10px 0;
  }
}
.el-table{
  margin-bottom: 200px;
}
.el-pagination {
  position: absolute;
  bottom: 150px;
  right: 50px;
}
.refresh {
  padding: 9px 9.5px;
}
</style>

<script>
import {mapState} from 'vuex'
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
    ...mapState(['detailVisible', 'detail']),
    config () {
      let config = this.$store.getters[`${this.moduleName}Config`]
      config.columns.some(e => {
        if (e.field === 'status') {
          if (config.initStatusFilter) {
            e.filter_method = this.filter_method
            e.filters = config.initStatusFilter.map(status => {
              return {
                text: this.$t(status),
                value: status,
              }
            })
          }
        }
      })
      return config
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
    total_count () {
      return this.$store.getters[`${this.moduleName}TotalCount`]
    },
    query () {
      return this.$store.getters[`${this.moduleName}Query`]
    },
    needPagination () {
      return this.total_count > this.query.limit
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
    sortKeyDict () {
      return {
        Setmeal: {
          name: 'name',
        },
      }
    },
  },
  watch: {
    query: {
      handler: function (val, oldval) {
        if (this.needPagination) {
          this.refresh()
        }
      },
      deep: true,
    }
  },
  methods: {
    refresh () {
      if (this.detailVisible) {
        this.refreshDetail()
      } else {
        this.refreshTable()
      }
    },
    refreshDetail () {
      this.$emit('refreshDetail')
    },
    refreshTable () {
      this.$emit('refreshTable')
    },
    captionClick (row) {
      if (row.id === this.detail.id && this.detailVisible) {
        this.resetDetailView()
      } else {
        this.setDetailView(row)
      }
    },
    resetDetailView () {
      this.$refs[this.moduleName].clearSelection()
      this.$emit('leaveDetail')
    },
    setDetailView (data) {
      this.$refs[this.moduleName].clearSelection()
      this.$refs[this.moduleName].toggleRowSelection(data)
      this.$emit('enterDetail', data)
    },
    filter_method (value, row, column) {
      return row[column.property] === value
    },
    doAction (action) {
      if (!this.buttonStatus[action]) {
        this.$emit(action, {name: action, data: this.multipleSelection})
      }
    },
    handleSortChange ({ column, prop, order }) {
      let commit = this.$store.commit
      let mutation = `update${this.moduleName}Query`
      let _order = ''
      if (order === 'ascending') {
        _order = 'asc'
      } else if (order === 'descending') {
        _order = 'desc'
      }
      let _prop = prop
      if (_prop === null) {
        _prop = ''
      } else if (this.sortKeyDict[this.moduleName] && this.sortKeyDict[this.moduleName][prop]) {
        _prop = this.sortKeyDict[this.moduleName][prop]
      }

      commit(mutation, {name: 'sort_key', value: (_prop)})
      commit(mutation, {name: 'sort_order', value: _order})
    },
    convertSortKey (prop) {
      if (this.moduleName === 'Setmeal') {
        if (prop === 'name') {
          return 'set'
        }
      }
    },
    handleSelect (selection) {
      if (selection.length === 0 && this.detailVisible) {
        this.resetDetailView()
      }
    },
    handleSelectAll (selection) {
      if (selection.length === 0) {
        this.resetDetailView()
      }
    },
    handleSelectionChange (selection) {
      this.$emit('updateSelection', selection)
      this.multipleSelection = selection
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
    },
    handleCurrentChange (val) {
      this.$store.commit('updateSetmealQuery', {name: 'offset', value: val - 1})
    },
  },
}
</script>
