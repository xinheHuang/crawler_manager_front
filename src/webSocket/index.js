/**
 * Created by Xinhe on 2017/11/18.
 */

const sockets={}
const checkSocketExist=(name)=>{
  if (sockets[name]){
    return true
  }
  throw new Error(`找不到${name}socket!`)
}

export default{
  connect(wsUrl,name,cb){
    const ws = new WebSocket(`ws://${wsUrl}`)
    sockets[name || wsUrl]=ws
    ws.onmessage=({data})=> cb(data)
  },
  send(name,msg){
    if (checkSocketExist(name)){
      sockets[name].send(msg)
    }
  },
  close(name){
    if (checkSocketExist(name)) {
      sockets[name].close
    }
  },
}
