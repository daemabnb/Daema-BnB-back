import * as request from 'supertest'
import app from '../src/app'

describe('user test', () => {
  let req

  before(() => {
    req = request(app)
  })

  it('POST /user/authemail', async () => {
    await req
      .post('/user/authemail')
      .send({ email: 'abcd1234' })
      .expect(201)
  })
})
