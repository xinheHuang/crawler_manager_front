import httpUtils from 'axios'
import EventBus from '../eventBus'

const basePath = '/job/api/v1/'

const methods = ['get', 'put', 'post', 'delete']
methods.forEach((method) => {
  const fn = httpUtils[method]
  httpUtils[method] = async (url, ...args) => {
    try {
      const res = await fn(`${basePath}${url}`, ...args)
      console.log(method, [`${basePath}${url}`, ...args], res.data)
      return res.data
    } catch (error) {
      // if (!error instanceof ApiError) {  //非逻辑错误
      const { status, data } = error.response
      console.log(error.response)
      switch (status) {
      case 401:
        console.log('should login')
        EventBus.$emit('index')
        break
      case 417:
        EventBus.$emit('errorDialog', {
          text: data.message,
        })
        break
      }
      return Promise.reject(error)
    }
  }
})

export default httpUtils
