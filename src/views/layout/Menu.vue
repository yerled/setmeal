<template>
  <ul>
    <li v-for="menu of menus" :key="menu.label">
      <router-link active-class="selected" :to="menu.router">
        <Iconfont :type="menu.label" />
        <span>{{$t(`menu.${menu.label}`)}}</span>
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
    this.menus = [{
      label: 'setmeal',
      router: {
        name: 'IssueSetmeal'
      },
    }, {
      label: 'setmeal_manage',
      router: {
        name: 'Setmeal'
      },
    }, {
      label: 'record',
      router: {
        name: 'Record'
      },
    }]
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
