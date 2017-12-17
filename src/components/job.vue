<template>
  <div>
    <div class="content">
      <div>
        <div style="display: flex">
          <div class="console">
            <p v-for="log in logs"
               style="margin-bottom:10px;text-align: left"
               :class="log.error?'error':''">
              {{log.content}}
              <span style="display: block">===================</span>
            </p>
          </div>
          <div class="status">
            <span>任务状态：{{tempJob.status}}</span>
            <button @click="$emit('stop')" v-if="tempJob.status=='RUNNING'">停止任务
            </button>
            <button
              @click="$emit('start')" v-else>开始任务
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="table">
          <div>
            <span>任务名称</span>
            <input :disabled="!isEditing"
                   v-model="tempJob.name"/>
          </div>
          <div>
            <span>执行组</span>
            <select :disabled="!isEditing"
                    v-model="tempJob.executorGroup.name">
              <option disabled
                      :value="undefined">请选择一个执行组
              </option>
              <option v-for="executorGroup in executorGroups"
                      :value="executorGroup.name">{{executorGroup.name}}
              </option>
            </select>

          </div>
          <div>
            <span>脚本</span>
            <textarea :disabled="!isEditing"
                      v-model="tempJob.script"/>
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
  </div>
</template>

<script>

  export default {
    props: {
      job: Object,
      executorGroups: Array,
      jobSave: Function,
      edit: {
        type: Boolean,
        default: false,
      },
      logs: Array
    },
    data() {
      return {
        isEditing: false,
        tempJob: {},
      }
    },
    methods: {
      goEdit() {
        this.isEditing = true
      },
      cancelEdit() {
        this.tempJob = {...this.job}
        this.isEditing = false
      },
      async finishEdit() {
        await this.jobSave(this.tempJob)
        this.isEditing = false
      },

    },
    watch: {
      job: {
        handler(job) {
          this.tempJob = {...job}
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
    > div {
      width: calc(50%);
      align-self: stretch;
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      align-items: stretch;
      > div {
        flex-grow: 1;
        padding: 30px;
        border: solid 1px gray;
        margin: 0 20px;
        .console {
          overflow: auto;
          font-size: 18px;
          border: solid 1px gray;
          margin-right: 20px;
          flex-grow: 1;
          .error {
            color: red
          }
        }
        .status {
          flex-shrink: 0;
          display: flex;
          > * {
            font-size: 14px;
            margin-bottom: 10px;
          }
          flex-direction: column;
        }
      }
    }
    .table {
      flex-grow: 1;
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
        > input, select, textarea {
          width: 60%;
          flex-grow: 0;
          flex-shrink: 1;
          margin-right: 40px;
          font-size: 24px;
        }
      }
      button {
        align-self: center;
        font-size: 18px;
        margin: 0 10px;
      }
    }
  }
</style>
