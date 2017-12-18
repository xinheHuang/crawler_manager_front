<template>
  <div>
    <b-card class="log">
      <p v-for="log in logs"
         style="text-align: left;height: 20px"
         :key="log.id"
         :class="log.error?'error':''"
      >
        <span style="font-weight: bold">{{log.name}}:</span>
        {{log.content}}
      </p>
    </b-card>
    <b-btn @click="$emit('clear')" variant="danger">清空
    </b-btn>
  </div>
</template>

<script>
  export default {
    props: {
      logs: Array
    }
  }
</script>

<style scoped lang="less">
  .log {
    height: 400px;
    overflow-y: scroll;
    margin-bottom: 20px;
    .error {
      color: red
    }
  }
</style>
