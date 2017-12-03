<template>
  <div>
    <div style="padding: 20px;height: 100%;display: flex;flex-direction: column; ">
      <div class="title">
        <span class="name">工作流名称: {{workflow.name}}</span>
        <span class="info">工作流间隔：{{getInterval(workflow.interval)}}</span>
      </div>
      <div class="content">
        <div class="console">
          <p v-for="log in logs"
             style="margin-bottom:10px;text-align: left">
            <span style="color: red">{{log.subtaskName}}</span>
            {{log.message}}
            <span style="display: block">===================</span>
          </p>

        </div>
        <div class="op">
          <span>任务状态：{{workflow.status}}</span>
          <button @click="$emit('startTask')">开始工作流</button>
          <button @click="$emit('stopTask')">停止工作流</button>
          <button @click="configTask()">查看工作流详情</button>
          <!--todo-->
          <button v-show="workflow.status!=='start'"
                  @click="$emit('deleteTask')">删除工作流
          </button>
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
      workflow: Object,
      logs: Array
    },
    methods: {
      getInterval(time) {
        return !time ? '未配置' : util.getDayHourMinuteFromTime(time)
      },
      configTask() {
        this.$router.push({path: `/workflow/${this.workflow.id}`})
      },

    },
  }

</script>

<style scoped
       lang="less">
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    > span {
      font-size: 24px;
    }
    .name {

    }
  }

  .content {
    border: solid 1px gray;
    padding: 20px;
    display: flex;
    width: 100%;
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
    span {
      margin-bottom: 20px;
      font-size: 20px;
    }
  }

  .op button {
    margin: 10px 0;
    font-size: 20px;
  }

</style>
