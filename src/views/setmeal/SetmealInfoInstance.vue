<template>
  <div class="item resource">
    <el-card class="resource"
      v-for="(resource, index) of instances"
      :key="index">
      <div slot="header">
        <label>{{`${$t('instance')} ${index + 1}`}}</label>
      </div>
      <el-form :model="resource">
        <el-form-item :label="$t('flavor')"
          :label-width="formLabelWidth">
          <el-select
            v-model="resource.configuration.flavor_id"
            @change="updateFlavor(resource, 'flavor_id')">
            <el-option
              v-for="flavor in flavorList"
              :key="flavor.flavor_id"
              :label="flavor.name"
              :value="flavor.flavor_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-radio-group size="medium" class="tab-radio-group"
            v-model="resource.vcpus"
            @change="updateFlavor(resource, 'vcpus')">
            <el-radio-button v-for="cpu of flavorCPU"
              :key="cpu"
              :label="cpu">{{`${cpu}vCPU`}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-radio-group size="medium" class="tab-radio-group"
            v-model="resource.ram"
            @change="updateFlavor(resource, 'ram')">
            <el-radio-button v-for="flavor of flavorList"
              v-show="resource.vcpus == flavor.vcpus"
              :key="flavor.flavor_id"
              :label="flavor.ram">{{convertSize(flavor.ram, 'M')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {convertSize} from '../../utils'

export default {
  name: 'SetmealInfoInstance',
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
    ...mapGetters({
      flavors: 'flavors',
    }),
    flavorList () {
      return this.$store.getters.flavorList.map(e => {
        e.name = e.__nameAndDesc
        return e
      })
    },
    flavorCPU () {
      console.log(this.flavors)
      return Array.from(new Set(this.flavors.map(e => e.vcpus)))
    },
  },
  methods: {
    convertSize,
    updateFlavor (target, type) {
      if (type === 'flavor_id') {
        this.flavorList.some(e => {
          if (e.flavor_id === target.configuration.flavor_id) {
            target.vcpus = e.vcpus
            target.ram = e.ram
            return true
          }
        })
      } else if (type === 'vcpus') {
        this.flavorList.some(e => {
          if (e.vcpus === target.vcpus) {
            target.configuration.flavor_id = e.flavor_id
            target.ram = e.ram
            return true
          }
        })
      } else if (type === 'ram') {
        this.flavorList.some(e => {
          if (e.vcpus === target.vcpus && e.ram === target.ram) {
            target.configuration.flavor_id = e.flavor_id
            return true
          }
        })
      }
    },
  }
}
</script>
