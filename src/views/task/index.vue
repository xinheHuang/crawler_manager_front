<template>
  <div>
    <h1>name</h1>
    <div class="task">
      <subTask v-for="subtask in subTasks"class="subTask"></subTask>
      <div class="add-task">
        <button>添加任务</button>
      </div>
    </div>
  </div>
</template>
<script>
  import subTask from '../../components/subTask.vue'

  export default {
    data() {
      return {}
    },
    props: ['taskId'],
    mounted() {
      //get all subtasks
      this.$http(`/api/task/${this.taskId}/subtasks`)
        .then((subTasks) => {
          this.subTasks = subTasks
        })
    },
    components: {
      subTask
    }
  }
</script>
<style scoped
       lang="less">
  .task {
    display: flex;
    flex-wrap: wrap;
    .subTask {
      width: 50%;
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
