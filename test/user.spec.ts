import * as request from 'supertest'
import * as sinon from 'sinon'
import app from '../src/app'
import { User } from '../src/model/user'

describe('user test', () => {
  let sandbox: sinon.SinonSandbox
  let req

  before(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(User, 'find').value(() => {
      return new Promise((resolve) => {
        resolve({
          id: 'abcd1234',
          email: 'abcd1234@dsm.hs.kr',
          userLink: 'http://aaaaaaaaaaa.com',
          createdAt: 1555938705534,
          updatedAt: 1555938705534
        })
      })
    })

    req = request(app)
  })

  it('POST /user/authemail', async () => {
    await req
      .post('/user/authemail')
      .send({ email: 'nye7181' })
      .expect(201)
  }).timeout(15000)
})
