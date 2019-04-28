import * as request from 'supertest'
import * as sinon from 'sinon'
import app from '../src/app'
import { createToken } from '../src/util/jwt'
import DB from '../src/model/index'

describe('purchase test', () => {
  let req: request.SuperTest<request.Test>
  let token: string
  let sandbox: sinon.SinonSandbox

  before(() => {
    req = request(app)
    token = createToken('abcd1234', 'nye', 'http://localhost:3000', 'nye@gmail.com')

    sandbox = sinon.createSandbox()
  })

  after(() => {
    sandbox.restore()
  })

  it('GET /purchase', async () => {
    await req
      .get('/purchase').expect(200)
      .set('token', token)
  })
})