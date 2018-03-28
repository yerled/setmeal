<template>
  <el-dialog :title="$t('Setmeal.popCreate.title')" 
    :close-on-click-modal="!visible"
    :append-to-body="visible"
    :visible.sync="visible">
    <el-form 
      ref="SetmealCreateForm"
      :model="setmeal"
      :rules="rules">
      <el-form-item :label="$t('Setmeal.popCreate.name')" prop="name" :label-width="formLabelWidth">
        <el-input v-model="setmeal.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Setmeal.popCreate.desc')" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="setmeal.desc">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('Setmeal.popCreate.limit')" :label-width="formLabelWidth">
        <el-switch
          v-model="setmeal.unlimited"
          :active-text="$t('Setmeal.popCreate.unlimited')">
        </el-switch>
        <el-input-number
          v-show="!setmeal.unlimited"
          v-model="setmeal.limit"
          :min="1" :max="10"
          label="描述文字">
        </el-input-number>
      </el-form-item>
      <el-form-item :label="$t('Setmeal.popCreate.instanceCount')" :label-width="formLabelWidth">
        <el-input-number
          v-model="setmeal.instanceCount"
          :min="1" :max="10"
          label="描述文字">
        </el-input-number>
      </el-form-item>
      <el-form-item :label="$t('Setmeal.popCreate.volumeCount')" :label-width="formLabelWidth">
        <el-input-number
          v-model="setmeal.volumeCount"
          :min="1" :max="10"
          label="描述文字">
        </el-input-number>
      </el-form-item>
      <el-form-item :label="$t('Setmeal.popCreate.ipCount')" :label-width="formLabelWidth">
        <el-input-number
          v-model="setmeal.ipCount"
          :min="1" :max="10"
          label="描述文字">
        </el-input-number>
      </el-form-item>
      <el-form-item :label="$t('Setmeal.popCreate.routerCount')" :label-width="formLabelWidth">
        <el-input-number
          v-model="setmeal.routerCount"
          :min="0" :max="1"
          label="描述文字">
        </el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="create">{{$t('Setmeal.popCreate.confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SetmealCreate',
  data () {
    return {
      setmeal: {
        name: '',
        desc: '',
        unlimited: true,
        limit: 1,
        instanceCount: 0,
        volumeCount: 0,
        ipCount: 0,
        routerCount: 0, 
      },
      rules: {
        name: [
          { required: true, message: this.$t('Setmeal.popCreate.nameRequired'), trigger: 'blur' },
        ]
      },
      formLabelWidth: '100px',
    }
  },
  props: ['visible'],
  methods: {
    create () {
      this.$refs['SetmealCreateForm'].validate((valid) => {
        if (valid) {
          console.log('create-----------')
          console.dir(this.setmeal)
          console.log('create-----------end')
          this.$emit('done')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>
