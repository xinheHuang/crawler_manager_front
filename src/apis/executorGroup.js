/**
 * Created by Xinhe on 2017/11/18.
 */
import httpUtil from '../utils/httpUtil'

export default {
  //executor group
  async getExecutorGroups() {
    return await httpUtil.get('executor/groups')
  },

  async createExecutorGroup(name) {
    return await httpUtil.post('executor/groups', name)
  },


  async deleteExecutorGroup(name) {
    return await httpUtil.delete(`executor/groups/${name}`)
  },


}
