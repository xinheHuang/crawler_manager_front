/**
 * Created by Xinhe on 2017-11-20.
 */
export default {
  getDayHourMinute(time) {
    if (!time){
      return {
        days:0,
        hours:0,
        minutes:0
      }
    }
    const days = Math.floor(time / 86400)
    time -= days * 86400
    const hours = Math.floor(time / 3600) % 24
    time -= hours * 3600
    const minutes = time / 60
    return {
      days,
      hours,
      minutes,
    }
  },
  getDayHourMinuteFromTime(time) {
    const { days, hours, minutes } = this.getDayHourMinute(time)
    return `${days}天${hours}小时${minutes}分钟`
    // return {
    //   days,
    //   hours,
    //   minutes,
    // }
  },
  getTimeFromDayHourMinute(days = 0, hours = 0, minutes = 0) {
    return minutes * 60 + hours * 3600 + days * 86400
  }
}
