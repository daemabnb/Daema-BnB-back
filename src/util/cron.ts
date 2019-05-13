import { schedule, ScheduleOptions } from 'node-cron'

const scheduleOptions: ScheduleOptions = {
  scheduled: false,
  timezone: 'Asia/Seoul'
}

export default (func) => {
  schedule('0 0 * * * *', () => {
    func()
  }, scheduleOptions)
}
