import httpUtils from 'axios'
import EventBus from './eventBus'

const methods = ['get', 'put', 'post', 'delete']
methods.forEach((method) => {
  const fn = httpUtils[method]
  httpUtils[method] = async (...args) => {
    try {
      const res = await fn(...args)
      console.log(method, args,res.data)
      const {code, message, data} = res.data
      if (code == 0) {  //success
        return data
      } else {
        // do some error handle here
        EventBus.$emit('errorDialog', {
          text: message,
        })
        return Promise.reject(message);
      }
    } catch (error) {
      console.log(error.response)
      // if (!error instanceof ApiError) {  //非逻辑错误
        const {status} = error.response
      EventBus.$emit('errorDialog', {
        title:'服务器错误',
        text: error.response.data.message,
      })
      return Promise.reject(error);
    }
  }
})

export default httpUtils
