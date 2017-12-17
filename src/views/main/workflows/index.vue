<template>
  <div>
    <div class="tasks">
      <workflow v-for="workflow in workflows"
            class="task"
            :workflow="workflow"
            :key="workflow.id"
            @startWorkFlow="startWorkFlow(workflow.id)"
            @stopWorkFlow="stopWorkFlow(workflow.id)"
                @resumeWorkFlow="resumeWorkFlow(workflow.id)"
            @removeWorkFlow="removeWorkFlow(workflow.id)"
            @clear="clearConsole(workflow.id)"
            :logs="getMessageName(workFlowLogs[workflow.id])"
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
//        workflows: [],
      }
    },
    computed: {
      workFlowLogs() {
        return this.$store.state.messages.workFlowLogs
      },
      workflows() {
        return this.$store.state.job.workflows
      },

    },
    methods: {
      getMessageName(messages = []) {
        return messages.map(({jobId, error,content}) => ({
          jobName: jobId ? jobId : null,
          error,
          content
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
        console.log('start')
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
        this.$store.dispatch('getWorkFlows')
      },
      clearConsole(workFlowId) {
        this.$store.commit(types.CLEAR_WORKFLOW_MESSAGES, workFlowId)
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
