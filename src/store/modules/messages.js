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
  executorGroupStatus: {},
}

// getters
const getters = {}

let client
// actions
const actions = {
  connect({commit, dispatch,}) {
    // var socket = new SockJS('/job/api/v1/job-websocket');
    client = Stomp.client('ws://58.87.75.73:8888/job/api/v1/job-websocket/websocket')
    client.connect({}, (frame) => {
                     commit(types.CHANGE_SOCKET_STATUS, true)
                     console.log('Connected: ' + frame)
                     client.subscribe('/topic/log', function ({body}) {
                       try {
                         commit(types.LOG_MESSAGE_RECEIVE, JSON.parse(body))
                       } catch (e) {
                         console.log(e)
                       }
                     })

                     //todo
                     client.subscribe('/topic/sysinfo', function ({body}) {
                       try {
                         commit(types.EXECUTOR_MESSAGE_RECEIVE, JSON.parse(body))
                       } catch (e) {
                         console.log(e)
                       }
                     })


                     client.subscribe('/topic/status', function ({body}) {
                       try {
                         const {jobGroupId, workFlowId} = JSON.parse(body)
                         dispatch('getWorkFlow', workFlowId)
                         dispatch('getJobGroupJobs', jobGroupId)
                       } catch (e) {
                         console.log(e)
                       }
                     })
                   }
    )

  },

  close({commit}) {
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

  [types.CLEAR_JOB_MESSAGES](state, jobId) {
    delete  state.jobLogs[jobId]
    state.jobLogs = {...state.jobLogs}
  },

  [types.CLEAR_WORKFLOW_MESSAGES](state, workFlowId) {
    delete  state.workFlowLogs[workFlowId]
    state.workFlowLogs = {...state.workFlowLogs}
  },

  [types.LOG_MESSAGE_RECEIVE](state, {jobId, workFlowId, error, content}) {
    const prevMessages = state.jobLogs[jobId] || []
    prevMessages.unshift({
                           content,
                           error
                         })
    if (prevMessages.length > MAX_LOG_NUMBER) {
      prevMessages.pop()
    }
    state.jobLogs = {...state.jobLogs, [jobId]: prevMessages}


    const prevWorkFlowMessages = state.workFlowLogs[workFlowId] || []
    prevWorkFlowMessages.unshift({jobId, content, error})
    if (prevWorkFlowMessages.length > MAX_LOG_NUMBER) {
      prevWorkFlowMessages.pop()
    }
    state.workFlowLogs = {...state.workFlowLogs, [workFlowId]: prevWorkFlowMessages}
  },

  [types.EXECUTOR_MESSAGE_RECEIVE](state, {executorName, ...others}) {
    state.executorGroupStatus = {
      ...state.executorGroupStatus,
      [executorName]: {
        ...others
      }
    }
    console.log('executor grouop', state.executorGroupStatus)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
