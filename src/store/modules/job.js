/**
 * Created by Xinhe on 2017/11/18.
 */
import JobApis from '../../apis/job'
import * as types from '../mutation-types'

// initial state
const state = {
  workflows:{},
  jobGroups:{},
  jobs:{},
}

// getters
const getters = {
  // jobs: (state) => Object.values(state.tasks)
  //   .reduce((prev, task) => ({
  //     ...prev,
  //     ...task.subTasks.reduce((prev, subtask) => ({
  //       ...prev,
  //       [subtask.subtaskId]: subtask
  //     }), {})
  //   }), {})
}

// actions
const actions = {
  async getWorkFlows({ commit, state }) {
    const workflows = await JobApis.getWorkFlows()
    // commit(types.SET_WORKFLOWS, {workflows})
    return workflows
  },

  async getWorkFlow({ commit }, workflowId) {
    const workflow = await JobApis.getWorkFlow(workflowId)
    // commit(types.SET_WORKFLOW, {workflow})
    return workflow
  },


  async createWorkFlow({ dispatch }, workflow) {
    const workflowId = await JobApis.createWorkFlow(workflow)
    // await dispatch('getWorkFlow', workflowId)
    return workflowId
  },


  async deleteWorkFlow({ commit }, workflowId) {
    await JobApis.deleteWorkFlow(workflowId)
    // commit(types.DELETE_TASK, {taskId})
  },

  async startWorkFlow({ dispatch }, workflowId) {
    await JobApis.startWorkFlow(workflowId)
  },

  async stopWorkFlow({ dispatch }, workflowId) {
    await JobApis.stopWorkFlow(workflowId)
  },

  async getWorkFlowJobGroups({ dispatch }, workflowId) {
    const jobgroups=await JobApis.getWorkFlowJobGroups(workflowId)
    // commit(types.SET_WORKFLOWS, {jobgroups})
    return jobgroups
  },


  async saveWorkFlow({ dispatch }, workflow) {
    await JobApis.saveWorkFlow(workflow)
    // await dispatch('getTask', task.taskId)
  },


  async resumeWorkFlow({ dispatch }, workflowId) {
    await JobApis.resumeWorkFlow(workflowId)
  },


  async createJobGroup({ dispatch }, jobGroup) {
    await JobApis.createJobGroup(jobGroup)
  },

  async saveJobGroup({ dispatch }, jobGroup) {
    await JobApis.saveJobGroup(jobGroup)
  },

  async deleteJobGroup({ dispatch }, jobGroupId) {
    await JobApis.deleteJobGroup(jobGroupId)
  },

  async getJobGroupJobs({}, jobGroupId) {
    const jobs=await JobApis.getJobGroupJobs(jobGroupId)
    return jobs
  },

  async createJob({}, job) {
    await JobApis.createJob(job)
  },

  async saveJob({}, job) {
    await JobApis.saveJob(job)
  },

  async deleteJob({}, jobId) {
    await  JobApis.deleteJob(jobId)
  },

  async startJob({},jobId){
    await JobApis.runJob(jobId)
  }
}

const mapArray2ObjByKey = (arr, key) => arr.reduce((prev, item) =>
  ({
    ...prev,
    [item[key]]: item
  }), {})


// mutations
const mutations = {
  [types.SET_WORKFLOWS](state, {workflows}) {
    state.workflows = mapArray2ObjByKey(workflows, 'id')
  },
  [types.SET_WORKFLOW](state, {workflow}) {
    state.workflows = {
      ...state.workflows,
      [workflow.id]: task
    }
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
