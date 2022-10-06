import app from '../../src/app'
// import {LocalStrategy} from '@feathersjs/authentication-local'
// import {NullableId} from '@feathersjs/feathers'
// @ts-ignore
import createUser from '../helpers/create-test-user'
const accounts = app.service('accounts')

describe('\'accounts\' service', () => {
  afterAll(async () => {
    await accounts.find()
      .then(async (resp: any ) => {
        for (const user of resp.data) {
          await accounts.remove(user.id)
            .catch(() => 'user not found')
        }
      })
      .catch(() => 'user already removed')
  })

  it('registered the service', () => {
    expect(accounts).toBeTruthy()
  })

  describe('validation', () => {
    it('rejects when wrong role is set', async () => {
      const testUser = accounts.create({
        username: 'something',
        password: 'supersecret',
        email: 'veryunique',
        role: 'someRole'
      })
      await expect(testUser).rejects.toThrow('role does not exist!')
    })

    it('sets role to student none is set', async () => {
      const testUser = createUser()
      await expect(testUser).resolves.toHaveProperty('role', 'student')
    })
  })

  describe('hooks', () => {
    let userId: number
    beforeEach(async () => {
      await createUser()
        .then(resp => {
          userId = resp.id
        })
    })

    afterEach(async () => {
      if (userId !== 0) {
        await accounts.remove(userId)
      }
    })

    it('also created an entry in appearance prefs', async () => {
      const resp: any = await app.service('user-appearance-prefs').find({query:{
        id: userId
      }})
      expect(resp.data.length).toBe(1)
      expect(resp.data[0].id).toEqual(userId)
    })

    it('also created an entry in media prefs', async () => {
      const resp: any = await app.service('user-media-prefs').find({
        query: {id: userId}
      })
      expect(resp.data.length).toBeTruthy()
      expect(resp.data[0].id).toEqual(userId)
    })

    it('removes prefs when removing user', async () => {
      const findIf = (service: string, id: number) => {
        // @ts-ignore
        return app.service(service).find({
          query: {
            id: id,
            $limit: 0
          }})
      }

      let resp: any = await findIf('user-appearance-prefs', userId)
      expect(resp.total).toBe(1)
      resp = await findIf('user-media-prefs', userId)
      expect(resp.total).toBe(1)
      await accounts.remove(userId)
        .then(async () => {
          resp = await findIf('user-appearance-prefs', userId)
          expect(resp.total).toBe(0)
          resp = await findIf('user-media-prefs', userId)
          expect(resp.total).toBe(0)
        })
      userId = 0
    })

    it('removes locked entry when it is older than 24 hrs', async () => {
      const newDate = Date.now() - 1000 * 60 * 60 * 24 * 2
      await accounts.patch(userId, {locked: newDate})
        .then(async () => {
          await expect(accounts.get(userId)).resolves.toHaveProperty('locked', null)
        })
    })

    it('does not remove locked entry when it is not older than 24 hrs', async () => {
      const newDate = Date.now() - 1000 * 60 * 60 * 12
      await accounts.patch(userId, {locked: newDate})
        .then(async () => {
          await expect(accounts.get(userId)).resolves.toHaveProperty('locked', expect.any(String))
        })
    })

    it('creates unique verification code', async () => {
      let verificationCode: string
      for (let i = 0; i < 10; i++) {
        await createUser()
          .then(async (resp: any) => {
            console.log(resp.verificationToken)
            if (verificationCode !== undefined) {
              expect(resp.verificationToken).not.toEqual(verificationCode)
            }
            verificationCode = resp.verificationToken
          })
      }
    })

  })
})
