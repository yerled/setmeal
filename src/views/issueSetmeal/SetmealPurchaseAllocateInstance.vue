<template>
  <div class="item resource">
    <el-card class="resource"
      v-for="(resource, index) of instances"
      :key="index">
      <div slot="header">
        <label v-once>{{resource.name}}</label>
      </div>
      <el-form :model="resource" :ref="`form${index}`" :rules="rules">
        <el-form-item :label-width="formLabelWidth" :label="$t('configuration')" >
          {{resource.configDesc}}
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('name')" prop="name">
          <el-input v-model="resource.name"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('image')">
          <el-switch v-model="resource.isSystemImage"
            :inactive-text="$t('system_image')" :active-text="$t('snap_image')">
          </el-switch>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-radio-group size="medium" class="tab-radio-group image"
            v-model="resource.systemImage" v-show="resource.isSystemImage">
            <el-radio-button v-for="image of systemImageList" :key="image.id" :label="image.id" >
              <Iconfont :type="getImageIcon(image)" class="iconfont"></Iconfont>{{image.name}}
            </el-radio-button>
          </el-radio-group>
          <el-radio-group size="medium" class="tab-radio-group image"
            v-model="resource.snapImage" v-show="!resource.isSystemImage">
            <el-radio-button v-for="image of snapImageList" :key="image.id" :label="image.id">
              <Iconfont :type="getImageIcon(image)" class="iconfont"></Iconfont>{{image.name}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('subnet')" :label-width="formLabelWidth">
          <el-select v-model="resource.subnet_id">
            <el-option
              v-for="subnet in subnetList"
              :key="subnet.id"
              :label="subnet.name"
              :value="subnet.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('loginInfo')">
          <el-switch v-model="resource.isKeyt" :disabled="resource.isWindows"
            :inactive-text="$t('password')" :active-text="$t('keyt')">
          </el-switch>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span class="user">
            <label for="">{{`${$t('username')}:`}}</label>
            <span class="username">
              {{resource.username}}
            </span>
          </span>
          <span v-show="resource.isKeyt">
            <label for="">{{`${$t('keyt')}:`}}</label>
            <el-select v-model="resource.keyt" class="inline-input">
              <el-option v-for="item in keytList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </span>
          <span v-show="!resource.isKeyt">
            <label for="">{{`${$t('password')}:`}}</label>
            <el-input type="password" v-model="resource.password" class="inline-input"></el-input>
          </span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.iconfont {
  margin-right: 8px;
}
.user {
  display: inline-block;
  margin-right: 10px;
  .username {
    display: inline-block;
    width: 90px;
  }
}
</style>

<script>
import {mapState, mapGetters} from 'vuex'
import { initDictFromList } from '../../utils'

export default {
  name: 'SetmealPurchaseAllocation',
  data () {
    return {
      switch1: false,
      rules: {
        name: [
          { required: true, message: this.$t('IssueSetmeal.pop.instanceNameRequired'), trigger: 'blur' },
        ]
      },
    }
  },
  props: {
    instances: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState({
      formLabelWidth: 'formLabelWidth',
    }),
    ...mapGetters(['subnetList', 'flavorList', 'systemImageList', 'snapImageList', 'keytList']),
    snapImageDict () {
      return this.initDictFromList(this.snapImageList)
    },
    systemImageDict () {
      return this.initDictFromList(this.systemImageList)
    },
  },
  watch: {
    instances: {
      handler: function (val, oldval) {
        val.forEach(e => {
          let image = e.isSystemImage
            ? this.systemImageDict[e.systemImage] : this.snapImageDict[e.snapImage]
          if (this.getImageIcon(image) === 'windows') {
            e.username = 'Administrator'
            e.isKeyt = false
            e.isWindows = true
          } else {
            e.username = 'root'
            e.isWindows = false
          }
          if (image && image.image_meta) {
            e.username = JSON.parse(image.image_meta)['os_username']
          }
        })
      },
      deep: true,
    },
  },
  methods: {
    initDictFromList,
    getImageIcon (image) {
      return image && image.image_label && image.image_label.toLowerCase()
    },
  }
}
</script>
