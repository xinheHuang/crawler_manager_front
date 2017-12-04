/**
 * Created by Xinhe on 2017/11/18.
 */
import httpUtil from '../utils/httpUtil'

export default {
  //workflow
  async getWorkFlows() {
    return await httpUtil.get('workflows')
  },

  async createWorkFlow(workflow) {
    return await httpUtil.post('workflows', workflow)
  },

  async getWorkFlow(workflowId) {
    return await httpUtil.get(`workflows/${workflowId}`)
  },

  async startWorkFlow(workflowId) {
    return await httpUtil.post(`workflows/${workflowId}/run`)
  },

  async stopWorkFlow(workflowId) {
    return await httpUtil.post(`workflows/${workflowId}/stop`)
  },

  async resumeWorkFlow(workflowId) {
    return await httpUtil.post(`/workflows/${workflowId}/resume`)
  },

  async deleteWorkFlow(workflowId) {
    return await httpUtil.delete(`workflows/${workflowId}`)
  },

  async saveWorkFlow(workflow) {
    return await httpUtil.post(`workflows/${workflow.id}`, workflow)
  },


  async getWorkFlowJobGroups(workflowId) {
    return await httpUtil.get(`workflows/${workflowId}/job/groups`)
  },

  async createJobGroup(jobGroup) {
    return await httpUtil.post(`job/groups`, jobGroup)
  },

  async saveJobGroup(jobGroup) {
    return await httpUtil.post(`job/groups/${jobGroup.id}`, jobGroup)
  },

  async deleteJobGroup(jobGroupId){
    return await httpUtil.delete(`job/groups/${jobGroup.id}`)
  },

  async getJobGroupJobs(jobGroupId){
    return await httpUtil.get(`job/groups/${jobGroupId}/jobs`)
  },

  async createJob(job){
    return await httpUtil.post(`jobs`,job)
  },

  async saveJob(job){
    return await httpUtil.post(`jobs/${job.id}`,job)
  },

  async deleteJob(jobId){
    return await httpUtil.delete(`jobs/${jobId}`)
  },

  async runJob(jobId){
    return await httpUtil.post(`jobs/${jobId}/run`)
  }

}
