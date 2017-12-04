/**
 * Created by Xinhe on 2017/11/18.
 */
import JobApis from '../../apis/job'
import * as types from '../mutation-types'

// initial state
const state = {}

// getters
const getters = {}

// actions
const actions = {
  async getWorkFlows({ commit, state }) {
    const workflows = await JobApis.getWorkFlows()
    return workflows
    // commit(types.SET_TASKS, {workflows})
  },

  async getWorkFlow({ commit }, workflowId) {
    const workflow = await JobApis.getWorkFlow(workflowId)
    return workflow
    // commit(types.SET_TASK, {task})
  },


  async createWorkFlow({ dispatch }, workflow) {
    const workflowId = await JobApis.createWorkFlow(workflow)
    // await dispatch('getTask', taskId)
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
    return await JobApis.getWorkFlowJobGroups(workflowId)
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
    return await JobApis.getJobGroupJobs(jobGroupId)
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

// mutations
const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
