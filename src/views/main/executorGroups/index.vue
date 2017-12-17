<template>
  <div>
    <div class="add-execuor">
      <button @click="addExecutorGroups()">添加执行器组</button>
    </div>
    <div class="executorGroups">
      <div class="executor-group"
           v-for="executorGroup in executorGroups">
        <span>名称：{{executorGroup.name}}</span>
        <div>
          执行器列表:
          <div class="executor"
               v-for="executor in executorGroup.executors">
            <span>名称：{{executor.name}}</span>
            <!--<span>IP：{{executor.ipAddress}}</span>-->
            <span>状态：{{executor.onlineStatus}}</span>
            <span v-if="executorGroupStatus[executor.name]">
              <span>cpu百分比: {{(executorGroupStatus[executor.name].cpuLoad*100).toFixed(2)}}%</span>
              <span>空闲内存: {{(executorGroupStatus[executor.name].freePhysicalMemory/1024/1024).toFixed(2)}}MB</span>
              <span>总内存: {{(executorGroupStatus[executor.name].totalPhysicalMemory/1024/1024).toFixed(2)}}MB</span>
            </span>
          </div>
        </div>
        <div>
          <button @click="removeExecutorGroup(executorGroup.name)"
                  :disabled="executorGroup.name=='default'">移除
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import * as types from '../../../store/mutation-types'

  export default {
    data() {
      return {
        executorGroups: [],
      }
    },
    computed: {
      executorGroupStatus() {
        return this.$store.state.messages.executorGroupStatus
      }
    },
    methods: {
      async addExecutorGroups() {
        const name = await this.$swal({
                                        text: '请输入执行器组名称',
                                        content: 'input',
                                        buttons: true,
                                      })
        if (name === null) return
        if (!name) {
          await this.$swal({
                             text: '必须输入名称',
                             icon: 'error',
                           })
          this.addExecutorGroups()
        } else {
          const executorName = await this.$store.dispatch('createExecutorGroup', {name})
          this.$swal.stopLoading()
          this.$swal.close()
//          this.$router.push({path: `/workflow/${workflowId}`})
          this.getExecutorGroups()
        }
      },

      async removeExecutorGroup(name) {
        const confirm = await this.$swal({
                                           title: '确定删除',
                                           text: '删除整个组，但是还在运行的执行机还是会重新生成这个组，会清空当前组下的所有执行机记录',
                                           buttons: {
                                             cancel: {
                                               text: 'Cancel',
                                               visible: true,
                                               closeModal: true,
                                             },
                                             confirm: {
                                               text: 'OK',
                                               closeModal: true
                                             }
                                           },
                                         })
        if (confirm) {
          await this.$store.dispatch('deleteExecutorGroup', name)
          this.getExecutorGroups()
        }
      },
      async getExecutorGroups() {
        this.executorGroups = await this.$store.dispatch('getExecutorGroups')
      },
    },
    mounted() {
      this.getExecutorGroups()
    }
  }
</script>
<style lang="less"
       scoped>
  .executorGroups {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    .executor-group {
      display: flex;
      justify-content: space-between;
      margin: 10px;
      align-items: center;
      width: 100%;
      border: 1px solid black;
      padding: 10px;
      .executor {
        display: flex;
        span {
          margin: 10px;
        }
      }
    }
  }

  .add-execuor {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      font-size: 20px;
    }
  }

</style>
