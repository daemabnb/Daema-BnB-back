import * as request from 'supertest'
import * as sinon from 'sinon'
import { Types } from 'mongoose'
import app from '../src/app'
import { createToken } from '../src/util/jwt'
import * as aws from '../src/util/aws'
import { Sale, SaleFormat } from '../src/model/sale'

describe('user test', () => {
  let req: request.SuperTest<request.Test>
  let token: string
  let sandbox: sinon.SinonSandbox

  before(() => {
    req = request(app)
    token = createToken('abcd1234', 'nye', 'http://localhost:3000', 'nye@gmail.com')

    sandbox = sinon.createSandbox()

    sandbox.stub(Sale.prototype, 'save').value(() => {
      return new Promise((resolve) => {
        resolve({
          _id: Types.ObjectId('abcdefghijkl')
        })
      })
    })

    sandbox.stub(Sale, 'findOne').value(() => {
      return {
        exec() {
          return new Promise((resolve) => {
            resolve({
              _id: 'abcdefghijkl',
              name: 'item',
              description: 'itemssss',
              price: '5000',
              userId: 'abcd1234',
              userName: 'nye',
              userLink: 'http://localhost:3000'
            })
          })
        }
      }
    })

    sandbox.stub(aws, 'getUploadUrl').value(() => {
      return ['sale/abcdefghijkl/a.jpg']
    })
  })

  after((done) => {
    sandbox.restore()
    done()
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
})
