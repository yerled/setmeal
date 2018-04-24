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
      </el-button><el-button class="iconButton"
        @click="refresh">
        <Iconfont type="refresh"/>
      </el-button><el-button class="iconButton" v-show="!searchVisible"
        @click="showSearchSelect">
        <Iconfont type="filter"/>
      </el-button>
      <el-select class="input-new-tag" v-show="searchVisible" :placeholder="$t('searchKeyPlaceholder')"
        v-model="searchKey">
        <el-option v-for="item in config.search"
          :key="item.field"
          :label="$t(`${moduleName}.${item.field}`)"
          :disabled="calcSearchDisable(item.field)"
          :value="item.field">
        </el-option>
      </el-select>
      <el-input class="input-new-tag" :placeholder="$t('searchValuePlaceholder')"
        v-show="searchConfigDict[searchKey] && searchConfigDict[searchKey].type === 'text'"
        v-model="searchValue.text"
        ref="searchInputText"
        @blur="handleTextConfirm"
        @keyup.enter.native="handleTextConfirm"
        @keyup.esc.native="handleTextReset">
      </el-input>
      <el-date-picker type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd"
        ref="searchInputDate"
        v-model="searchValue.date"
        v-show="searchConfigDict[searchKey] && searchConfigDict[searchKey].type === 'date'"
        @blur="handleDateConfirm"
        :range-separator="$t('to')"
        :start-placeholder="$t('start_date')"
        :end-placeholder="$t('end_date')"
        :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <transition-group tag="div" class="searchTags" 
      enter-active-class="zoomInUp"
      leave-active-class="slideOutUp"
      v-show="search.length > 0">
      <el-tag closable :disable-transitions="false" size="large"
        v-for="tag in searchList"
        :key="tag.field"
        @close="closeTag(tag.field)">
        {{tag.label}}
      </el-tag>
    </transition-group>
    <el-table :row-class-name="tableRowClassName" height="100%" :border="true" :ref = "moduleName"
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
    .iconButton {
      padding: 9px 9.5px;
    }
    .input-new-tag {
      margin-left: 10px;
      width: 200px;
    }
  }
  .searchTags {
    margin-bottom: 10px;
    .el-tag+.el-tag {
      margin-left: 10px;
    }
    .zoomInUp, .slideOutUp {
      animation-duration: 0.7s;
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
}

</style>

<script>
import {mapState} from 'vuex'

export default {
  name: 'TableView',
  data () {
    return {
      multipleSelection: [],
      searchVisible: false,
      searchKey: '',
      searchValue: {
        text: '',
        date: '',
      },
      pickerOptions: {
        shortcuts: [{
          text: this.$t('last_week'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('last_month'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('last_month3'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
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
    searchConfigDict () {
      let config = this.config.search
      let dict = {}
      config.forEach(e => {
        dict[e.field] = e
      })
      return dict
    },
    searchList () {
      return this.search.map(({field, value}) => ({
        field,
        label: `${this.$t(`${this.moduleName}.${field}`)}: ${value}`,
      }))
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
    search () {
      return this.$store.getters[`${this.moduleName}Search`]
    },
    loading () {
      return this.$store.getters[`${this.moduleName}Loading`]
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
    },
    filter: {
      handler: function (val, oldval) {
        this.refresh()
      },
      deep: true,
    },
    search: {
      handler: function (val, oldval) {
        this.refresh()
      },
      deep: true,
    },
    searchKey (val, oldval) {
      if (!val) {
        return
      }
      let type = this.searchConfigDict[val].type
      let calcType = type.slice(0, 1).toUpperCase() + type.slice(1)
      this.$nextTick(_ => {
        this.$refs[`searchInput${calcType}`].focus()
      })
    },
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
    closeTag (tag) {
      this.$store.commit(`remove${this.moduleName}Search`, tag)
    },
    showSearchSelect () {
      this.searchVisible = true
    },
    handleTextConfirm () {
      let value = this.searchValue.text
      if (value) {
        let searchItem = {
          field: this.searchKey,
          op: 'eq', // 等于
          value: value,
        }
        this.$store.commit(`push${this.moduleName}Search`, searchItem)
      }
      this.handleTextReset()
    },
    handleTextReset () {
      this.searchValue.text = ''
      this.resetSearch()
    },
    handleDateConfirm () {
      let values = this.searchValue.date
      if (values && values.length > 1) {
        let start_date = {
          field: `start_${this.searchKey}`,
          op: 'ge', // 大于
          value: values[0],
        }
        let end_date = {
          field: `end_${this.searchKey}`,
          op: 'le', // 小于
          value: values[1],
        }
        // 日期相关的字段有两个值，用户可能手动去除了其中一个值
        // 因此在选择日期时搜索项中可能还存在着一个值
        this.$store.commit('removeSetmealSearch', `start_${this.searchKey}`)
        this.$store.commit('removeSetmealSearch', `end_${this.searchKey}`)

        this.$store.commit('pushSetmealSearch', start_date)
        this.$store.commit('pushSetmealSearch', end_date)
      }
      this.handleTextReset()
    },
    resetSearch () {
      this.searchKey = ''
      this.searchVisible = false
    },
    calcSearchDisable (field) {
      let startDateFlag, endDateFlag
      return this.search.some(e => {
        if (e.field === `start_${field}`) {
          startDateFlag = true
        } else if (e.field === `end_${field}`) {
          endDateFlag = true
        } else {
          return e.field === field
        }
        return startDateFlag && endDateFlag
      })
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
