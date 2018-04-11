<template>
  <div class="item resource">
    <el-card class="resource"
      v-for="(resource, index) of lines"
      :key="index">
      <div slot="header">
        <label>{{`${$t(type)} ${index + 1}`}}</label>
      </div>
      <el-form :model="resource">
        <el-form-item
          :label="$t('line')"
          :label-width="formLabelWidth">
          <el-select v-model="resource.configuration.line">
            <el-option
              v-for="line in lineList"
              :key="line.name"
              :label="$t(line.name)"
              :value="line.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="`${$t('ratelimit')}(M)`"
          :label-width="formLabelWidth">
          <el-slider show-input
            v-model="resource.configuration.ratelimit"
            :format-tooltip="convertSizeM"
            :min="10" :max="1024">
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
    lines: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    }
  },
  computed: {
    ...mapState({
      formLabelWidth: 'formLabelWidth',
    }),
    ...mapGetters({
      lineList: 'lineList',
    })
  },
  methods: {
    convertSize,
    convertSizeM (value) {
      return this.convertSize(value, 'M')
    },
  },
}
</script>
