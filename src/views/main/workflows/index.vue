<template>
  <div id="workflows">
    <b-row style="margin-bottom: 20px">
      <b-button variant="primary" @click="addWorkFlow()">
        添加工作流
      </b-button>
    </b-row>
    <b-row>
      <b-col cols="12" v-for="workflow in workflows">
        <workflow :workflow="workflow"
                  style="margin: 10px 0;"
                  :key="workflow.id"
                  @startWorkFlow="startWorkFlow(workflow.id)"
                  @stopWorkFlow="stopWorkFlow(workflow.id)"
                  @resumeWorkFlow="resumeWorkFlow(workflow.id)"
                  @removeWorkFlow="removeWorkFlow(workflow.id)"
                  @configWorkFlow="configWorkFlow(workflow.id)"
                  @clear="clearConsole(workflow.id)"
                  :logs="getMessageName(workFlowLogs[workflow.id])"
        />
      </b-col>
    </b-row>
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
        return messages.map(({ jobId, error, content,id }) => ({
          name: jobId ? jobId : null,
          error,
          content,
          id
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
          const workflowId = await this.$store.dispatch('createWorkFlow', { name })
          this.$swal.stopLoading()
          this.$swal.close()
          this.$router.push({ path: `/workflow/${workflowId}` })
        }
      },
      async startWorkFlow(workflowId) {
        console.log('start')
        await this.$store.dispatch('startWorkFlow', workflowId)
      },

      async stopWorkFlow(workflowId) {
        await this.$store.dispatch('stopWorkFlow', workflowId)
      },

      configWorkFlow(workflowId) {
        this.$router.push({ path: `/workflow/${workflowId}` })
      },
      async removeWorkFlow(workflowId) {
        await this.$store.dispatch('deleteWorkFlow', workflowId)
        this.getWorkFlows();
      },
      async getWorkFlows() {
        this.$store.dispatch('getWorkFlows')
      },
      clearConsole(workFlowId) {
        this.$store.commit(types.CLEAR_WORKFLOW_MESSAGES, workFlowId)
      }
    },
    mounted() {
//     this.getWorkFlows()
    }
  }
</script>
<style scoped lang="less">
  #workflows {
    /*padding: 20px 0;*/
  }
</style>
