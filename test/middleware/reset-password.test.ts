import app from '../../src/app'
import request from 'supertest'

describe('resetPassword middleware', () => {
  let password: string
  let id: number

  beforeEach( async () => {
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

  afterEach( async () => {
    await app.service('accounts').remove(id)
  })

  it('changes the password', async () => {
    app.service('accounts').create({
      username: 'test',
      email: 'test',
      password: 'test'
    })
      .then(async (account: any) => {
        const pwd = account.password
        await request(app)
          .post('/accounts/pwd-reset/' + account.id)
          .expect(200)
        await expect(app.service('accounts').get(account.id)).resolves.toHaveProperty('password', expect.not.stringMatching(pwd))
      })
      .catch((err: Error) => console.log(err))
  })

  it('fails when account is locked', async () => {
    await app.service('accounts').patch(id, {locked: true})
    await request(app)
      .post('/accounts/pwd-reset/' + id)
      .expect(403)
  })
})
