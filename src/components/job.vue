<template>
  <div>

    <b-card bg-variant="light">
      <div class="job">
        <div class="detail">
          <b-badge v-b-tooltip.hover title="任务名称" :variant="'info'">
            {{job.name}}
          </b-badge>
          <b-badge v-b-tooltip.hover title="任务状态" :variant="getStatusVariant(job.status)">
            {{job.status}}
          </b-badge>
        </div>
        <div class="op">

          <b-btn
            variant="danger"
            size="sm"
            @click="$emit('stop')"
            v-if="job.status=='RUNNING'">停止任务
          </b-btn>
          <b-btn
            variant="primary"
            size="sm"
            v-else
            @click="$emit('start')">开始任务
          </b-btn>
          <b-btn :variant="!showLog?'info':'secondary'" :size="'sm'"
                 @click="showLog = !showLog"
                 :class="showLog ? 'collapsed' : null"
                 :aria-controls="`job${job.id}`"
                 :aria-expanded="showLog ? 'true' : 'false'">
            {{showLog ? '隐藏' : '显示'}}日志
          </b-btn>
          <b-btn variant="danger" size="sm" @click="$emit('remove')">
            <icon name="trash"></icon>
          </b-btn>
          <b-btn size="sm" @click="showConfig = !showConfig">
            <icon name="cog"></icon>
          </b-btn>
        </div>
      </div>
      <b-collapse :id="`job${job.id}`" class="mt-2" v-model="showLog">
        <log :logs="logs" @clear="$emit('clear')"></log>
      </b-collapse>
    </b-card>
    <b-modal v-model="showConfig"
             ref="modal"
             title="修改任务"
             @ok="finishEdit"
             @shown="goEdit">
      <form>

        <b-form-group horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="任务名称"
                      label-for="name">
          <b-form-input id="name" v-model="tempJob.name"></b-form-input>
        </b-form-group>


        <b-form-group horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="任务名称"
                      label-for="script">
          <b-form-textarea id="script"
                           v-model="tempJob.script"
                           placeholder="脚本"
                           :rows="3"
                           :max-rows="3">
          </b-form-textarea>
        </b-form-group>

        <b-form-group horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="执行组"
                      label-for="executor-group">
          <b-form-select v-model="tempJob.executorGroup.name"
                         id="executor-group"
                         :options="executorGroupOptions">
            <template slot="first">
              <option disabled
                      :value="undefined">请选择一个执行组
              </option>
            </template>
          </b-form-select>
        </b-form-group>
      </form>
    </b-modal>
  </div>

</template>

<script>
  import log from './log.vue'
  import utils from '../utils'

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
    computed: {
      executorGroupOptions() {
        return this.executorGroups.map(({ name }) => {
          return {
            text: name,
            value: name,
          }
        })
      }
    },
    data() {
      return {
        showLog: true,
        tempJob: {},
        showConfig: this.edit,
      }
    },
    methods: {
      getStatusVariant: utils.getStatusVariant,
      goEdit() {
        this.tempJob = { ...this.job }
      },
      async finishEdit() {
        await this.jobSave(this.tempJob)
      },

    },
    watch: {
      job: {
        handler(job) {
          this.tempJob = { ...job }
        },
        immediate: true
      }
    },
    components: {
      log
    }
  }

</script>

<style scoped
       lang="less">

  .job {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > * {
      display: flex;
      align-items: center;
      > * {
        margin: 0 10px
      }
    }
    .detail {
      font-size: 24px;
    }
    .op {
    }
  }

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
