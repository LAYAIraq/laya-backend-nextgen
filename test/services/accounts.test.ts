import app from '../../src/app'
// import {LocalStrategy} from '@feathersjs/authentication-local'
// import {NullableId} from '@feathersjs/feathers'

const userParams = () => {
  return {
    username: 'something' + Math.floor(Math.random() * 10),
    password: 'supersecret',
    email: 'veryunique' + Math.floor(Math.random() * 10)
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

  describe.skip('hooks', () => {
    let userId: number
    beforeAll(async () => {
      await app.service('accounts').create({
        ...userParams()
      })
        .then(resp => {
          console.log(resp)

          userId = resp.data[0].id
          console.log(`userId: ${userId}`)
        })
        .catch(async () => { // fallback if user has been created
          await app.service('accounts').find()
            .then((resp: any) => userId = resp.data[0].id)
        })
    })

    it('also created an entry in appearance prefs', async () => {
      const resp: any = await app.service('user-appearance-prefs').find({
        id: userId
      })
      console.log(resp)
      expect(resp.data.length).toBeTruthy()
      expect(resp.data[0].id).toEqual(userId)
    })

    it('also created an entry in media prefs', async () => {
      const resp: any = await app.service('user-media-prefs').find({
        id: userId
      })
      expect(resp.data.length).toBe(1)
      expect(resp.data[0].id).toBeTruthy()
    })

    it('removes prefs when removing user', async () => {
      await app.service('accounts').remove(userId)
        .then(async () => {
          let resp: any = await app.service('user-appearance-prefs').find({id: userId})
          expect(resp.data.length).toBe(0)
          resp = await app.service('user-media-prefs').find({id: userId})
          expect(resp.data.length).toBe(0)
        })
    })

    it('counts editors when accessing accounts/editors', async () => {
      const editorCreation = app.service('accounts').create({
        username: 'myEditor',
        email: 'the@editor',
        password: 'veryverysecret',
        role: 'editor'
      })
      await expect(editorCreation).resolves.toBeTruthy()
      await expect(app.service('accounts').get('editors')).resolves.toStrictEqual({editors: 1})
    })

    it.todo('correctly checks for user email')
  })
})
