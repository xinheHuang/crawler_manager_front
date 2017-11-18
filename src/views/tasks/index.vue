<template>
  <div>
    <h1>任务管理器</h1>
    <div class="tasks">
      <task v-for="(task,index) in tasks"
            class="task"
            :task="task"
            @startTask="startTask(task)"
            @stopTask="stopTask(task)"
            @deleteTask="removeTask(task,index)"
            :logs="taskMessages[task.taskId]"
      ></task>
      <div class="add-task">
        <button @click="addTask()">添加任务</button>
      </div>
    </div>
  </div>
</template>
<script>
  import task from '../../components/task.vue'

  export default {
    components: {
      task
    },
    data() {
      return {
        tasks: Array,
      }
    },
    computed:{
      taskMessages(){
        return this.$store.state.messages.taskMessages
      }
    },
    methods: {
      async addTask() {
        //todo
        const name = await this.$swal({
          text: '请输入任务名称',
          content: 'input',
          buttons: true,
        })
        if (name ===null) return
        if (!name) {
          await this.$swal({
            text: '必须输入名称',
            icon: 'error',
          })
          this.addTask()
        } else {
          try {
            const taskId = await this.$http.post('/api/tasks', { name })
            this.$swal.stopLoading()
            this.$swal.close()
            this.$router.push({ path: `/task/${taskId}` })
          }
          catch (e) {
            this.$swal('Oh noes!', 'The AJAX request failed!', 'error')
          }
        }
      },
      async getTasks() {
        this.tasks = await this.$http.get('/api/tasks')
      },
      async startTask(task) {
        await this.$http.post(`/api/task/${task.taskId}/start`)
        task.status = 'start'
      },

      async stopTask(task) {
        await this.$http.post(`/api/task/${task.taskId}/stop`)
        task.status = 'stop'
      },

      async removeTask(task,index) {
        await this.$http.delete(`/api/task/${task.taskId}`)
        this.tasks.splice(index,1);
      }
    },
    mounted() {
      this.getTasks()
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
