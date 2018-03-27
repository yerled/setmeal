<template>
  <ul>
    <li v-for="menu of menus" :key="menu">
      <router-link active-class="selected" :to="menu">
        <!-- <svg class="icon" aria-hidden="true">
          <use :xlink:href="getIcon(menu)"></use>
        </svg> -->
        <Iconfont :type="menu" />
        <span>{{$t(`menu.${menu}`)}}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      menus: [],
    }
  },
  methods: {
    getIcon (menu) {
      return `#icon-${menu}`
    },
  },
  created () {
    this.menus = ['setmeal', 'mySetmeal', 'record']
    console.log('菜单加载完成')
  },
}
</script>

<style lang="less" scoped>
@menuItem_height: 42px;

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    height: @menuItem_height;
    text-align: left;
    &:hover {
      background-color: #b9f1f9;
    }
    a {
      color: #527583;
      display: block;
      height: @menuItem_height;
      width: 240px;
      line-height: @menuItem_height;
      text-decoration: none;
      padding-left: 20px;
      &.selected {
        background-color: #00afc8;
        color: #ffffff;
      }
      svg {
        display: inline-block;
        margin-right: 12px;
        line-height: @menuItem_height;
        vertical-align: text-bottom;
      }
      span {
        line-height: @menuItem_height;
      }
    }
  }
}
</style>
