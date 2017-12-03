<template>
  <div>
    <div class="executorGroups">
      <div class="execuor-group" v-for="executorGroup in executorGroups">
        <span>名称：{{executorGroup.name}}</span>
      </div>
      <div class="add-execuor">
        <button @click="addExecutorGroups()">添加执行器组</button>
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
          this.getExecutorGroups();
        }
      },

      async removeExecutorGroup(name) {
        await this.$store.dispatch('deleteExecutorGroup', name)
        this.getExecutorGroups();
      },
      async getExecutorGroups(){
        this.executorGroups = await this.$store.dispatch('getExecutorGroups')
      },
    },
    mounted() {
     this.getExecutorGroups()
    }
  }
</script>
<style scoped>
  .executorGroups {
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

  .add-execuor {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .add-execuor button {
    font-size: 30px;
  }
</style>
