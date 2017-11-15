<template>
  <div>
    <div class="content">
      <div class="table">
        <div>
          <span>子任务名称</span>
          <input :disabled="!isEditing"
                 :model="tempTask.name" />
        </div>
        <div>
          <span>执行顺序</span>
          <input :disabled="!isEditing"
                 :model="tempTask.order" />
        </div>
        <div>
          <span>服务器</span>
          <input :disabled="!isEditing"
                 :model="tempTask.server" />
        </div>
        <div>
          <span>脚本</span>
          <input :disabled="!isEditing"
                 :model="tempTask.script" />
        </div>
        <div>
          <span>额外参数</span>
          <input :disabled="!isEditing"
                 :model="tempTask.args" />
        </div>

        <!--op-->
        <div style="align-items: center;display: flex;justify-content: center;align-self: center">
          <button v-show="!isEditing"
                  @click="goEdit()">配置子任务
          </button>
          <button v-show="isEditing"
                  @click="finishEdit()">配置完成
          </button>
          <button v-show="isEditing"
                  @click="cancelEdit()">取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      subTask: Object
    },
    data() {
      return {
        isEditing: false,
        tempTask: {},
      }
    },
    methods: {
      goEdit() {
        this.isEditing = true
      },
      cancelEdit() {
        this.tempTask = { ...this.subTask }
        this.isEditing = false
      },
      finishEdit() {
        //todo
      }
    },
    mounted() {
      this.tempTask = { ...this.subTask }
    }
  }

</script>

<style scoped
       lang="less">
  .content {
    padding: 20px 25px;
    .table {
      display: flex;
      flex-direction: column;
      border: solid 1px gray;
      > div {
        display: flex;
        font-size: 24px;
        margin: 20px 0;
        > span {
          width: 30%;
        }
        > input {
          flex-grow: 1;
          margin-right: 40px;
          font-size: 24px;
        }
      }
      button {
        align-self: center;
        font-size: 24px;
        margin: 0 10px;
      }
    }
  }
</style>
