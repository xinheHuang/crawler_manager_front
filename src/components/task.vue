<template>
  <div>
    <div style="padding: 20px;height: 100%;display: flex;flex-direction: column; ">
      <div class="title">
        <span class="name">任务名称: {{task.name}}</span>
        <span class="info">间隔：{{getDayHourMinuteFromTime(task.interval)}}</span>
      </div>
      <div class="content">
        <div class="console">
          <p v-for="log in logs" style="margin-bottom:10px;text-align: left" >
            <span style="color: red">{{log.subtaskName}}</span>
            {{log.message}}
            <span style="display: block">===================</span>
          </p>

        </div>
        <div class="op">
          <span>任务状态：{{task.status}}</span>
          <button @click="$emit('startTask')">开始任务</button>
          <button @click="$emit('stopTask')">停止任务</button>
          <button @click="configTask()">查看任务详情</button>
          <!--todo-->
          <button v-show="task.status!=='start'" @click="$emit('deleteTask')">删除任务</button>
          <button @click="$emit('clear')">清空console</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../utils'
  export default {
    props: {
      task: Object,
      logs:Array
    },
    methods:{
      getDayHourMinuteFromTime(time){
        return util.getDayHourMinuteFromTime(time)
      },
      configTask(){
        this.$router.push({path:`/task/${this.task.taskId}`})
      },

    },
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
    overflow: auto;
    flex-grow: 1;
    border: solid 1px gray;
    margin-right: 30px;
  }

  .op {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    span{
      margin-bottom: 20px;
      font-size: 24px;
    }
  }

  .op button {
    margin: 10px 0;
    font-size: 24px;
  }

</style>
