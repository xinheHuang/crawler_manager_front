/**
 * Created by Xinhe on 2017/11/18.
 */
import JobApis from '../../apis/job'
import * as types from '../mutation-types'

// initial state
const state = {
  tasks: {},
  servers: {},
  scripts: {},
}

// getters
const getters = {
  subTasks: (state) => Object.values(state.tasks)
                             .reduce((prev, task) => ({
                               ...prev,
                               ...task.subTasks.reduce((prev, subtask) => ({
                                 ...prev,
                                 [subtask.subtaskId]: subtask
                               }), {})
                             }), {})
}

// actions
const actions = {
  async getWorkFlows({commit, state}) {
    const workflows = await JobApis.getWorkFlows()
    return workflows
    // commit(types.SET_TASKS, {workflows})
  },

  async getWorkFlow({commit}, workflowId) {
    const workflow = await JobApis.getWorkFlow(workflowId)
    return workflow
    // commit(types.SET_TASK, {task})
  },


  async createWorkFlow({dispatch}, workflow) {
    const workflowId = await JobApis.createWorkFlow(workflow)
    // await dispatch('getTask', taskId)
    return workflowId
  },


  async deleteWorkFlow({commit}, workflowId) {
    await JobApis.deleteWorkFlow(workflowId)
    // commit(types.DELETE_TASK, {taskId})
  },

  async startWorkFlow({dispatch}, workflowId) {
    await JobApis.startWorkFlow(workflowId)
  },

  async stopWorkFlow({dispatch}, workflowId) {
    await JobApis.stopWorkFlow(workflowId)
  },

  async getWorkFlowJobGroups({dispatch},workflowId){
    return await JobApis.getWorkFlowJobGroups(workflowId)
  },


  async saveWorkFlow({dispatch}, workflow) {
    await JobApis.saveWorkFlow(workflow)
    // await dispatch('getTask', task.taskId)
  },


  async resumeWorkFlow({dispatch}, workflowId) {
    await JobApis.resumeWorkFlow(workflowId)
  },




  async getServers({commit}) {
    const servers = await job.getServers()
    commit(types.SET_SERVERS, {servers})
  },

  async getScripts({commit}) {
    const scripts = await job.getScripts()
    commit(types.SET_SCRIPTS, {scripts})
  },


  //subtask
  async saveSubTask({dispatch}, {taskId, subtask}) {
    await job.saveSubTask(subtask)
    await dispatch('getTask', taskId)
  },

  async createSubTask({dispatch}, taskId) {
    await job.createSubTask(taskId)
    await dispatch('getTask', taskId)
  },

  async deleteSubTask({dispatch}, {taskId, subtaskId}) {
    await job.deleteSubTask(subtaskId)
    await dispatch('getTask', taskId)
  },

  async startSubTask({dispatch}, {taskId, subtaskId}) {
    await job.startSubTask(subtaskId)
    await dispatch('getTask', taskId)
  },

  async stopSubTask({dispatch}, {taskId, subtaskId}) {
    await job.stopSubTask(subtaskId)
    await dispatch('getTask', taskId)
  },


}

const mapArray2ObjByKey = (arr, key) => arr.reduce((prev, item) =>
                                                     ({
                                                       ...prev,
                                                       [item[key]]: item
                                                     }), {})
// mutations
const mutations = {
  [types.SET_TASKS](state, {tasks}) {
    state.tasks = mapArray2ObjByKey(tasks, 'taskId')
  },

  [types.SET_SERVERS](state, {servers}) {
    state.servers = mapArray2ObjByKey(servers, 'serverId')
  },

  [types.SET_SCRIPTS](state, {scripts}) {
    state.scripts = mapArray2ObjByKey(scripts, 'scriptId')
  },

  [types.SET_TASK](state, {task}) {
    state.tasks = {
      ...state.tasks,
      [task.taskId]: task
    }
  },

  [types.DELETE_TASK](state, {taskId}) {
    delete state.tasks[taskId]
    state.tasks = {
      ...state.tasks,
    }
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
