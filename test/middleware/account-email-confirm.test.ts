import app from '../../src/app'
// @ts-expect-error
import request from 'supertest'

describe('Confirm Email middleware', () => {
  let uid: number
  let token: string

  beforeAll(async () => {
    await app.service('accounts').create({
      username: 'confirm-test',
      email: 'user@confirm-test.de',
      password: 'test'
    }).then((resp: any) => {
      uid = resp.id
      token = resp.verificationToken
    })
  })

  afterAll(async () => {
    await app.service('accounts').remove(uid)
  })

  it('should return a 400 with no params', async () => {
    await request(app).post('/accounts/confirm').send({}).expect(400)
  })

  it('should return a 200 and change values in db with correct token', async () => {
    const response = await request(app)
      .post('/accounts/confirm')
      .send({ uid, token })
    expect(response.status).toBe(200)
    expect(response.text).toBe('Email verified')
    const testUser: any = await app.service('accounts').find({ query: { email: 'user@confirm-test.de' } })
    expect(testUser.data[0].emailVerified).toBeTruthy()
    expect(testUser.data[0].verificationToken).toBeNull()
  })

  it('should return a 403 with wrong token', async () => {
    const response = await request(app)
      .post('/accounts/confirm')
      .send({ uid, token: 'wrong token' })
    expect(response.status).toBe(403)
  })

  it('should return a 406 with wrong request', async () => {
    const response = await request(app)
      .get('/accounts/confirm')
      .send({ uid, token })
    expect(response.status).toBe(406)
  })
})
