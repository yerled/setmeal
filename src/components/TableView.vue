<template>
  <div class="tableView">
    <div class="table">
      <el-table :row-class-name="tableRowClassName" :border="true" :ref="moduleName"
        :data="tableData" v-loading="loading"
        @sort-change="handleSortChange"
        @filter-change="filter_change"
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
            :column-key="column.field"
            :prop="column.field"
            :sortable="column.sortable ? (needPagination ? 'custom' : true) : false"
            :filters="column.filters"
            :filter-method="column.filter_method"
            :label="$t(`${moduleName}.${column.field}`)">
            <template slot-scope="scope">
              <TableCell :row="scope.row" :column="column" @captionClick="captionClick"></TableCell>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next" :total="total_count" :page-size="query.limit"
        v-show="needPagination"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<style lang="less">
.tableView {
  position: relative;
  display: flex;
  flex-direction: column;
  .table {
    flex: 1;
    display: flex;
    .el-table {
      display: flex;
      flex-direction: column;
      .el-table__body-wrapper {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
  .pagination {
    height: 200px;
    .el-pagination {
      position: absolute;
      bottom: 150px;
      right: 50px;
    }
  }
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
    filter () {
      return this.$store.getters[`${this.moduleName}Filter`]
    },
    loading () {
      return this.$store.getters[`${this.moduleName}Loading`]
    },
    needPagination () {
      return this.total_count > this.query.limit
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
    },
    filter: {
      handler: function (val, oldval) {
        this.refresh()
      },
      deep: true,
    },
  },
  methods: {
    refresh () {
      this.$emit('refresh')
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
    filter_change (filters) {
      let list = []
      Object.keys(filters).forEach(key => {
        filters[key].forEach(value => {
          list.push({
            field: key,
            op: 'eq', // equal
            value,
          })
        })
      })
      this.$store.commit(`update${this.moduleName}Filter`, list)
    },
    filter_method (value, row, column) {
      return row[column.property] === value
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
