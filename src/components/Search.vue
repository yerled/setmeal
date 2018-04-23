<template>
  <div class="search">
    <el-tag closable :disable-transitions="false"
      v-for="tag in list"
      :key="tag"
      @close="close(tag)">
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      // selectVisible: false,
    }
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      },
    },
  },
  methods: {
    close (tag) {
      this.list.splice(this.list.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.list.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  },
}
</script>
