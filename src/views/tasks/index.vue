<template>
  <div>
    <h1>任务管理器</h1>
    <div class="tasks">
      <task v-for="task in tasks"
            class="task"
            :task="task"
            :key="task.taskId"
            @startTask="startTask(task.taskId)"
            @stopTask="stopTask(task.taskId)"
            @deleteTask="removeTask(task.taskId)"
            @clear="clearConsole(task.taskId)"
            :logs="getMessageName(taskMessages[task.taskId])"
      ></task>
      <div class="add-task">
        <button @click="addTask()">添加任务</button>
      </div>
    </div>
  </div>
</template>
<script>
  import task from '../../components/task.vue'
  import * as types from '../../store/mutation-types'
  export default {
    components: {
      task
    },
    data() {
      return {}
    },
    computed: {
      taskMessages() {
        return this.$store.state.messages.taskMessages
      },
      tasks() {
        return this.$store.state.tasks.tasks
      },

    },
    methods: {
      getMessageName(messages = []){
        return messages.map(({subtaskId,message})=> ({
          subtaskName: subtaskId ? this.$store.getters.subTasks[subtaskId].name : null,
          message,
        }))
      },
      async addTask() {
        const name = await this.$swal({
                                        text: '请输入任务名称',
                                        content: 'input',
                                        buttons: true,
                                      })
        if (name === null) return
        if (!name) {
          await this.$swal({
                             text: '必须输入名称',
                             icon: 'error',
                           })
          this.addTask()
        } else {
          const taskId = await this.$store.dispatch('createTask', {name})
          this.$swal.stopLoading()
          this.$swal.close()
          this.$router.push({path: `/task/${taskId}`})
        }
      },
      async startTask(taskId) {
        await this.$store.dispatch('startTask',taskId)
      },

      async stopTask(taskId) {
        await this.$store.dispatch('stopTask',taskId)
      },

      async removeTask(taskId) {
        await this.$store.dispatch('deleteTask', taskId)
      },

      clearConsole(taskId){
        this.$store.commit(types.CLEAR_TASK_MESSAGES,taskId)
      }
    },
    mounted() {

    }
  }
</script>
<style scoped>
  .tasks {
    display: flex;
    flex-wrap: wrap;
  }

  .task {
    width: 50%;
    /*padding: 20px 50px;*/
    height: 500px;
    margin-bottom: 40px;
  }

  .add-task {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .add-task button {
    font-size: 30px;
  }
</style>
