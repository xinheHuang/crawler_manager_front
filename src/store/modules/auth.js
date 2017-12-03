/**
 * Created by Xinhe on 2017/11/18.
 */
import AuthApis from '../../apis/auth'
import * as types from '../mutation-types'

// initial state
const state = {

}

// getters
const getters = {

}

// actions
const actions = {
  async login({commit}, loginInfo) {
    await AuthApis.login(loginInfo)
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
