<template>
  <div>
    <div style="padding: 20px;height: 100%;display: flex;flex-direction: column; ">
      <div class="title">
        <span class="name">任务名称: {{task.name}}</span>
        <span class="info">间隔：{{task.interval}}</span>
      </div>
      <div class="content">
        <div class="console"></div>
        <div class="op">
          <button>开始任务</button>
          <button>停止任务</button>
          <button @click="configTask()">编辑任务</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      task: Object
    },
    methods:{
      configTask(){
        this.$router.push({path:`/task/${this.task.taskId}`})
      }
    }
  }

</script>

<style scoped lang="less">
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    >span {
      font-size: 24px;
    }
    .name{

    }
  }

  .content {
    border: solid 1px gray;
    padding: 20px;
    display: flex;
    flex-grow: 1;
    align-items: center;
  }

  .console {
    align-self: stretch;
    flex-grow: 1;
    border: solid 1px gray;
    margin-right: 50px;
  }

  .op {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }

  .op button {
    margin: 10px 0;
    font-size: 24px;
  }

</style>
