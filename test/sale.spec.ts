import * as request from 'supertest'
import * as sinon from 'sinon'
import { Types } from 'mongoose'
import app from '../src/app'
import { Sale } from '../src/model/sale'
import { createToken } from '../src/util/jwt'
import * as aws from '../src/util/aws'
import * as image from '../src/util/image'

describe('sale test', () => {
  let req: request.SuperTest<request.Test>
  let token: string
  let sandbox: sinon.SinonSandbox

  before(() => {
    req = request(app)
    token = createToken('abcd1234', 'nye', 'http://localhost:3000', 'nye@gmail.com')

    sandbox = sinon.createSandbox()

    sandbox.stub(Sale, 'createSale').value(() => {
      return new Promise(resolve => {
        resolve({
          _id: Types.ObjectId('abcdefghijkl')
        })
      })
    })

    sandbox.stub(Sale, 'findSaleById').value(() => {
      return new Promise(resolve => {
        resolve({
          _id: 'abcdefghijkl',
          name: 'item',
          description: 'itemssss',
          price: '5000',
          userId: 'abcd1234',
          userName: 'nye',
          userLink: 'http://localhost:3000',
          images: ['a.jpg']
        })
      })
    })

    sandbox.stub(Sale, 'updateSale').value(() => {
      return new Promise(resolve => {
        resolve()
      })
    })

    sandbox.stub(Sale, 'deleteSale').value(() => {
      return new Promise(resolve => {
        resolve()
      })
    })

    sandbox.stub(image, 'getImageNames').value(() => {
      return new Promise(resolve => {
        resolve(['abcdefgjijkl.jpg'])
      })
    })

    sandbox.stub(aws, 'getUploadUrl').value(() => {
      return ['sale/abcdefghijkl/a.jpg']
    })
  })

  after(() => {
    sandbox.restore()
  })

  it('POST /sale', async () => {
    await req
      .post('/sale').expect(201)
      .set('token', token)
      .send({
        itemName: '물건',
        itemDescription: '물건의 설명',
        itemPrice: '2000',
        images: ['a.jpg']
      })
  })

  it('GET /sale/{id}', async () => {
    await req
      .get('/sale/abcdefghijkl').expect(200)
      .set('token', token)
  })

  it('PUT /sale/{id}', async () => {
    await req
      .put('/sale/abcdefghijkl').expect(201)
      .set('token', token)
      .send({
        itemName: '물건',
        itemDescription: '물건의 설명',
        itemPrice: '3000',
        images: ['abcdefghijkl', 'b.jpg']
      })
  })

  it('DELETE /sale/{id}', async () => {
    await req
      .delete('/sale/abcdefghijkl').expect(204)
      .set('token', token)
  })

  it('GET /sale/history', async () => {
    await req
      .get('/sale/history?offset=0&limit=5').expect(200)
      .set('token', token)
  })
})
