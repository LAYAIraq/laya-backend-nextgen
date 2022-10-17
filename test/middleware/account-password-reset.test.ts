import app from '../../src/app'
// @ts-expect-error
import request from 'supertest'
// @ts-expect-error
import createUser from '../helpers/create-test-user'

describe('resetPassword middleware', () => {
  let id: number

  beforeAll(async () => {
    await createUser()
      .then((account: any) => {
        id = account.id
      })
  })

  afterAll(async () => {
    await app.service('accounts').remove(id)
  })

  it('changes the password, locks account', async () => {
    await app.service('accounts').get(id)
      .then(async (account: any) => {
        const { id, password } = account
        await request(app)
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          .post(`/accounts/pwd-reset/${id}`)
          .expect(200)
        const usr = await app.service('accounts').get(id)
        expect(usr).toHaveProperty('password', expect.not.stringMatching(password))
        expect(usr).toHaveProperty('locked', expect.any(String))
      })
      .catch(() => {
        expect(true).toBe(false)
      })
  })

  it('fails when account is locked', async () => {
    await app.service('accounts').patch(id, { locked: Date.now() })
    await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      .post('/accounts/pwd-reset/' + id)
      .expect(403)
  })
})
