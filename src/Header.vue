<template>
  <div class="navbar">
    <div class="logo">
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style lang="less" scoped>
.navbar {
  height: 100%;
  .logo {
    width: 152px;
    height: 100%;
    margin-left: 16px;
    span {
      display: inline-block;
      margin-top: 8px;
      width: 100%;
      height: 34px;
      background: url('./assets/logo.png') 0 center no-repeat;
      background-size: contain;
    }
  }
}
</style>
