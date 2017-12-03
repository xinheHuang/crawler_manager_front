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

  async resumeWorkFlow(workflowId){
    return await httpUtil.post(`/workflows/${workflowId}/resume`)
  },

  async deleteWorkFlow(workflowId) {
    return await httpUtil.delete(`workflows/${workflowId}`)
  },

  async saveWorkFlow(workflow) {
    return await httpUtil.post(`workflows/${workflow.id}`,workflow)
  },


  async getWorkFlowJobGroups(workflowId){
    return await httpUtil.get(`workflows/${workflowId}/job/groups`)
  },







  //server
  async getServers() {
    return await httpUtil.get('/api/servers')
  },

  //script
  async getScripts() {
    return await httpUtil.get('/api/scripts')
  },

  //subtask
  async saveSubTask(subtask) {
    return await httpUtil.put(`/api/subtask/${subtask.subtaskId}`, subtask)
  },

  async createSubTask(taskId) {
    return await httpUtil.post(`/api/task/${taskId}/subtasks`)
  },

  async deleteSubTask(subtaskId) {
    return await httpUtil.delete(`/api/subtask/${subtaskId}`)
  },

  async startSubTask(subtaskId) {
    return await httpUtil.post(`/api/subtask/${subtaskId}/start`)
  },

  async stopSubTask(subtaskId) {
    return await httpUtil.post(`/api/subtask/${subtaskId}/stop`)
  },


}
