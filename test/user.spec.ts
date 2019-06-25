import * as request from 'supertest'
import * as sinon from 'sinon'
import app from '../src/app'
import { User } from '../src/model/user'
import { createToken } from '../src/util/jwt'
import * as redis from '../src/util/redis'

describe('user test', () => {
  let req: request.SuperTest<request.Test>
  let tokenWithoutEmail: string
  let token: string
  let sandbox: sinon.SinonSandbox

  before(() => {
    req = request(app)
    tokenWithoutEmail = createToken('abcd1234', 'nye', 'http://localhost:3000')
    token = createToken('abcd1234', 'nye', 'http://localhost:3000', 'abc123')

    sandbox = sinon.createSandbox()

    sandbox.stub(redis, 'getEmailAuthNumber').value(() => {
      return new Promise(resolve => {
        resolve('1234')
      })
    })

    sandbox.stub(User, 'findUserByProfileId').value(() => {
      return new Promise(resolve => {
        resolve({
          isAdmin: false
        })
      })
    })

    sandbox.stub(User, 'createUser').value(() => {
      return new Promise(resolve => {
        resolve()
      })
    })
  })

  after((done) => {
    sandbox.restore()
    done()
  })

  it('GET /user', async () => {
    await req
      .get('/user').expect(200)
      .set('token', token)
  })

  it('POST /user/signup', async () => {
    await req
      .post('/user/signup').expect(201)
      .set('token', tokenWithoutEmail)
      .send({ email: 'nye@gmail.com', authNum: '1234' })
  }).timeout(5000)
})
