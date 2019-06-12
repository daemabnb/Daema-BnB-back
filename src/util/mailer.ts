import * as nodemailer from 'nodemailer'
import { emailId, emailPw } from '../config'

export default async (email: string): Promise<string> => {
  const authNum = createAuthNum()
  const MAIL_SERVICE = 'Gmail'
  const DSM_MAIL = '@dsm.hs.kr'
  const SUBJECT = 'DaemaBnB 인증 메일입니다.'
  const TEXT = `인증 메일의 유효 기간은 3일 입니다. 인증 메일은 다음과 같습니다. \r\n${authNum}`

  const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
      user: emailId,
      pass: emailPw
    }
  })

  const mailOptions = {
    from: emailId,
    to: `${email}${DSM_MAIL}`,
    subject: SUBJECT,
    text: TEXT
  }

  try {
    const mailInfo = await transporter.sendMail(mailOptions)

    return authNum
  } catch (e) {
    throw new Error(e)
  }
}

const createAuthNum = (): string => {
  let authNum: string = ''

  for (let i = 0; i < 4; i++) {
    const random = Math.floor((Math.random() * 9 + 0)).toString()
    authNum = authNum.concat(random)
  }

  return authNum
}
