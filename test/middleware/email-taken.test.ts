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
    const emailTest = request(app).get('/emailTaken')
    await expect(emailTest).resolves.toBeTruthy()
    expect(emailTest.res.statusCode).toBe(404)
  })

  it('fails when email not present', async () => {
    const emailTest = request(app).get('/emailTaken/doesntmatter')
    await expect(emailTest).resolves.toBeTruthy()
    expect(emailTest.res.statusCode).toBe(404)
  })

  it('returns true when email present', async () => {
    await app.service('accounts').create({
      username: 'test',
      email: 'test@test',
      password: 'test'
    })
    const emailTest = request(app).get('/emailTaken/test@test')
    await expect(emailTest).resolves.toBeTruthy()
    expect(emailTest.res.statusCode).toBe(200)
    expect(emailTest.res.text).toBe('true')
  })
})
