import app from '../../src/app'
import request from 'supertest'

describe('resetPassword middleware', () => {
  let password: string
  let id: number

  beforeAll( async () => {
    await app.service('accounts').create({
      username: 'test',
      email: 'test',
      password: 'test'
    })
      .then((account: any) => {
        id = account.id
        password = account.password
      })
  })

  afterAll( async () => {
    await app.service('accounts').remove(id)
  })

  it('changes the password, locks account', async () => {
    await app.service('accounts').get(id)
      .then(async (account: any) => {
        const pwd = account.password
        await request(app)
          .post('/accounts/pwd-reset/' + account.id)
          .expect(200)
        const usr = await app.service('accounts').get(account.id)
        expect(usr).toHaveProperty('password', expect.not.stringMatching(pwd))
        expect(usr).toHaveProperty('locked', expect.any(String))
      })
      .catch(() => {
        expect(true).toBe(false)
      })
  })

  it('fails when account is locked', async () => {
    await app.service('accounts').patch(id, {locked: true})
    await request(app)
      .post('/accounts/pwd-reset/' + id)
      .expect(403)
  })
})
