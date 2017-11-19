/**
 * Created by Xinhe on 2017/11/18.
 */
import ws from '../../webSocket'
import * as types from '../mutation-types'

const MESSAGE_WEB_SOCKET = 'MESSAGE_WEB_SOCKET'
const MAX_LOG_NUMBER = 10


const MessageType = {
  LOG: 'LOG',
  DONE: 'DONE',
  ERROR: 'ERROR',
  START: 'START',
}

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
  connect({commit, dispatch,}) {
    let wsUrl
    if (process.env.NODE_ENV === 'development') {
      wsUrl = 'localhost:9000'
    } else {
      wsUrl = `${window.location.hostname}:${window.location.port}`
    }
    ws.connect(wsUrl, MESSAGE_WEB_SOCKET, (msg) => {
      console.log('msg', msg)

      try {
        //todo
        const {taskId, subtaskId, message, type} = JSON.parse(msg)
        if (!taskId) return

        commit(types.MESSAGE_RECEIVE, {message, taskId, subtaskId})
        //handle message type
        switch (type) {
          case MessageType.START:
          case MessageType.ERROR:
          case MessageType.DONE:
            dispatch('getTask', taskId)
            // if (subtaskId){
            //   dispatch('getSubTask',subtaskId)
            // }
            break
        }
      } catch (err) {
        console.log(`${err}: ${msg}`)
      }


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
    state.taskMessages = {}
    state.subtaskMessages = {}

  },

  [types.CLEAR_SUBTASK_MESSAGES](state, subtaskId) {
    delete  state.subtaskMessages[subtaskId]
    state.subtaskMessages = {...state.subtaskMessages}
  },

  [types.CLEAR_TASK_MESSAGES](state, taskId) {
    delete  state.taskMessages[taskId]
    state.taskMessages = {...state.taskMessages}
  },

  [types.MESSAGE_RECEIVE](state, {message, taskId, subtaskId}) {
    //subtask
    if (subtaskId) {
      const prevMessages = state.subtaskMessages[subtaskId] || []
      prevMessages.unshift(message)
      if (prevMessages.length > MAX_LOG_NUMBER) {
        prevMessages.pop()
      }
      state.subtaskMessages = {...state.subtaskMessages, [subtaskId]: prevMessages}
    }

    //task
    const prevTaskMessages = state.taskMessages[taskId] || []
    prevTaskMessages.unshift({subtaskId, message})
    if (prevTaskMessages.length > MAX_LOG_NUMBER) {
      prevTaskMessages.pop()
    }
    state.taskMessages = {...state.taskMessages, [taskId]: prevTaskMessages}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
