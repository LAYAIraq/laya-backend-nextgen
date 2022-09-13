import app from '../../src/app'
// import {LocalStrategy} from '@feathersjs/authentication-local'
// import {NullableId} from '@feathersjs/feathers'

const userParams = () => {
  return {
    username: 'something' + Math.floor(Math.random() * 100),
    password: 'supersecret',
    email: 'veryunique' + Math.floor(Math.random() * 100)
  }
}

describe('\'accounts\' service', () => {
  afterAll(async () => {
    await app.service('accounts').find()
      .then(async (resp: any ) => {
        for (const user of resp.data) {
          await app.service('accounts').remove(user.id)
            .then(() => console.log('removed user ' + user.id))
            .catch(() => console.log('user ' + user.id + ' already removed'))
        }
      })
      .catch(() => 'user already removed')
  })

  it('registered the service', () => {
    const service = app.service('accounts')
    expect(service).toBeTruthy()
  })

  describe('validation', () => {
    it('rejects when wrong role is set', async () => {
      const testUser = app.service('accounts').create({
        ...userParams(),
        role: 'someRole'
      })
      await expect(testUser).rejects.toThrow('role does not exist!')
    })

    it('sets role to student none is set', async () => {
      const testUser = app.service('accounts').create({
        ...userParams()
      })
      await expect(testUser).resolves.toHaveProperty('role', 'student')
    })
  })

  describe('hooks', () => {
    let userId: number
    beforeEach(async () => {
      await app.service('accounts').create({
        ...userParams()
      })
        .then(resp => {
          userId = resp.id
        })
        .catch(() => {
          throw new Error('user already exists')
        })
    })

    afterEach(async () => {
      await app.service('accounts').remove(userId)
        .then(() => console.log('removed user ' + userId))
        .catch(() => console.log('user ' + userId + ' already removed'))
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
      await app.service('accounts').remove(userId)
        .then(async () => {
          resp = await findIf('user-appearance-prefs', userId)
          expect(resp.total).toBe(0)
          resp = await findIf('user-media-prefs', userId)
          expect(resp.total).toBe(0)
        })
    })

    it.todo('correctly checks for user email')
  })

  describe('custom endpoints', () => {
    it('counts editors when accessing accounts/editors', async () => {
      let id: number
      await app.service('accounts').create({
        username: 'myEditor',
        email: 'the@editor',
        password: 'veryverysecret',
        role: 'editor'
      }).then(async resp => {
        id = resp.id
        await expect(app.service('accounts').get('editors')).resolves.toStrictEqual({editors: 1})
        await app.service('accounts').remove(id).catch((err: Error) => {
          throw err
        })
      })

    })
  })
})
