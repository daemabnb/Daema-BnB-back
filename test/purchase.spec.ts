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

    sandbox.stub(DB.prototype, 'findSales').value(() => {
      return new Promise(resolve => {
        resolve(
          [{
            _id: 'abcdefghijkl',
            naem: '물건',
            price: '5000',
            images: ['a.jpg', 'b.jpg']
          }]
        )
      })
    })
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