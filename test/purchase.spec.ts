import * as request from 'supertest'
import * as sinon from 'sinon'
import app from '../src/app'
import { createToken } from '../src/util/jwt'
import * as redis from '../src/util/redis'
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

    sandbox.stub(DB.prototype, 'findSaleById').value(() => {
      return new Promise(resolve => {
        resolve({
          _id: 'abcdefghijkl',
          name: 'item',
          description: 'itemssss',
          price: '5000',
          status: 'onSale',
          userId: 'abcd1234',
          userName: 'nye',
          userLink: 'http://localhost:3000',
          images: ['a.jpg']
        })
      })
    })

    sandbox.stub(DB.prototype, 'updateSaleClient').value(() => {
      return new Promise(resolve => {
        resolve()
      })
    })

    sandbox.stub(DB.prototype, 'findOwnPurchase').value(() => {
      return new Promise(resolve => {
        resolve([{
          _id: 'abcdefghijkl',
          name: 'item',
          description: 'itemssss',
          status: 'beforeExchage',
          createdAt: Date.now(),
          selledDate: Date.now()
        }])
      })
    })

    sandbox.stub(redis, 'setSaleAuthNumber').value(() => {
      return new Promise(resolve => {
        resolve()
      })
    })

    sandbox.stub(redis, 'getSaleAuthNumber').value(() => {
      return new Promise(resolve => {
        resolve('1234')
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

  it('GET /purchase/{id}', async () => {
    await req
      .get('/purchase/abcdefghijkl').expect(200)
      .set('token', token)
  })

  it('POST /purchase/{id}', async () => {
    await req
      .post('/purchase/abcdefghijkl').expect(201)
      .set('token', token)
  })

  it('GET /purchase/history?offset=0&limit=5', async () => {
    await req
      .get('/purchase/history').expect(200)
      .set('token', token)
  })

  it('GET /purchase/exchage/{id}', async () => {
    await req
      .get('/purchase/exchage/abcdefghijkl').expect(200)
      .set('token', token)
  })

  it('POST /purchase/exchage/{id}', async () => {
    await req
      .post('/purchase/exchage/abcdefghijkl').expect(201)
      .set('token', token)
      .send({ authPassword: '1234' })
  })
})
