<template>
  <div class="content">
    <div class="buttonGroup">
      <el-button @click="show3 = !show3">show detail</el-button>
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
        :border="true"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="35">
      </el-table-column>
      <el-table-column
          v-for="column of config.columns"
          :key="column.field"
          :prop="column.field"
          :sortable="true"
          :filters="column.filters"
          :filter-method="column.filter_method"
          :label="$t(`${moduleName}.${column.field}`)">
          <template slot-scope="scope">
            <TableCell :row="scope.row" :column="column" @showDetail="showDetail"></TableCell>
          </template>
      </el-table-column>
    </el-table>
    <transition 
      enter-active-class="slideInRight"
      leave-active-class="bounceOutRight">
      <div v-show="show3" :key="moduleName" class="detailView">
        haha  wo shi detail
      </div>
    </transition>
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
  .detailView {
    position: absolute;
    &.slideInRight {
      animation-duration: 0.7s;
    }
    top: 56px;
    left: 200px;
    right: 0px;
    bottom: 0px;
      background-color: gray;
  }
}

</style>

<script>
// import {mapGetters} from 'vuex'

export default {
  name: 'TableView',
  data () {
    return {
      show3: true,
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
    showDetail () {
      this.show3 = !this.show3
    },
    filter_method (value, row, column) {
      return row[column.property] === value
    },
    doAction (action) {
      if (!this.buttonStatus[action]) {
        this.$emit(action, {field: action, data: this.multipleSelection})
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
