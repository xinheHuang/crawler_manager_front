/**
 * Created by Xinhe on 2017/11/18.
 */
import ExecutorGroupApis from '../../apis/executorGroup'
import * as types from '../mutation-types'

// initial state
const state = {}

// getters
const getters = {}

// actions
const actions = {
  async getExecutorGroups({commit, state}) {
    const executorGroups = await ExecutorGroupApis.getExecutorGroups()
    return executorGroups
    // commit(types.SET_TASKS, {workflows})
  },


  async createExecutorGroup({dispatch}, name) {
    const executorName = await ExecutorGroupApis.createExecutorGroup(name)
    // await dispatch('getTask', taskId)
    return executorName
  },


  async deleteExecutorGroup({commit}, name) {
    await ExecutorGroupApis.deleteExecutorGroup(name)
    // commit(types.DELETE_TASK, {taskId})
  },

}

// mutations
const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
