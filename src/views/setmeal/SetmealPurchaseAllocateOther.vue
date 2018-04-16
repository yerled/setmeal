<template>
  <div class="item resource">
    <el-card class="resource"
      v-for="(resource, index) of resources"
      :key="index">
      <div slot="header">
        <label>{{`${$t(resource.type)} ${index + 1}`}}</label>
      </div>
      <el-form :model="resource" :ref="`form${index}`" :rules="rules">
        <el-form-item :label-width="formLabelWidth" :label="$t('basic_attributes')" >
          {{resource.configDesc}}
        </el-form-item>
        <el-form-item v-if="resource.type !== 'floating_ip'" :label-width="formLabelWidth" :label="$t('name')" prop="name">
          <el-input v-model="resource.name"></el-input>
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
      rules: {
        name: [
          { required: true, message: this.$t('fieldRequired'), trigger: 'blur' },
        ]
      },
    }
  },
  props: {
    resources: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState({
      formLabelWidth: 'formLabelWidth',
    }),
    ...mapGetters(['subnetList', 'systemImageList', 'snapImageList', 'keytList']),
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
          if (image && image.image_meta) {
            e.username = JSON.parse(image.image_meta)['os_username']
            return
          }
          let image_label = image && image.image_label && image.image_label.toLowerCase()
          e.username = image_label === 'windows' ? 'Administrator' : 'root'
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
