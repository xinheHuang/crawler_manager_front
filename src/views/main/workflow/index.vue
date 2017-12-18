<template>
  <div id="workflow-info">
    <b-form inline style="justify-content: space-between">
      <div style="display: flex">
        <b-badge class="status" v-b-tooltip.hover title="状态"
                 :variant="getStatusVariant(workflow.status)"
        >{{workflow.status}}
        </b-badge>
        <b-input class="mb-2 mr-sm-2 mb-sm-0"
                 v-model="tempWorkFlow.name"
                 :disabled="!isEditing" />
        <b-form-radio-group v-model="tempWorkFlow.isCircleScheduled"
                            :disabled="!isEditing"
                            :options="[{text:'周期执行',value:true},{text:'单次执行',value:false},]">
        </b-form-radio-group>

        <b-form-group v-if="tempWorkFlow.isCircleScheduled" style="align-items: center">
          <span v-if="!isEditing">{{tempWorkFlow.runInterval ? getDayHourMinuteFromTime(tempWorkFlow.runInterval) :
            '未配置'}}</span>
          <div class="interval-input" v-else>
            <b-input class="mb-2 mr-sm-2 mb-sm-0" v-model="tempWorkFlow.days" />
            天
            <b-input class="mb-2 mr-sm-2 mb-sm-0" v-model="tempWorkFlow.hours" />
            小时
            <b-input class="mb-2 mr-sm-2 mb-sm-0" v-model="tempWorkFlow.minutes" />
            分钟
          </div>
        </b-form-group>
      </div>
      <div class="op">
        <b-button variant="primary" v-show="isEditing" @click="saveWorkFlow()">
          保存
        </b-button>
        <b-button @click="cancelEdit()"
                  variant="danger"
                  v-show="isEditing">取消
        </b-button>
        <b-button @click="goEdit()"
                  variant="info"
                  v-show="!isEditing">编辑
        </b-button>

        <div style="display: flex" v-show="!isEditing">
          <b-button
            v-show="workflow.status=='INIT' || workflow.status=='FAILED' || workflow.status=='STOPPED' || workflow.status=='FINISHED'"
            variant="primary"
            @click="startWorkFlow()">开始工作流
          </b-button>
          <b-button @click="stopWorkFlow()" v-show="workflow.status=='RUNNING'" variant="danger">
            停止工作流
          </b-button>
          <b-button v-show="workflow.status=='FAILED' || workflow.status=='STOPPED'"
                    variant="warning"
                    @click="resumeWorkFlow()">继续工作流
          </b-button>
        </div>
      </div>
    </b-form>
    <b-row style="margin-top: 30px">
      <b-button variant="primary" @click="createJobGroup()">
        添加任务组
      </b-button>
    </b-row>
    <div>
      <!--<draggable v-model="jobgourps">-->
      <jobGroup v-for="(jobgroup,index) in jobgourps"
                :jobGroup="jobgroup"
                :saveJobGroup="saveJobGroup"
                style="margin: 20px 0"
                @remove="deleteJobGroup(jobgroup.id)"
                :executorGroups="executorGroups"
                :key="jobgroup.id" />
      <!--</draggable>-->
    </div>
  </div>
</template>
<script>
  //  import job from '../../../components/job.vue'
  import jobGroup from '../../../components/jobGroup.vue'
  import * as types from '../../../store/mutation-types'
  import util from '../../../utils/index'
  import draggable from 'vuedraggable'

  export default {
    data() {
      return {
        tempWorkFlow: {},
        isEditing: false,
        jobgourps: [],
        executorGroups: [],
      }
    },
    props: ['workflowId'],
    computed: {
      workflow() {
        return this.$store.state.job.workflows[this.workflowId] || {}
      },
    },
    methods: {
      getStatusVariant: util.getStatusVariant,
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
        await this.$store.dispatch('getWorkFlow', this.workflowId)
        this.jobgourps = (await this.$store.dispatch('getWorkFlowJobGroups', this.workflowId))
          .sort((a, b) => {
            return a.step - b.step
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
          step: this.jobgourps[this.jobgourps.length - 1].step + 1,
          name: '任务组',
          workFlowId: this.workflowId
        })
        this.getWorkFlow()
      },

      async saveJobGroup(jobGroup, index) {
        await this.$store.dispatch('saveJobGroup', jobGroup)
        this.getWorkFlow()
      },

      async deleteJobGroup(jobGroupId) {
        console.log('delete jobgroup ', jobGroupId)
        await this.$store.dispatch('deleteJobGroup', jobGroupId)
        this.getWorkFlow()
      },


    },
    components: {
      jobGroup,
      draggable
    },
    watch: {
      workflow: {
        handler(workflow) {
          console.log(workflow)
          if (workflow && !this.isEditing)
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

  .interval-input {
    input {
      max-width: 50px;
    }
  }

  .status {
    align-self: center;
    margin-right: 10px;
    font-size: 20px
  }

  .op {
    display: flex;
    button {
      margin: 0 5px;
    }
  }

  /*.task-info {*/
  /*font-size: 24px;*/
  /*> * {*/
  /*font-size: 24px*/
  /*}*/
  /*.op {*/
  /*margin-top: 20px;*/
  /*> * {*/
  /*font-size: 24px*/
  /*}*/
  /*}*/
  /*.interval-input {*/
  /*display: inline-flex;*/
  /*> input {*/
  /*width: 30px;*/
  /*margin: 0 5px;*/
  /*font-size: 20px;*/
  /*}*/
  /*}*/
  /*}*/

  /*.jobGroup {*/
  /*border: 1px solid black;*/
  /*padding: 20px;*/
  /*margin: 20px 0;*/
  /*width: 100%;*/
  /*.job-group-info {*/
  /*display: flex;*/
  /*justify-content: space-between;*/
  /*align-items: center;*/
  /*font-size: 20px;*/
  /*label {*/
  /*margin-left: 20px;*/
  /*}*/
  /*}*/

  /*.subTask {*/
  /*width: 100%;*/
  /*!*padding: 20px 50px;*!*/
  /*height: 600px;*/
  /*margin-bottom: 40px;*/
  /*}*/
  /*}*/

  /*.add-task {*/
  /*width: 50%;*/
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*button {*/
  /*font-size: 30px;*/
  /*}*/
  /*}*/

</style>
