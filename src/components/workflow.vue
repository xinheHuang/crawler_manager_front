<template>
  <b-card bg-variant="light">
    <div class="workflow">
      <div class="detail" @click>
        <b-badge v-b-tooltip.hover title="工作流名称">{{workflow.name}}</b-badge>
        <b-badge v-b-tooltip.hover title="工作流间隔">{{getInterval(workflow.interval)}}</b-badge>
        <b-badge v-b-tooltip.hover title="工作流状态" :variant="getStatusVariant(workflow.status)">{{workflow.status}}</b-badge>
      </div>
      <div class="op">
        <b-btn
          variant="primary"
          size="sm"
          v-show="workflow.status=='INIT' || workflow.status=='FAILED' || workflow.status=='STOPPED' || workflow.status=='FINISHED'"
          @click="$emit('startWorkFlow')">开始工作流
        </b-btn>
        <b-btn
          variant="danger"
          size="sm"
          @click="$emit('stopWorkFlow')"
          v-show="workflow.status=='RUNNING'">停止工作流
        </b-btn>
        <b-btn
          variant="warning"
          size="sm"
          v-show="workflow.status=='FAILED' || workflow.status=='STOPPED'"
          @click="$emit('resumeWorkFlow')">继续工作流
        </b-btn>
        <b-btn :variant="!showLog?'info':'secondary'" :size="'sm'"
               @click="showLog = !showLog"
               :class="showLog ? 'collapsed' : null"
               :aria-controls="`workflow${workflow.id}`"
               :aria-expanded="showLog ? 'true' : 'false'">
          {{showLog ? '隐藏' : '显示'}}日志
        </b-btn>
        <b-btn variant="danger" size="sm" @click="$emit('removeWorkFlow')">
          <icon name="trash"></icon>
        </b-btn>
        <b-btn size="sm" @click="$emit('configWorkFlow')">
          <icon name="cog"></icon>
        </b-btn>
      </div>
    </div>
    <b-collapse :id="`workflow${workflow.id}`" class="mt-2" v-model="showLog">
      <log :logs="logs" @clear="$emit('clear')"></log>
    </b-collapse>
  </b-card>
</template>

<script>
  import util from '../utils'
  import log from '../components/log.vue'
  export default {
    props: {
      workflow: Object,
      logs: Array
    },
    data() {
      return {
        showLog: true
      }
    },
    methods: {
      getStatusVariant:util.getStatusVariant,
      getInterval(time) {
        return !time ? '未配置' : util.getDayHourMinuteFromTime(time)
      },
    },
    components:{
      log
    }
  }

</script>

<style scoped
       lang="less">
  .workflow {
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


</style>

