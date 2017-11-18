<template>
  <div>
    <div class="content">
      <div class="console">
        <p v-for="log in logs" style="margin-bottom:10px;text-align: left">
          {{log}}
          <span style="display: block">===================</span>
        </p>
      </div>
      <div class="table">
        <div>
          <span>子任务名称</span>
          <input :disabled="!isEditing"
                 v-model="tempTask.name"/>
        </div>
        <div>
          <span>执行顺序</span>
          <input :disabled="!isEditing"
                 type="number"
                 min="0"
                 v-model="tempTask.order"/>
        </div>
        <div>
          <span>服务器</span>

          <select :disabled="!isEditing"
                  v-model="tempTask.serverId">
            <option disabled :value="undefined">请选择一个服务器</option>
            <option v-for="server in servers" :value="server.serverId">{{server.name}} {{server.type}}</option>
          </select>

        </div>
        <div>
          <span>脚本</span>

          <select :disabled="!isEditing"
                  v-model="tempTask.scriptId">
            <option disabled :value="undefined">请选择一个爬虫脚本</option>
            <option v-for="script in scripts" :value="script.scriptId">{{script.name}} {{script.fileName}}</option>
          </select>
        </div>
        <div>
          <span>额外参数</span>
          <input :disabled="!isEditing"
                 v-model="tempTask.args"/>
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
          <button @click="$emit('remove')">删除子任务</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      subTask: Object,
      servers: Array,
      scripts: Array,
      subTaskSave: Function,
      subTaskRemove:Function,
      edit: {
        type: Boolean,
        default: false,
      },
      logs:Array
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
      async finishEdit() {
        await this.subTaskSave(this.tempTask)
        this.isEditing = false
        this.tempTask = { ...this.subTask }
      }
    },
    mounted() {
      console.log(this.subTask)
      this.tempTask = { ...this.subTask }
    }
  }

</script>

<style scoped
       lang="less">
  .content {
    padding: 20px 25px;
    display: flex;
    .console {
      width: 50%;
      align-self: stretch;
      overflow: auto;
      font-size: 18px;
      flex-grow: 1;
      border: solid 1px gray;
      margin-right: 50px;
    }
    .table {
      width: 50%;
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
        > input, select {
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
