<template>
  <div class="task-info">

    名称：<input v-model="tempTask.name"
              :disabled="!isEditing">
    间隔：
    <span v-if="!isEditing">{{getDayHourMinuteFromTime(tempTask.interval)}}</span>
    <div class="interval-input"
         v-else>
      <input v-model="tempTask.days">天
      <input v-model="tempTask.hours">小时
      <input v-model="tempTask.minutes">分钟
    </div>
    <button @click="saveTask()"
            v-show="isEditing">保存
    </button>
    <button @click="cancelEdit()"
            v-show="isEditing">取消
    </button>
    <button @click="goEdit()"
            v-show="!isEditing">编辑
    </button>
    <div class="op">
      <span style="margin-right: 20px">任务状态：{{task.status}}</span>
      <button
              @click="startTask()">开始任务
      </button>
      <button  @click="stopTask()">停止任务
      </button>
      <button v-show="task.status == 'error'"
              @click="resumeTask()">继续任务
      </button>
    </div>
    <div class="task">
      <subTask :key="subtask.subtaskId"
               v-for="subtask in task.subTasks"
               class="subTask"
               :subTask="subtask"
               :servers="servers"
               :subTaskSave="subTaskSave"
               @remove="subTaskRemove(subtask.subtaskId)"
               :logs="subtaskMessages[subtask.subtaskId]"
               @clear="clearConsole(subtask.subtaskId)"
               @start="startSubTask(subtask.subtaskId)"
               @stop="stopSubTask(subtask.subtaskId)"
               :scripts="scripts" />
      <div class="add-task">
        <button @click="createSubTask()">添加子任务</button>
      </div>
    </div>
  </div>
</template>
<script>
  import subTask from '../../components/subTask.vue'
  import * as types from '../../store/mutation-types'
  import util from '../../utils'

  export default {
    data() {
      return {
        tempTask: {},
        isEditing: false
      }
    },
    props: ['taskId'],
    mounted() {
    },
    computed: {
      subtaskMessages() {
        return this.$store.state.messages.subtaskMessages
      },
      servers() {
        return this.$store.state.tasks.servers
      },
      scripts() {
        return this.$store.state.tasks.scripts
      },
      task() {
        console.log('here tasks')
        return this.$store.state.tasks.tasks
      },
      task() {
        console.log('here')
        return this.$store.state.tasks.tasks[this.taskId] || {}
      },
    },
    methods: {
      getDayHourMinuteFromTime(time) {
        return util.getDayHourMinuteFromTime(time)
      },
      getTempTask(task = this.task) {
        const { days, hours, minutes } = util.getDayHourMinute(task.interval)
        return {
          ...task,
          days,
          hours,
          minutes,
        }
      },
      //task
      goEdit() {
        this.isEditing = true
      },
      cancelEdit() {  //编辑task
        this.isEditing = false
        this.tempTask = this.getTempTask()
      },
      async saveTask() {
        const {days,hours,minutes}=this.tempTask;
        this.tempTask.interval=util.getTimeFromDayHourMinute(days,hours,minutes)
        await this.$store.dispatch('saveTask', this.tempTask)
        this.isEditing = false
      },
      async startTask() {
        await this.$store.dispatch('startTask', this.taskId)
      },

      async stopTask() {
        await this.$store.dispatch('stopTask', this.taskId)
      },

      async resumeTask() {
        await this.$store.dispatch('resumeTask', this.taskId)
      },

      //subtask
      async subTaskRemove(subtaskId) {
        await this.$store.dispatch('deleteSubTask', { taskId: this.taskId, subtaskId })
      },

      async createSubTask() {
        await this.$store.dispatch('createSubTask', this.taskId)
      },
      async subTaskSave(subtask) {
        await this.$store.dispatch('saveSubTask', { taskId: this.taskId, subtask })
      },
      async startSubTask(subtaskId) {
        await this.$store.dispatch('startSubTask', { taskId: this.taskId, subtaskId })
      },
      async stopSubTask(subtaskId) {
        await this.$store.dispatch('stopSubTask', { taskId: this.taskId, subtaskId })
      },

      clearConsole(subtaskId) {
        this.$store.commit(types.CLEAR_SUBTASK_MESSAGES, subtaskId)
      }
    },
    components: {
      subTask
    },
    watch: {
      task: {
        handler(task) {
          this.tempTask = this.getTempTask(task)
        },
        immediate: true,
        deep: true,
      }
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
