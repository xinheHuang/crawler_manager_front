/**
 * Created by Xinhe on 2017/11/18.
 */
import httpUtil from '../httpUtil'

export default {
  //task
  async getTasks() {
    return await httpUtil.get('/api/tasks')
  },

  async createTask(task) {
    return await httpUtil.post('/api/tasks', task)
  },

  async startTask(taskId) {
    return await httpUtil.post(`/api/task/${taskId}/start`)
  },

  async resumeTask(taskId){
    return await httpUtil.post(`/api/task/${taskId}/resume`)
  },

  async stopTask(taskId) {
    return await httpUtil.post(`/api/task/${taskId}/stop`)
  },

  async getTask(taskId) {
    return await httpUtil.get(`/api/task/${taskId}`)
  },

  async deleteTask(taskId) {
    return await httpUtil.delete(`/api/task/${taskId}`)
  },

  async saveTask(task) {
    return await httpUtil.put(`/api/task/${task.taskId}`, task)
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
  }

}
