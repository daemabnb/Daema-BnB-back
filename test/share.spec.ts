import * as request from 'supertest'
import * as sinon from 'sinon'
import { Types } from 'mongoose'
import app from '../src/app'
import { createToken } from '../src/util/jwt'

describe('share test', () => {
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
})