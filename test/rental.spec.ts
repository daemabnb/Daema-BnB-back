import * as request from 'supertest'
import * as sinon from 'sinon'
import app from '../src/app'
import DB from '../src/model/index'
import { createToken } from '../src/util/jwt'

describe('share test', () => {
  let req: request.SuperTest<request.Test>
  let token: string
  let sandbox: sinon.SinonSandbox

  before(() => {
    req = request(app)
    token = createToken('abcd1234', 'nye', 'http://localhost:3000', 'nye@gmail.com')

    sandbox = sinon.createSandbox()

    sandbox.stub(DB.prototype, 'findRentals').value(() => {
      return new Promise(resolve => {
        resolve([{
          _id: 'abcdefghijkl',
          name: '이름',
          price: '5000',
          returnDate: Date.now(),
          period: 8,
          isPublic: false,
          images: ['a.jpg']
        }])
      })
    })
  })

  after(() => {
    sandbox.restore()
  })

  it('GET /rental', async () => {
    await req
      .get('/rental').expect(200)
      .set('token', token)
  })
})
