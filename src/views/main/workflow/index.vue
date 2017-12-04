<template>
  <div class="task-info">
    <label for="name">名称：</label><input id="name" v-model="tempWorkFlow.name"
                                        :disabled="!isEditing">

    <input type="radio"
           id="circle"
           :disabled="!isEditing"
           :value="true"
           v-model="tempWorkFlow.isCircleScheduled" /><label
    for="circle">周期执行</label>
    <input type="radio"
           id="single"
           :disabled="!isEditing"
           :value="false"
           v-model="tempWorkFlow.isCircleScheduled" /><label
    for="single">单次执行</label>

    <div v-if="tempWorkFlow.isCircleScheduled" style="display: inline-block">
      <label for="interval" style="margin-left: 10px">间隔：</label>
      <span v-if="!isEditing"
            id="interval">{{tempWorkFlow.runInterval ? getDayHourMinuteFromTime(tempWorkFlow.runInterval) : '未配置'}}</span>
      <div class="interval-input"
           v-else>
        <input v-model="tempWorkFlow.days">天
        <input v-model="tempWorkFlow.hours">小时
        <input v-model="tempWorkFlow.minutes">分钟
      </div>
    </div>
    <button @click="saveWorkFlow()"
            v-show="isEditing">保存
    </button>
    <button @click="cancelEdit()"
            v-show="isEditing">取消
    </button>
    <button @click="goEdit()"
            v-show="!isEditing">编辑
    </button>
    <div class="op">
      <span style="margin-right: 20px">工作流状态：{{workflow.status}}</span>
      <button
        @click="startWorkFlow()">开始工作流
      </button>
      <!--<button @click="stopWorkFlow()">停止工作流-->
      <!--</button>-->
      <button @click="resumeWorkFlow()">继续工作流
      </button>
    </div>

    <div>
      <div v-for="(jobgroup,index) in jobgourps" :key="jobgroup.id" class="jobGroup">

        <div class="job-group-info">
          <div>
            <label for="jobGroupName">名称:</label>
            <input v-if="jobGroupEditing==jobgroup.id"
                   id="jobGroupName"
                   v-model="tempJobGroup.name" />
            <span v-else>{{jobgroup.name}}</span>

            <label for="order">次序:</label>
            <input v-if="jobGroupEditing==jobgroup.id" id="order" v-model="tempJobGroup.step" />
            <span v-else>{{jobgroup.step}}</span>

            <label>状态:</label><span>{{jobgroup.status}}</span>
          </div>
          <div>
            <button v-if="jobGroupEditing!=jobgroup.id" @click="goJobGroupEdit(jobgroup)">编辑
            </button>
            <button v-if="jobGroupEditing==jobgroup.id" @click="cancelJobGroupEdit()">取消</button>
            <button v-if="jobGroupEditing==jobgroup.id" @click="saveJobGroup(tempJobGroup,index)">
              确定
            </button>
          </div>
        </div>
        <job :key="job.id"
             :job="job"
             :executorGroups="executorGroups"
             :jobSave="saveJob"
             @remove="deleteJob(jobgroup.id,job.id)"
             @start="startJob(job.id)"
             v-for="job in jobGroupJobs[jobgroup.id]">
        </job>
        <button @click="createJob(jobgroup.id)">添加工作</button>
      </div>

      <div class="add-task">
        <button @click="createJobGroup()">添加任务组</button>
      </div>
    </div>
  </div>
</template>
<script>
  import job from '../../../components/job.vue'
  import * as types from '../../../store/mutation-types'
  import util from '../../../utils/index'

  export default {
    data() {
      return {
        tempWorkFlow: {},
        isEditing: false,
        workflow: {},
        jobgourps: [],
        tempJobGroup: null,
        jobGroupJobs: {},
        jobGroupEditing: null,
        executorGroups:[],
        tempJob:{}
      }
    },
    props: ['workflowId'],
    computed: {
      subtaskMessages() {
        return this.$store.state.messages.subtaskMessages
      },
    },
    methods: {
      getDayHourMinuteFromTime(time) {
        return util.getDayHourMinuteFromTime(time)
      },
      //task
      goEdit() {
        this.isEditing = true
      },
      cancelEdit() {  //编辑task
        this.isEditing = false
        this.tempWorkFlow = this.getTempWorkFlow()
      },

      async getWorkFlow() {
        this.workflow = await this.$store.dispatch('getWorkFlow', this.workflowId)
        this.jobgourps = await this.$store.dispatch('getWorkFlowJobGroups', this.workflowId)
        this.jobgourps.forEach(({ id }) => {
          this.getJobGroupJobs(id)
        })
      },

      getTempWorkFlow(workflow = this.workflow) {
        const { days, hours, minutes } = util.getDayHourMinute(workflow.runInterval)
        return {
          ...workflow,
          isCircleScheduled: workflow.isCircleScheduled || false,
          days,
          hours,
          minutes,
        }
      },

      async saveWorkFlow() {
        const { days, hours, minutes } = this.tempWorkFlow
        this.tempWorkFlow.runInterval = util.getTimeFromDayHourMinute(days, hours, minutes)
        await this.$store.dispatch('saveWorkFlow', this.tempWorkFlow)
        this.isEditing = false
      },

      async startWorkFlow() {
        await this.$store.dispatch('startWorkFlow', this.workflowId)
      },

      async stopWorkFlow() {
        await this.$store.dispatch('stopWorkFlow', this.workflowId)
      },

      async resumeWorkFlow() {
        await this.$store.dispatch('resumeWorkFlow', this.workflowId)
      },

      async createJobGroup() {
        await this.$store.dispatch('createJobGroup', {
          step: 0,
          name: '',
          workFlowId: this.workflowId
        })
      },

      async saveJobGroup(jobGroup, index) {
        try {
          await this.$store.dispatch('saveJobGroup', jobGroup)
          this.jobgourps[index] = jobGroup
        }finally {
          this.cancelJobGroupEdit()
        }
      },
      cancelJobGroupEdit() {
        this.jobGroupEditing = null
        this.tempJobGroup = null
      },
      goJobGroupEdit(jobGroup) {
        this.jobGroupEditing = jobGroup.id
        this.tempJobGroup = { ...jobGroup }
      },

      async createJob(jobGroupId){
        await this.$store.dispatch('createJob',{
          jobGroupId,
          executorGroup:{
            name:'default'
          }
        })
        this.getJobGroupJobs(jobGroupId)
      },
      async startJob(jobId){
        await this.$store.dispatch('startJob',jobId)
      },
      async saveJob(job){
        await this.$store.dispatch('saveJob',job)
        this.getJobGroupJobs(job.jobGroupId)
      },

      async deleteJob(jobGroupId,jobId){
        await this.$store.dispatch('deleteJob',jobId)
        this.getJobGroupJobs(jobGroupId)
      },

      async getJobGroupJobs(jobGroupId){
        this.$set(this.jobGroupJobs,jobGroupId,await this.$store.dispatch('getJobGroupJobs', jobGroupId))
      },

      clearConsole(subtaskId) {
        this.$store.commit(types.CLEAR_SUBTASK_MESSAGES, subtaskId)
      }
    },
    components: {
      job
    },
    watch: {
      workflow: {
        handler(workflow) {
          console.log(workflow)
          this.tempWorkFlow = this.getTempWorkFlow(workflow)
        },
        immediate: true,
        deep: true,
      }
    },
    async mounted() {
      this.executorGroups = await this.$store.dispatch('getExecutorGroups')
      this.getWorkFlow()
    }
  }
</script>
<style scoped
       lang="less">
  .task-info {
    font-size: 24px;
    > * {
      font-size: 24px
    }
    .op {
      margin-top: 20px;
      > * {
        font-size: 24px
      }
    }
    .interval-input {
      display: inline-flex;
      > input {
        width: 30px;
        margin: 0 5px;
        font-size: 20px;
      }
    }
  }

  .jobGroup {
    border: 1px solid black;
    padding: 20px;
    margin: 20px 0;
    width: 100%;
    .job-group-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      label {
        margin-left: 20px;
      }
    }

    .subTask {
      width: 100%;
      /*padding: 20px 50px;*/
      height: 600px;
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
