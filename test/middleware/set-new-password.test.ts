import app from '../../src/app'
import request from 'supertest'
// @ts-ignore
import createUser from '../helpers/create-test-user'

describe('setNewPassword middleware', () => {
  let userId: number
  let verificationToken: string
  let password: string
  beforeEach(async () => {
    await createUser()
      .then((resp: any) => {
        userId = resp.id
        verificationToken = resp.verificationToken
        password = resp.password
      })
  })

  afterEach(async () => {
    await app.service('accounts').remove(userId)
  })

  it('should change password with correct verification', async () => {
    await request(app)
      .post('/accounts/set-pwd')
      .send({ userId, verificationToken, password: '123456' })
      .expect(200)
    const user = await app.service('accounts').get(userId)
    expect(user.password).not.toEqual(password)
    expect(user.verificationToken).toBeNull()
  })

  it('should not change anything with wrong verification', async () => {
    await request(app)
      .post('/accounts/set-pwd')
      .send({ userId, verificationToken: 'wrong token', password: '123456' })
      .then((resp: any) => {
        expect(resp.body.status).toBe(403)
      })

    const usr = await app.service('accounts').get(userId)
    expect(usr.password).toEqual(password)
    expect(usr.verificationToken).toEqual(verificationToken)
  })
})
