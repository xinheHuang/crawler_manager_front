/**
 * Created by Xinhe on 2017/11/17.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import messages from './modules/messages'
import job from './modules/job'
import auth from './modules/auth'
import executorGroup from './modules/executorGroup'
Vue.use(Vuex)

export default new Vuex.Store({
                                modules: {
                                  messages,
                                  job,
                                  auth,
                                  executorGroup
                                },
                              })
