<template>
  <div class="task-info">

    名称：<input v-model="tempWorkFlow.name"
              :disabled="!isEditing">
    间隔：
    <span v-if="!isEditing">{{getDayHourMinuteFromTime(tempWorkFlow.interval)}}</span>
    <div class="interval-input"
         v-else>
      <input v-model="tempWorkFlow.days">天
      <input v-model="tempWorkFlow.hours">小时
      <input v-model="tempWorkFlow.minutes">分钟
    </div>
    <button @click="saveWorkFlow()"
            v-show="isEditing">保存
    </button>
    <button @click="cancelEdit()"
            v-show="isEditing">取消
    </button>
    <button @click="goEdit()"
            v-show="!isEditing">编辑
    </button>
    <div class="op">
      <span style="margin-right: 20px">任务状态：{{workflow.status}}</span>
      <button
        @click="startTask()">开始任务
      </button>
      <button @click="stopTask()">停止任务
      </button>
      <button v-show="workflow.status == 'error'"
              @click="resumeTask()">继续任务
      </button>
    </div>
    <div class="task">
      <subTask :key="subtask.subtaskId"
               v-for="subtask in workflow.subTasks"
               class="subTask"
               :subTask="subtask"
               :servers="servers"
               :subTaskSave="subTaskSave"
               @remove="subTaskRemove(subtask.subtaskId)"
               :logs="subtaskMessages[subtask.subtaskId]"
               @clear="clearConsole(subtask.subtaskId)"
               @start="startSubTask(subtask.subtaskId)"
               @stop="stopSubTask(subtask.subtaskId)"
               :scripts="scripts"/>
      <div class="add-task">
        <button @click="createSubTask()">添加子任务</button>
      </div>
    </div>
  </div>
</template>
<script>
  import subTask from '../../../components/subTask.vue'
  import * as types from '../../../store/mutation-types'
  import util from '../../../utils/index'

  export default {
    data() {
      return {
        tempWorkFlow: {},
        isEditing: false,
        workflow:{},
        jobgourps:[]
      }
    },
    props: ['workflowId'],
    computed: {
      subtaskMessages() {
        return this.$store.state.messages.subtaskMessages
      },
//      servers() {
//        return this.$store.state.tasks.servers
//      },
//      scripts() {
//        return this.$store.state.tasks.scripts
//      },
//      task() {
//        console.log('here tasks')
//        return this.$store.state.tasks.tasks
//      },
//      task() {
//        console.log('here')
//        return this.$store.state.tasks.tasks[this.taskId] || {}
//      },
    },
    methods: {
      getDayHourMinuteFromTime(time) {
        return util.getDayHourMinuteFromTime(time)
      },
      //task
      goEdit() {
        this.isEditing = true
      },
      cancelEdit() {  //编辑task
        this.isEditing = false
        this.tempWorkFlow = this.getTempWorkFlow()
      },

      async getWorkFlow(){
        this.workflow = await this.$store.dispatch('getWorkFlow', this.workflowId)
        this.jobgourps = await this.$store.dispatch('getWorkFlowJobGroups',this.workflowId)
      },

      getTempWorkFlow(workflow = this.workflow) {
        const {days, hours, minutes} = util.getDayHourMinute(workflow.interval)
        return {
          ...workflow,
          days,
          hours,
          minutes,
        }
      },

      async saveWorkFlow() {
        const {days, hours, minutes} = this.tempWorkFlow
        this.tempWorkFlow.interval = util.getTimeFromDayHourMinute(days, hours, minutes)
        await this.$store.dispatch('saveWorkFlow', this.tempWorkFlow)
        this.isEditing = false
      },

      async startWorkFlow() {
        await this.$store.dispatch('startWorkFlow', this.workflowId)
      },

      async stopWorkFlow() {
        await this.$store.dispatch('stopWorkFlow', this.workflowId)
      },

      async resumeWorkFlow() {
        await this.$store.dispatch('resumeWorkFlow', this.workflowId)
      },

      //subtask
      async subTaskRemove(subtaskId) {
        await this.$store.dispatch('deleteSubTask', {taskId: this.taskId, subtaskId})
      },

      async createSubTask() {
        await this.$store.dispatch('createSubTask', this.taskId)
      },
      async subTaskSave(subtask) {
        await this.$store.dispatch('saveSubTask', {taskId: this.taskId, subtask})
      },
      async startSubTask(subtaskId) {
        await this.$store.dispatch('startSubTask', {taskId: this.taskId, subtaskId})
      },
      async stopSubTask(subtaskId) {
        await this.$store.dispatch('stopSubTask', {taskId: this.taskId, subtaskId})
      },
   
      clearConsole(subtaskId) {
        this.$store.commit(types.CLEAR_SUBTASK_MESSAGES, subtaskId)
      }
    },
    components: {
      subTask
    },
    watch: {
      workflow: {
        handler(workflow) {
          console.log(workflow)
          this.tempWorkFlow = this.getTempWorkFlow(workflow)
        },
        immediate: true,
        deep: true,
      }
    },
    mounted() {
      this.getWorkFlow();
    }
  }
</script>
<style scoped
       lang="less">
  .task-info {
    font-size: 24px;
    > * {
      font-size: 24px
    }
    .op {
      margin-top: 20px;
      > * {
        font-size: 24px
      }
    }
    .interval-input {
      display: inline-flex;
      > input {
        width: 30px;
        margin: 0 5px;
        font-size: 20px;
      }
    }
  }

  .task {
    display: flex;
    flex-wrap: wrap;
    .subTask {
      width: 100%;
      /*padding: 20px 50px;*/
      height: 600px;
      margin-bottom: 40px;
    }
  }

  .add-task {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      font-size: 30px;
    }
  }

</style>
