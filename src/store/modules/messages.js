/**
 * Created by Xinhe on 2017/11/18.
 */
import * as types from '../mutation-types'

const Stomp = require('stompjs/lib/stomp').Stomp

const MAX_LOG_NUMBER = 10

// initial state
const state = {
  wsConnected: false,
  jobLogs: {},
  workFlowLogs: {},
}

// getters
const getters = {}

let client
// actions
const actions = {
  connect({ commit, dispatch, }) {
    // var socket = new SockJS('/job/api/v1/job-websocket');
    client = Stomp.client('ws://58.87.75.73:8888/job/api/v1/job-websocket/websocket')
    client.connect({}, (frame) => {
        commit(types.CHANGE_SOCKET_STATUS, true)
        console.log('Connected: ' + frame)
        client.subscribe('/topic/log', function ({ body }) {
          try {
            commit(types.MESSAGE_RECEIVE, JSON.parse(body))
          } catch (e) {
            console.log(e)
          }
        })
        client.subscribe('/topic/status', function ({ body }) {
          try {
            // commit(types.MESSAGE_RECEIVE, JSON.parse(body))
          } catch (e) {
            console.log(e)
          }
        })
      }
    )


    // try {
    //   //todo
    //   const {taskId, subtaskId, message, type} = JSON.parse(msg)
    //   if (!taskId) return
    //
    //   commit(types.MESSAGE_RECEIVE, {message, taskId, subtaskId})
    //   //handle message type
    //   switch (type) {
    //     case MessageType.START:
    //     case MessageType.ERROR:
    //     case MessageType.DONE:
    //       dispatch('getTask', taskId)
    //       // if (subtaskId){
    //       //   dispatch('getSubTask',subtaskId)
    //       // }
    //       break
    //   }
    // } catch (err) {
    //   console.log(`${err}: ${msg}`)
    // }


  },

  close({ commit }) {
    if (client) {
      client.disconnect(() => {
        console.log('disconnect!')
        commit(types.CHANGE_SOCKET_STATUS, false)
        commit(types.EMPTY_MESSAGES)
        client = null
      })
    }
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
    state.subtaskMessages = { ...state.subtaskMessages }
  },

  [types.CLEAR_TASK_MESSAGES](state, taskId) {
    delete  state.taskMessages[taskId]
    state.taskMessages = { ...state.taskMessages }
  },

  [types.MESSAGE_RECEIVE](state, { jobId, workFlowId, error, content }) {
    const prevMessages = state.jobLogs[jobId] || []
    prevMessages.unshift({
      content,
      error
    })
    if (prevMessages.length > MAX_LOG_NUMBER) {
      prevMessages.pop()
    }
    state.jobLogs = { ...state.jobLogs, [jobId]: prevMessages }


    const prevWorkFlowMessages = state.workFlowLogs[workFlowId] || []
    prevWorkFlowMessages.unshift({ jobId, content, error })
    if (prevWorkFlowMessages.length > MAX_LOG_NUMBER) {
      prevWorkFlowMessages.pop()
    }
    state.workFlowLogs = { ...state.workFlowLogs, [workFlowId]: prevWorkFlowMessages }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
