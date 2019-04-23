import * as express from 'express'
import mailer from '../../util/mailer'
import * as redis from '../../util/redis'

const postAuthemail = async (req: express.Request, res: express.Response): Promise<void> => {
  const { email } = req.body

  try {
    const authNum = await mailer(email)

    await redis.addAuthWaitingList(email, authNum)

    res.status(201).end()
  } catch (e) {
    console.log(e)
    res.status(405).end()
  }
}

const postSignin = async (req: express.Request, res: express.Response): Promise<void> => {

}

export { postAuthemail, postSignin }
