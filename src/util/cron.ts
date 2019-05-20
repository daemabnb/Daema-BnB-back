import { schedule, ScheduleOptions } from 'node-cron'

const scheduleOptions: ScheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Seoul'
}

export default (cronExpression: string = '0 0 * * * *', func: Function) => {
  schedule(cronExpression, () => {
    func()
  }, scheduleOptions)
}
