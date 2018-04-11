<template>
  <div class="item resource">
    <el-card class="resource"
      v-for="(resource, index) of volumes"
      :key="index">
      <div slot="header">
        <label>{{`${$t('volume')} ${index + 1}`}}</label>
      </div>
      <el-form :model="resource">
        <el-form-item
          :label="$t('volume_type')"
          :label-width="formLabelWidth">
          <el-radio-group size="medium" class="tab-radio-group"
            v-model="resource.configuration.volume_type">
            <el-radio-button v-for="type of volumeTypeList"
              :key="type"
              :label="type">{{$t(type)}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="`${$t('size')}(G)`"
          :label-width="formLabelWidth">
          <el-slider show-input
            v-model="resource.configuration.size"
            :format-tooltip="convertSizeG"
            :min="10" :max="860">
          </el-slider>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {convertSize} from '../../utils'

export default {
  data () {
    return {

    }
  },
  props: {
    volumes: {
      type: Array,
      required: true,
    }
  },
  computed: {
    ...mapState({
      formLabelWidth: 'formLabelWidth',
    }),
    ...mapGetters({
      volumeTypeList: 'volumeTypeList',
    }),
  },
  methods: {
    convertSize,
    convertSizeG (value) {
      return this.convertSize(value, 'G')
    },
  },
}
</script>
