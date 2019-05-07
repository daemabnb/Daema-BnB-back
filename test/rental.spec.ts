import * as request from 'supertest'
import * as sinon from 'sinon'
import app from '../src/app'
import DB from '../src/model/index'
import * as redis from '../src/util/redis'
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

    sandbox.stub(DB.prototype, 'findShareById').value(() => {
      return new Promise(resolve => {
        resolve({
          _id: 'abcdefghijkl',
          name: 'item',
          description: 'itemssss',
          price: '5000',
          status: 'onShare',
          returnDate: Date.now(),
          period: 7,
          userId: 'abcd1234',
          userName: 'nye',
          userLink: 'http://localhost:3000',
          images: ['a.jpg']
        })
      })
    })

    sandbox.stub(DB.prototype, 'updateShareClient').value(() => {
      return new Promise(resolve => {
        resolve()
      })
    })

    sandbox.stub(DB.prototype, 'findOwnRental').value(() => {
      return new Promise(resolve => {
        resolve([{
          _id: 'abcdefghijkl',
          name: 'item',
          description: 'itemssss',
          status: 'beforeExchage',
          createdAt: Date.now(),
          sharedDate: Date.now(),
          returnDate: Date.now(),
          period: 7,
          isPublic: false
        }])
      })
    })

    sandbox.stub(redis, 'setShareAuthNumber').value(() => {
      return new Promise(resolve => {
        resolve()
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

  it('GET /rental/{id}', async () => {
    await req
      .get('/rental/abcdefghijkl').expect(200)
      .set('token', token)
  })

  it('POST /rental/{id}', async () => {
    await req
      .post('/rental/abcdefghijkl').expect(201)
      .set('token', token)
  })

  it('GET /rental/history', async () => {
    await req
      .get('/rental/history?offset=0&limit=5').expect(200)
      .set('token', token)
  })

  it('GET /rental/exchange/{id}', async () => {
    await req
      .get('/rental/exchange/abcdefghijkl').expect(200)
      .set('token', token)
  })
})
