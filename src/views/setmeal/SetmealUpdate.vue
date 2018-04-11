<template>
  <SetmealPop :data='data' mode="update"></SetmealPop>
</template>

<script>
import SetmealPop from './SetmealPop'

export default {
  name: 'SetmealUpdate',
  components: {
    SetmealPop,
  },
  data () {
    return {

    }
  },
  props: {
    data: {
      type: Object,

    }
  }
}
</script>
