<template>
  <div>
    <b-card bg-variant="light">
      <div class="jobGroup">
        <div class="detail">
          <b-badge v-b-tooltip.hover title="任务组名称" :variant="'info'">
            {{jobGroup.name}}
          </b-badge>
          <b-badge v-b-tooltip.hover title="任务组步骤" :variant="'info'">
            {{jobGroup.step}}
          </b-badge>
        </div>
        <div class="op">

          <b-btn :variant="'primary'" :size="'sm'"
                 @click="createJob()">
            添加任务
          </b-btn>

          <b-btn :variant="!showJobs?'info':'secondary'" :size="'sm'"
                 @click="showJobs = !showJobs"
                 :disabled="!jobGroupJobs[jobGroup.id] || jobGroupJobs[jobGroup.id].length===0"
                 :class="showJobs ? 'collapsed' : null"
                 :aria-controls="`jobGroup${jobGroup.id}`"
                 :aria-expanded="showJobs ? 'true' : 'false'">
            {{showJobs ? '隐藏' : '显示'}}任务
            <b-badge pill variant="danger" v-if="jobGroupJobs[jobGroup.id]">
              {{jobGroupJobs[jobGroup.id].length}}
            </b-badge>
          </b-btn>
          <b-btn variant="danger" size="sm" @click="$emit('remove')">
            <icon name="trash"></icon>
          </b-btn>
          <b-btn size="sm" @click="showConfig = !showConfig">
            <icon name="cog"></icon>
          </b-btn>
        </div>
      </div>
      <b-collapse :id="`jobGroup${jobGroup.id}`" class="mt-2" v-model="showJobs">
        <job
          v-for="job in jobGroupJobs[jobGroup.id]"
          :key="job.id"
          :job="job"
          :executorGroups="executorGroups"
          :jobSave="saveJob"
          @remove="deleteJob(job.id)"
          @start="startJob(job.id)"
          @stop="stopJob(job.id)"
          :logs="jobLogs[job.id]"
          @clear="clearConsole(job.id)"
        />
      </b-collapse>
    </b-card>
    <b-modal v-model="showConfig"
             ref="modal"
             title="修改任务组"
             @ok="finishEdit"
             @shown="goEdit"
    >
      <form>
        <b-form-group horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="任务组名称"
                      label-for="name">
          <b-form-input id="name" v-model="tempJobGroup.name"></b-form-input>
        </b-form-group>

        <b-form-group horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="任务组步骤"
                      label-for="step">
          <b-form-input id="step" v-model="tempJobGroup.step"></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
  import utils from '../utils'
  import job from './job.vue'
  import * as types from '../store/mutation-types'

  export default {
    props: {
      saveJobGroup: Function,
      jobGroup: Object,
      executorGroups: Array,
    },
    computed: {
      jobGroupJobs() {
        return this.$store.state.job.jobGroups || {}
      },
      jobLogs() {
        return this.$store.state.messages.jobLogs
      },
    },
    data() {
      return {
        showJobs: false,
        tempJobGroup: {},
        showConfig: this.edit,
      }
    },
    methods: {
      getStatusVariant: utils.getStatusVariant,
      goEdit() {
        this.tempJobGroup = { ...this.jobGroup }
      },
      async finishEdit() {
        await this.saveJobGroup(this.tempJobGroup)
      },

      async createJob() {
        await this.$store.dispatch('createJob', {
          jobGroupId: this.jobGroup.id,
          name: '新任务',
          executorGroup: {
            name: 'default'
          }
        })
        await this.getJobGroupJobs()
        this.showJobs = true
      },
      async startJob(jobId) {
        await this.$store.dispatch('startJob', jobId)
      },
      async stopJob(jobId) {
        await this.$store.dispatch('stopJob', jobId)
      },
      async saveJob(job) {
        await this.$store.dispatch('saveJob', job)
        this.getJobGroupJobs()
      },

      async deleteJob(jobId) {
        await this.$store.dispatch('deleteJob', jobId)
        this.getJobGroupJobs()
      },

      async getJobGroupJobs() {
        this.$store.dispatch('getJobGroupJobs', this.jobGroup.id)
      },

      clearConsole(jobId) {
        this.$store.commit(types.CLEAR_JOB_MESSAGES, jobId)
      }
    },
    watch: {},
    components: {
      job
    },
    mounted() {
      this.getJobGroupJobs()
    }
  }

</script>

<style scoped
       lang="less">

  .jobGroup {
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
