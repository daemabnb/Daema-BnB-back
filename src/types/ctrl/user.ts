export interface PostAuthemailBody {
  email: string
}

export interface GetSigninFacebookBody {
  accessToken: string
}

export interface GetSigninFacebookRes {
  token: string
  isAdmin?: boolean
}

export interface FacebookRes {
  id: string
  name: string
  link: string
}

export interface PostSignupReq {
  email: string
  authNum: string
}

export interface PostSignupRes {
  token: string
}
