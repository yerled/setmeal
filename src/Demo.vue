<template>
  <div id="app">
      <!-- <el-main>
        <router-view/>
      </el-main> -->
      <el-button type="primary">主要按钮</el-button>
  <el-button type="success">成功按钮</el-button>
  <el-button type="info">信息按钮</el-button>
  <el-button type="warning">警告按钮</el-button>
  <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Menu from './Menu'
import Header from './Header'

export default {
  name: 'App',
  data () {
    return {
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
    }
  },
  components: {
    Menu,
    Header,
  }
}
</script>

<style lang="less" scoped>
@import './styles/variable.less';

// @media screen and (min-width: 1680px) {
//   #app {
//     .el-aside {
//       width: 260px !important;
//     }
//   }
// }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  .el-header {
    background-color: #007382;
    width: 100%;
    height: 50px !important;
  }
  .el-container {
    height: 100%;
    width: 100%;
    .el-aside {
      width: 260px !important;
      height: 100%;
      background-color: #e6ebec;
    }
    .el-main {
      width: 100%;
    }
  }
}
</style>
