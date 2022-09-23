import app from '../../src/app'
// @ts-ignore
import request from 'supertest'

describe('emailTaken middleware', () => {

  afterAll(async () => {
    await app.service('accounts').find({ query: {email: 'test@test'} })
      .then(async (resp: any) => {
        await app.service('accounts').remove(resp.data[0].id)
      })
      .catch(() => 'user not found')
  })

  it('fails when no email given', async () => {
    await request(app).get('/accounts/email').expect(404)
  })

  it('fails when email not present', async () => {
    await request(app).get('/accounts/email/doesntmatter').expect(404)
  })

  it('fails with wrong http method', async () => {
    await request(app).post('/accounts/email/test@test').expect(400)
  })

  it('returns true when email present', async () => {
    await app.service('accounts').create({
      username: 'email-test',
      email: 'test@test',
      password: 'test'
    })
    await request(app).get('/accounts/email/test@test')
      .expect(200)
      .then((res: any) => {
        expect(res.body).toBe(true)
      })
  })
})
