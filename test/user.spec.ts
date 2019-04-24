import * as request from 'supertest'
import * as sinon from 'sinon'
import app from '../src/app'
import { createToken } from '../src/util/jwt'
import * as redis from '../src/util/redis'
import { User } from '../src/model/user'

describe('user test', () => {
  let req: request.SuperTest<request.Test>
  let tokenWithoutEmail: string
  let sandbox: sinon.SinonSandbox

  before(() => {
    req = request(app)
    tokenWithoutEmail = createToken('abcd1234', 'nye', 'http://localhost:3000')

    sandbox = sinon.createSandbox()

    sandbox.stub(redis, 'getAuthNumber').value(() => {
      return new Promise((resolve) => {
        resolve('1234')
      })
    })

    sandbox.stub(User.prototype, 'save').value(() => {
      return new Promise((resolve) => {
        resolve()
      })
    })
  })

  after(() => {
    sandbox.restore()
  })

  it('POST /user/signup', async () => {
    await req
      .post('/user/signup').expect(201)
      .set('token', tokenWithoutEmail)
      .send({ email: 'nye@gmail.com', authNum: '1234' })
  }).timeout(5000)
})
