/**
 * Created by Xinhe on 2017/11/18.
 */
import TaskApis from '../../apis/tasks'
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
  async getTasks({commit, state}) {
    const tasks = await TaskApis.getTasks()
    commit(types.SET_TASKS, {tasks})
  },

  async getTask({commit}, taskId) {
    const task = await TaskApis.getTask(taskId)
    commit(types.SET_TASK, {task})
  },


  async createTask({dispatch}, task) {
    const taskId = await TaskApis.createTask(task)
    await dispatch('getTask', taskId)
    return taskId
  },

  async saveTask({dispatch}, task) {
    await TaskApis.saveTask(task)
    await dispatch('getTask', task.taskId)
  },

  async deleteTask({commit}, taskId) {
    await TaskApis.deleteTask(taskId)
    commit(types.DELETE_TASK, {taskId})
  },

  async startTask({dispatch}, taskId) {
    await TaskApis.startTask(taskId)
  },

  async resumeTask({dispatch},taskId){
    await TaskApis.resumeTask(taskId)
  },


  async stopTask({dispatch}, taskId) {
    await TaskApis.stopTask(taskId)
  },


  async getServers({commit}) {
    const servers = await TaskApis.getServers()
    commit(types.SET_SERVERS, {servers})
  },

  async getScripts({commit}) {
    const scripts = await TaskApis.getScripts()
    commit(types.SET_SCRIPTS, {scripts})
  },


  //subtask
  async saveSubTask({dispatch}, {taskId, subtask}) {
    await TaskApis.saveSubTask(subtask)
    await dispatch('getTask', taskId)
  },

  async createSubTask({dispatch}, taskId) {
    await TaskApis.createSubTask(taskId)
    await dispatch('getTask', taskId)
  },

  async deleteSubTask({dispatch}, {taskId, subtaskId}) {
    await TaskApis.deleteSubTask(subtaskId)
    await dispatch('getTask', taskId)
  },

  async startSubTask({dispatch}, {taskId, subtaskId}) {
    await TaskApis.startSubTask(subtaskId)
    await dispatch('getTask', taskId)
  },

  async stopSubTask({dispatch}, {taskId, subtaskId}) {
    await TaskApis.stopSubTask(subtaskId)
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
