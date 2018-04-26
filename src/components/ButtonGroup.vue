<template>
  <div class="buttonGroup">
    <div class="buttons">
      <el-button v-for="button of config.buttons"
        :type="button.type"
        :key="button.field"
        :class="{disabled: buttonDisabledStatus[button.field]}"
        @click="buttonClick(button.field)">
        <Iconfont v-if="button.icon" :type="button.icon"/>
        {{$t(`${moduleName}.${button.field}`)}}
      </el-button><el-button class="iconButton"
        @click="refresh">
        <Iconfont type="refresh"/>
      </el-button><el-button class="iconButton" v-show="!searchVisible"
        @click="searchVisible = true">
        <Iconfont type="filter"/>
      </el-button>
      <el-select class="input-new-tag" v-show="searchVisible" :placeholder="$t('searchKeyPlaceholder')"
        v-model="searchKey">
        <el-option v-for="item in config.searches"
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
  </div>
</template>

<style lang="less" scoped>
.buttonGroup {
  padding: 10px 0;
  .buttons {
    .iconButton {
      padding: 9px 9.5px;
    }
    .input-new-tag {
      margin-left: 10px;
      width: 140px;
    }
  }
  .searchTags {
    margin-top: 5px;
    .el-tag+.el-tag {
      margin-left: 5px;
    }
    .zoomInUp, .slideOutUp {
      animation-duration: 0.7s;
    }
  }
}
</style>

<script>
export default {
  name: 'ButtonGroup',
  data () {
    return {
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
    selection: {
      type: Array,
      default () {
        return []
      },
    },
  },
  computed: {
    config () {
      let config = this.$store.getters[`${this.moduleName}Config`]
      return config
    },
    buttonDisabledStatus () {
      const statusObj = {}
      const selectionLen = this.$props.selection.length
      this.config.buttons.forEach(e => {
        statusObj[e.field] = false
        if (e.selection) {
          if (e.selection === 'single' && selectionLen !== 1) {
            statusObj[e.field] = true
          } else if (e.selection === 'multiple' && selectionLen < 1) {
            statusObj[e.field] = true
          }
        }
        if (Array.isArray(e.validStatus) && this.$props.selection.some(
          data => !e.validStatus.includes(data.__status__)
        )) {
          statusObj[e.field] = true
        }
      })
      return statusObj
    },
    searchConfigDict () {
      let config = this.config.searches
      let dict = {}
      config.forEach(e => {
        dict[e.field] = e
      })
      return dict
    },
    search () {
      return this.$store.getters[`${this.$props.moduleName}Search`]
    },
    searchList () {
      return this.search.map(({field, value}) => ({
        field,
        label: `${this.$t(`${this.$props.moduleName}.${field}`)}: ${value}`,
      }))
    },
  },
  watch: {
    search: {
      handler: function (val, oldval) {
        this.$emit('refresh')
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
    buttonClick (field) {
      if (!this.buttonDisabledStatus[field]) {
        this.$emit('doAction', field)
      }
    },
    refresh () {
      this.$emit('refresh')
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
    closeTag (tag) {
      this.$store.commit(`remove${this.$props.moduleName}Search`, tag)
    },
    handleTextConfirm () {
      let value = this.searchValue.text
      if (value) {
        let searchItem = {
          field: this.searchKey,
          op: 'eq', // 等于
          value: value,
        }
        this.$store.commit(`push${this.$props.moduleName}Search`, searchItem)
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
        this.$store.commit(`remove${this.moduleName}Search`, `start_${this.searchKey}`)
        this.$store.commit(`removeSetmealSearch`, `end_${this.searchKey}`)

        this.$store.commit(`push${this.moduleName}Search`, start_date)
        this.$store.commit(`push${this.moduleName}Search`, end_date)
      }
      this.handleTextReset()
    },
    resetSearch () {
      this.searchKey = ''
      this.searchVisible = false
    },
  },
}
</script>
