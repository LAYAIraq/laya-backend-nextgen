import app from '../../src/app'
// @ts-ignore
import request from 'supertest'

describe('nameTaken middleware', () => {

  afterAll(async () => {
    await app.service('accounts').find({ query: { username: 'name-test' } })
      .then(async (resp: any) => {
        await app.service('accounts').remove(resp.data[0].id)
      })
      .catch(() => 'user not found')
  })

  it('fails when no name given', async () => {
    await request(app).get('/accounts/name').expect(404)
  })

  it('fails when name not present', async () => {
    await request(app).get('/accounts/name/somenamethatisnotthere').expect(404)
  })

  it('fails with wrong http method', async () => {
    await request(app).post('/accounts/name/name-test').expect(400)
  })

  it('returns true when name present', async () => {
    await app.service('accounts').create({
      username: 'name-test',
      email: 'test@test',
      password: 'test'
    })
    await request(app).get('/accounts/name/name-test')
      .expect(200)
      .then((res: any) => {
        expect(res.body).toBe(true)
      })
  })
})
