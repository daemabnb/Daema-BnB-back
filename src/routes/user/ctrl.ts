import { Request, Response, NextFunction, RequestHandler } from 'express'
import { User } from '../../model/user'
import * as userType from '../../types/ctrl/user'
import mailer from '../../util/mailer'
import * as redis from '../../util/redis'
import { getRequest } from '../../util/request'
import { createToken } from '../../util/jwt'
import Err from '../../util/error'

export const getUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.user

    const user = await User.findUserByProfileId(id)

    if (!user) {
      throw new Err('없는 사용자, 저리 가!', 403)
    }

    const response = {
      isAdmin: user.isAdmin
    }
    res.status(200).json(response).end()
  } catch (e) {
    next(e)
  }
}

export const postAuthemail: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body: userType.PostAuthemailBody = req.body
    const { email } = body

    const authNum = await mailer(email)
    await redis.addAuthWaitingList(email, authNum)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}

export const postSigninFacebook: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: userType.GetSigninFacebookBody = req.body
    const { accessToken } = body

    const uri = `https://graph.facebook.com/me?fields=id,name,link&access_token=${accessToken}`
    const facebookRes = await getRequest(uri)
    const facebookResBody: userType.FacebookRes = JSON.parse(facebookRes)
    const { id, name, link } = facebookResBody

    const user = await User.findUserByProfileId(id)

    const token = user ? createToken(user.profileId, user.displayName, user.profileUrl, user.email) :
      createToken(id, name, link)
    const response: userType.GetSigninFacebookRes = {
      token,
      isAdmin: user ? user.isAdmin : undefined
    }

    if (user) {
      res.status(200).json(response).end()
      return
    }

    res.status(201).json(response).end()
  } catch (error) {
    next(error)
  }
}

export const postSignup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: userType.PostSignupReq = req.body
    const { email, authNum } = body

    const savedAuthNum = await redis.getEmailAuthNumber(email)

    if (authNum !== savedAuthNum) {
      res.status(405).end()
      return
    }

    const { id, displayName, profileUrl } = req.user

    await User.createUser({
      profileId: id,
      displayName,
      email,
      profileUrl
    })

    const token = createToken(id, displayName, profileUrl, email)

    const response: userType.PostSignupRes = { token }
    res.status(201).json(response).end()
  } catch (e) {
    next(e)
  }
}
