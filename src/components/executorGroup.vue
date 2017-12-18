<template>
  <b-card bg-variant="light">
    <div class="executor-group">
      <div class="info">
        <b-badge v-b-tooltip.hover title="组名称">
          {{executorGroup.name}}
        </b-badge>
      </div>
      <div class="op">
        <b-btn :variant="!showExecutors?'primary':'secondary'" :size="'sm'"
               :disabled="executorGroup.executors.length===0"
               @click="showExecutors = !showExecutors"
               :class="showExecutors ? 'collapsed' : null"
               :aria-controls="`executor-group-${executorGroup.id}`"
               :aria-expanded="showExecutors ? 'true' : 'false'">
          {{showExecutors ? '隐藏' : '显示'}}执行器
          <b-badge v-b-tooltip.hover title="执行器数量" pill style="margin-left: 10px" variant="danger">
            {{executorGroup.executors.length}}
          </b-badge>
        </b-btn>
        <b-btn @click="$emit('remove')"
               :size="'sm'"
               variant="danger"
               :disabled="executorGroup.name=='default'"><icon name="trash"></icon>
        </b-btn>
      </div>
    </div>
    <b-collapse :id="`executor-group-${executorGroup.id}`" v-model="showExecutors">
      <executor
        v-for="executor in executorGroup.executors"
        :executor="getExecutorInfo(executor)"
        style="margin: 20px 0;"
        :key="executor.id"
      />
    </b-collapse>
  </b-card>
</template>

<script>
  import executor from './executor.vue'

  export default {
    props: {
      executorGroup: Object,
      executorStatus: Object,
    },
    data() {
      return {
        showExecutors: this.executorGroup.executors.length > 0,
      }
    },
    components: {
      executor
    },
    methods: {
      getExecutorInfo({ name, ipAddress, onlineStatus }) {
        const basic = {
          name,
          IP: ipAddress,
          status: onlineStatus,
        }
        if (this.executorStatus[name]) {
          basic.cpu = `${(this.executorStatus[name].cpuLoad * 100).toFixed(2)}%`
          basic.freeMem = `${(this.executorStatus[name].freePhysicalMemory / 1024 / 1024).toFixed(2)}MB`
          basic.totalMem = `${(this.executorStatus[name].totalPhysicalMemory / 1024 / 1024 * 100).toFixed(2)}MB`
        }
        return basic
      },
    }
  }

</script>

<style scoped
       lang="less">
  .executor-group {
    display: flex;
    font-size: 24px;
    align-items: center;
    justify-content: space-between;
  }
</style>

