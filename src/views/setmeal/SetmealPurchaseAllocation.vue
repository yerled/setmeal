<template>
  <div class="item resource">
    <el-card class="resource"
      v-for="(resource, index) of instances"
      :key="index">
      <div slot="header">
        <label>{{$t(resource.name)}}</label>
      </div>
      <el-form :model="resource">
        <el-form-item :label-width="formLabelWidth" :label="$t('name')">
          <el-input v-model="resource.name"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('image')">
          <el-switch v-model="resource.isSystemImage"
            :active-text="$t('system_image')" :inactive-text="$t('Setmeal.snap_image')">
          </el-switch>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-radio-group size="medium" class="tab-radio-group image"
            v-model="resource.systemImage" v-show="resource.isSystemImage">
            <el-radio-button v-for="image of systemImageList" :key="image.id" :label="image.name">
              <Iconfont :type="getImageIcon(image)" class="iconfont"></Iconfont>{{image.name}}
            </el-radio-button>
          </el-radio-group>
          <el-radio-group size="medium" class="tab-radio-group image"
            v-model="resource.snapImage" v-show="!resource.isSystemImage">
            <el-radio-button v-for="image of snapImageList" :key="image.id" :label="image.name">
              {{image.name}}
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
          <el-switch v-model="resource.isPassword"
            :active-text="$t('keyt')" :inactive-text="$t('password')">
          </el-switch>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span>
            <label for="">{{`${$t('username')}:`}}</label>
            <span>{{resource.username}}</span>
          </span>
          <span v-show="resource.isPassword">
            <label for="">{{`${$t('keyt')}:`}}</label>
            <el-select v-model="resource.keyt">
              <el-option v-for="item in keytList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </span>
          <span v-show="!resource.isPassword">
            <label for="">{{`${$t('password')}:`}}</label>
            <el-input v-model="resource.password"></el-input>
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
</style>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'SetmealPurchaseAllocation',
  data () {
    return {

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
    ...mapGetters(['subnetList', 'systemImageList', 'snapImageList', 'keytList']),
  },
  methods: {
    getImageIcon (image) {
      return image && image.image_label && image.image_label.toLowerCase()
    }
  }
}
</script>
