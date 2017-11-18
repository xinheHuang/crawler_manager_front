/**
 * Created by Xinhe on 2017/11/18.
 */
import ws from '../../webSocket'
import * as types from '../mutation-types'

const MESSAGE_WEB_SOCKET = 'MESSAGE_WEB_SOCKET'
const MAX_LOG_NUMBER = 10

// initial state
const state = {
  wsConnected: false,
  subtaskMessages: {},
  taskMessages: {},
}

// getters
const getters = {}

// actions
const actions = {
  connect({commit, state}) {
    let wsUrl
    if (process.env.NODE_ENV === 'development') {
      wsUrl = 'localhost:9000'
    } else {
      wsUrl = `${window.location.hostname}:${window.location.port}`
    }
    ws.connect(wsUrl, MESSAGE_WEB_SOCKET, (msg) => {
      console.log('msg',msg)
      commit(types.MESSAGE_RECEIVE, {msg})
    })
    commit(types.CHANGE_SOCKET_STATUS, true)
  },

  close({commit}) {
    ws.close(MESSAGE_WEB_SOCKET)
    commit(types.CHANGE_SOCKET_STATUS, false)
    commit(types.EMPTY_MESSAGES)
  }
}

// mutations
const mutations = {
  [types.CHANGE_SOCKET_STATUS](state, connected) {
    state.wsConnected = connected
  },

  [types.EMPTY_MESSAGES](state) {
    state.messages = {}
  },

  [types.MESSAGE_RECEIVE](state, {msg}) {
    try {
      const {taskId, subtaskId,  message ,scriptName} = JSON.parse(msg)
      if (!taskId || !subtaskId) return;
      //subtask
      const prevMessages = state.subtaskMessages[subtaskId] || []
      prevMessages.unshift(message)
      if (prevMessages.length > MAX_LOG_NUMBER) {
        prevMessages.pop()
      }
      state.subtaskMessages = {...state.subtaskMessages, [subtaskId]: prevMessages}

      //task
      const prevTaskMessages= state.taskMessages[taskId] || [];
      prevTaskMessages.unshift({scriptName,message})
      if (prevTaskMessages.length > MAX_LOG_NUMBER) {
        prevTaskMessages.pop()
      }
      state.taskMessages = {...state.taskMessages, [taskId]: prevTaskMessages}
      console.log(state);
    } catch (err) {
      console.log(`${err}: ${msg}`)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
