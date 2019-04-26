import * as request from 'supertest'
import * as sinon from 'sinon'
import { Types } from 'mongoose'
import app from '../src/app'
import { createToken } from '../src/util/jwt'
import * as aws from '../src/util/aws'
import { Sale } from '../src/model/sale'

describe('user test', () => {
  let req: request.SuperTest<request.Test>
  let tokenWithoutEmail: string
  let sandbox: sinon.SinonSandbox

  before(() => {
    req = request(app)
    tokenWithoutEmail = createToken('abcd1234', 'nye', 'http://localhost:3000', 'nye@gmail.com')

    sandbox = sinon.createSandbox()

    sandbox.stub(Sale.prototype, 'save').value(() => {
      return new Promise((resolve) => {
        resolve({
          _id: Types.ObjectId('abcdefghijkl')
        })
      })
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
      .set('token', tokenWithoutEmail)
      .send({
        itemName: '물건',
        itemDescription: '물건의 설명',
        itemPrice: '2000',
        images: ['a.jpg']
      })
  })
})
