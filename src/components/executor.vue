<template>
  <b-card bg-variant="light" style="text-align: left;font-size: 24px">
    <b-badge v-b-tooltip.hover title="名称">{{executor.name}}</b-badge>
    <b-badge v-b-tooltip.hover title="状态" :variant="executor.status==='ONLINE'?'success':'danger'">{{executor.status}}</b-badge>
    <!--<b-badge v-b-tooltip.hover title="IP">{{executor.IP}}</b-badge>-->
    <b-badge v-b-tooltip.hover title="CPU百分比" :variant="executor.cpu?'warning':'dark'">{{executor.cpu || '不可用'}}</b-badge>
    <b-badge v-b-tooltip.hover title="空闲内存" :variant="executor.freeMem?'warning':'dark'">{{executor.freeMem || '不可用'}}</b-badge>
    <b-badge v-b-tooltip.hover title="总内存" :variant="executor.totalMem?'warning':'dark'">{{executor.totalMem || '不可用'}}</b-badge>
  </b-card>
</template>

<script>
  export default {
    props: {
      executor: Object,
    },
  }

</script>

<style scoped
       lang="less">
</style>

