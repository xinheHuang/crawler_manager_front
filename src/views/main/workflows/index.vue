<template>
  <div>
    <div class="tasks">
      <workflow v-for="workflow in workflows"
            class="task"
            :workflow="workflow"
            :key="workflow.id"
            @startTask="startWorkFlow(workflow.id)"
            @stopTask="stopWorkFlow(workflow.id)"
            @deleteTask="removeWorkFlow(workflow.id)"
            @clear="clearConsole(workflow.id)"
            :logs="getMessageName(taskMessages[workflow.id])"
      />
      <div class="add-task">
        <button @click="addWorkFlow()">添加工作流</button>
      </div>
    </div>
  </div>
</template>
<script>
  import workflow from '../../../components/workflow.vue'
  import * as types from '../../../store/mutation-types'

  export default {
    components: {
      workflow
    },
    data() {
      return {
        workflows: [],
      }
    },
    computed: {
      taskMessages() {
        return this.$store.state.messages.taskMessages
      },
//      tasks() {
//        return this.$store.state.tasks.tasks
//      },

    },
    methods: {
      getMessageName(messages = []) {
        return messages.map(({subtaskId, message}) => ({
          subtaskName: subtaskId ? this.$store.getters.subTasks[subtaskId].name : null,
          message,
        }))
      },
      async addWorkFlow() {
        const name = await this.$swal({
                                        text: '请输入工作流名称',
                                        content: 'input',
                                        buttons: true,
                                      })
        if (name === null) return
        if (!name) {
          await this.$swal({
                             text: '必须输入名称',
                             icon: 'error',
                           })
          this.addWorkFlow()
        } else {
          const workflowId = await this.$store.dispatch('createWorkFlow', {name})
          this.$swal.stopLoading()
          this.$swal.close()
          this.$router.push({path: `/workflow/${workflowId}`})
        }
      },
      async startWorkFlow(workflowId) {
        await this.$store.dispatch('startWorkFlow', workflowId)
      },

      async stopWorkFlow(workflowId) {
        await this.$store.dispatch('stopWorkFlow', workflowId)
      },

      async removeWorkFlow(workflowId) {
        await this.$store.dispatch('deleteWorkFlow', workflowId)
        this.getWorkFlows();
      },
      async getWorkFlows(){
        this.workflows = await this.$store.dispatch('getWorkFlows')
      },
      clearConsole(taskId) {
        this.$store.commit(types.CLEAR_TASK_MESSAGES, taskId)
      }
    },
    mounted() {
     this.getWorkFlows()
    }
  }
</script>
<style scoped>
  .tasks {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .task {
    width: 49%;
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
