<template>
  <div id="executorGroups">
    <b-row style="margin-bottom: 20px">
      <b-btn variant="primary" @click="addExecutorGroups()">
        添加执行器组
      </b-btn>
    </b-row>
    <executor-group v-for="executorGroup in executorGroups"
                    :executorGroup="executorGroup"
                    :key="executorGroup.id"
                    style="margin-bottom: 10px"
                    @remove="removeExecutorGroup(executorGroup.name)"
                    :executorStatus="executorStatus"/>
  </div>
</template>
<script>
  import * as types from '../../../store/mutation-types'
  import executorGroup from '../../../components/executorGroup.vue'

  export default {
    data() {
      return {
        executorGroups: [],
      }
    },
    computed: {
      executorStatus() {
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
          const executorName = await this.$store.dispatch('createExecutorGroup', { name })
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
        this.executorGroups = (await this.$store.dispatch('getExecutorGroups')).sort((a,b)=>{
          if (a.name === 'default') return -1;
          if (b.name === 'default') return 1;
        })
      },
    },
    mounted() {
      this.getExecutorGroups()
    },
    components: {
      executorGroup
    }
  }
</script>
<style lang="less"
       scoped>

  #executorGroups {
    /*padding: 20px 0;*/
  }
</style>
