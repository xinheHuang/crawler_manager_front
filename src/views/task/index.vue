<template>
  <div class="task-info">
    名称：<input v-model="tempTask.name" :disabled="!isEditing">
    间隔：<input v-model="tempTask.interval" :disabled="!isEditing">
    <button @click="saveTask()" v-show="isEditing">保存</button>
    <button @click="cancelEdit()" v-show="isEditing">取消</button>
    <button @click="goEdit()" v-show="!isEditing">编辑</button>
    <div class="task">
      <subTask :key="subtask.subtaskId" v-for="subtask in task.subTasks" class="subTask"
               :subTask="subtask"
               :servers="servers"
               :subTaskSave="subTaskSave"
               @remove="subTaskRemove(subtask.subtaskId)"
               :logs="subtaskMessages[subtask.subtaskId]"
               :scripts="scripts"/>
      <div class="add-task">
        <button @click="createSubTask()">添加子任务</button>
      </div>
    </div>
  </div>
</template>
<script>
  import subTask from '../../components/subTask.vue'

  export default {
    data() {
      return {
        task: {},
        servers: [],
        scripts: [],
        tempTask:{},
        isEditing:false
      }
    },
    props: ['taskId'],
    mounted() {
      Promise.all([this.$http.get('/api/servers'), this.$http.get('/api/scripts')])
        .then(([servers, scripts]) => {
          this.servers = servers
          this.scripts = scripts
          this.getTask()
        })

    },
    computed:{
      subtaskMessages(){
        return this.$store.state.messages.subtaskMessages
      }
    },
    methods: {
      async subTaskRemove(id){
        await this.$http.delete(`/api/subtask/${id}`)
        await this.getTask();
      },
      goEdit(){
        this.isEditing=true;
      },
      async saveTask(){
        await this.$http.put(`/api/task/${this.taskId}`,this.tempTask)
        await this.getTask();
        this.isEditing=false;
      },
      cancelEdit(){
        this.isEditing=false;
        this.tempTask={...this.task}
      },
      async getTask() {
        await this.$http.get(`/api/task/${this.taskId}`)
          .then((task) => {
            this.task = task
            this.tempTask={...task}
          })
      },
      async createSubTask() {
        const subTaskId = await this.$http.post(`/api/task/${this.taskId}/subtasks`)
        await this.getTask()
      },
      async subTaskSave(subtask){
        await this.$http.put(`/api/subtask/${subtask.subtaskId}`,subtask)
        await this.getTask();
      }
    },
    components: {
      subTask
    }
  }
</script>
<style scoped
       lang="less">
  .task-info{
    font-size: 24px;
    >* {
        font-size: 24px
    }
  }
  .task {
    display: flex;
    flex-wrap: wrap;
    .subTask {
      width: 100%;
      /*padding: 20px 50px;*/
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
