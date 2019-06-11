import * as Slack from 'slack-node'
import { slackUrl } from '../config'

const slack = new Slack()
slack.setWebhook(slackUrl)

export default (err: string) => {
  slack.webhook({
    channel: '#log',
    username: '에러가 왔어요',
    text: `*에러 고쳐라*\n----------\n${err}\n----------`,
    icon_emoji: ':dealwithnowparrot'
  }, (err) => {
    if (err) {
      throw new Error('슬랙 에러요')
    }
  })
}
