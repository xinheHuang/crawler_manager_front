<template>
  <div>
    <div class="content">
      <div style="display: flex">
        <div class="console">
          <p v-for="log in logs"
             style="margin-bottom:10px;text-align: left">
            {{log}}
            <span style="display: block">===================</span>
          </p>
        </div>
        <div class="status">
          <span>脚本状态：{{tempTask.status}}</span>
          <button v-show="tempTask.status!=='start'"
                  @click="$emit('start')">开始任务
          </button>
          <button v-show="tempTask.status=='start'"
                  @click="$emit('stop')">停止任务
          </button>
        </div>
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
            <option disabled
                    :value="undefined">请选择一个服务器
            </option>
            <option v-for="server in servers"
                    :value="server.serverId">{{server.name}} {{server.type}}
            </option>
          </select>

        </div>
        <div>
          <span>脚本</span>

          <select :disabled="!isEditing"
                  v-model="tempTask.scriptId">
            <option disabled
                    :value="undefined">请选择一个爬虫脚本
            </option>
            <option v-for="script in scripts"
                    :value="script.scriptId">{{script.name}} {{script.fileName}}
            </option>
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
        <button @click="$emit('clear')">清空console</button>
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    props: {
      subTask: Object,
      servers: Object,
      scripts: Object,
      subTaskSave: Function,
      subTaskRemove: Function,
      edit: {
        type: Boolean,
        default: false,
      },
      logs: Array
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
        this.tempTask = {...this.subTask}
        this.isEditing = false
      },
      async finishEdit() {
        await this.subTaskSave(this.tempTask)
        this.isEditing = false
      },

    },
    watch: {
      subTask: {
        handler(subTask) {
          this.tempTask = {...subTask}
        },
        immediate: true
      }
    }
  }

</script>

<style scoped
       lang="less">
  .content {
    padding: 20px 25px;
    height: 100%;
    display: flex;
    >div{
      width: calc(50% - 15px);
      align-self: stretch;
      flex-grow: 0;
      flex-shrink: 0;
      padding: 30px;
      border: solid 1px gray;
      margin-right: 50px;
      .console {
        overflow: auto;
        font-size: 18px;
        border: solid 1px gray;
        margin-right: 20px;
        flex-grow: 1;
      }
      .status{
        flex-shrink: 0;
        display: flex;
        >*{
          font-size: 20px;
          margin-bottom: 10px;
        }
        flex-direction: column;
      }
    }
    .table {
      flex-grow: 0;
      display: flex;
      flex-direction: column;
      border: solid 1px gray;
      > div {
        display: flex;
        font-size: 24px;
        margin: 20px 0;
        > span {
          flex-shrink: 0;
          width: 30%;
        }
        > input, select  {
          width: 60%;
          flex-grow: 0;
          flex-shrink: 1;
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
