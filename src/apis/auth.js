/**
 * Created by Xinhe on 2017/11/18.
 */
import httpUtil from '../utils/httpUtil'

export default {
  async login(loginInfo) {
    return await httpUtil.post('auth/login', loginInfo)
  },
}
