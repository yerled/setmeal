<template>
  <div id="app">
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside>
        <Menu></Menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    
  </div>
</template>

<script>
import Menu from './Menu'
import Header from './Header'

export default {
  name: 'App',
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
