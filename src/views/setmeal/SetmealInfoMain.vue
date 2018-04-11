<template>
  <el-form ref="SetmealInfoMain"
    :model="setmeal"
    :rules="rules">
    <el-form-item :label="$t('Setmeal.name')" prop="name"
      :label-width="formLabelWidth">
      <el-input v-model="setmeal.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item :label="$t('description')"
      :label-width="formLabelWidth">
      <el-input type="textarea" :rows="2"
        v-model="setmeal.description">
      </el-input>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth"
      :label="$t('Setmeal.limit')" >
      <el-switch :active-text="$t('Setmeal.pop.unlimited')"
        v-model="setmeal.unlimited">
      </el-switch>
      <el-input-number :min="0" :max="10"
        v-show="!setmeal.unlimited"
        v-model="setmeal.limitNumber">
      </el-input-number>
    </el-form-item>
    <el-form-item :label="$t(`Setmeal.${type}_count`)"
      :label-width="formLabelWidth"
      v-for="(item, type) of counter"
      :key="type">
      <el-input-number
        v-model="item.value"
        :min="item.min" :max="item.max">
      </el-input-number>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'SetmealInfoMain',
  data () {
    return {
      rules: {
        name: [
          { required: true, message: this.$t('Setmeal.pop.nameRequired'), trigger: 'blur' },
        ]
      },
    }
  },
  props: {
    setmeal: {
      type: Object,
      default () {
        return {}
      },
    },
    counter: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      formLabelWidth: 'formLabelWidth',
    }),
  },
}
</script>

