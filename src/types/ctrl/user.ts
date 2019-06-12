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

export interface PostSignupReq {
  email: string
  authNum: string
}

export interface PostSignupRes {
  token: string
}
