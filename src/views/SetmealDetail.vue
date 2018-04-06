<template>
  <DetailView
    :detail="detail"
    :visible="visible"
    :tabs="tabs"
    @close="leaveDetail">
    <el-collapse :value="['basic_attributes']">
      <el-collapse-item name="basic_attributes">
        <span slot="title" class="resource_name">{{$t('basic_attributes')}}</span>
        <el-row>
          <el-col :span="12">
            <div class="dict">
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="dict">
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
              <div class="item">
                <span class="key">name</span>
                <span class="value">fasdfa</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
      <!-- <el-collapse-item
        v-for="(resources, type) of resourcesDict"
        :key="type">
        
        <div class="price_items">
          <div class="price_item"
            v-for="(item, index) of resources"
            :key="index">
            <span class="resource_name">{{`${$t(type)} ${index + 1} `}}</span>
            <span class="configDesc">{{item.configDesc}}</span>
          </div>
        </div>
      </el-collapse-item> -->
    </el-collapse>
  </DetailView>
</template>

<style lang="less" scoped>
.dict {
  .item {
    height: 30px;
    span {
      display: inline-block;
    }
    .key {
      width: 80px;
      color: #527583;
      text-align: right;
    }
    .value {
      padding-left: 20px;
    }
  }
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      tabs: [],
    }
  },
  computed: {
    ...mapState({
      visible: 'detailVisible',
      detail: 'detail',
    }),
  },
  methods: {
    leaveDetail () {
      this.$store.commit('updateDetailVisible', false)
      this.$store.commit('updateDetail', {})
      this.$router.push({name: 'Setmeal'})
    },
  },
}
</script>
