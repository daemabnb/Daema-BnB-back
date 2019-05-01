import * as request from 'supertest'
import * as sinon from 'sinon'
import { Types } from 'mongoose'
import DB from '../src/model/index'
import app from '../src/app'
import * as aws from '../src/util/aws'
import * as image from '../src/util/image'
import { createToken } from '../src/util/jwt'

describe('share test', () => {
  let req: request.SuperTest<request.Test>
  let token: string
  let sandbox: sinon.SinonSandbox

  before(() => {
    req = request(app)
    token = createToken('abcd1234', 'nye', 'http://localhost:3000', 'nye@gmail.com')

    sandbox = sinon.createSandbox()

    sandbox.stub(DB.prototype, 'createShare').value(() => {
      return new Promise(resolve => {
        resolve({
          _id: Types.ObjectId('abcdefghijkl')
        })
      })
    })

    sandbox.stub(DB.prototype, 'findShareById').value(() => {
      return new Promise(resolve => {
        resolve({
          _id: 'abcdefghijkl',
          name: 'item',
          description: 'itemssss',
          price: '5000',
          status: '공유 중',
          returnDate: Date.now(),
          period: 7,
          isPublic: false,
          userId: 'abcd1234',
          userName: 'nye',
          userLink: 'http://localhost:3000',
          images: ['a.jpg']
        })
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

  it('POST /share', async () => {
    await req
      .post('/share').expect(201)
      .set('token', token)
      .send({
        itemName: '물건',
        itemDescription: '물건의 설명',
        itemPrice: '2000',
        returnDate: Date.now(),
        period: 7,
        isPublic: false,
        images: ['a.jpg']
      })
  })

  it('GET /share/{id}', async () => {
    await req
      .get('/share/abcdefghijkl').expect(200)
      .set('token', token)
  })
})
