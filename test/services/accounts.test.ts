import app from '../../src/app'
// import {LocalStrategy} from '@feathersjs/authentication-local'
// import {NullableId} from '@feathersjs/feathers'

const userParams = {
  username: 'something',
  password: 'supersecret',
  email: 'veryunique'
}

describe('\'accounts\' service', () => {
  afterAll(async () => {
    await app.service('accounts').find({...userParams})
      .then(async (resp: any ) => {
        for (const user of resp.data) {
          await app.service('accounts').remove(user.id)
            .then(() => console.log('removed user ' + user.id))
            .catch(err => console.error(err))
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
      const rip = app.service('accounts').create({
        ...userParams,
        role: 'someRole'
      })
      await expect(rip).rejects.toEqual(new Error('role does not exist!'))
    })

    it('sets role to student none is set', async () => {
      const rip = app.service('accounts').create({
        ...userParams
      })
      await expect(rip).resolves.toStrictEqual(expect.objectContaining({
        role: 'student'
      }))
    })
  })

  describe('hooks', () => {
    let userId: number
    beforeAll(async () => {
      await app.service('accounts').create({
        ...userParams
      })
        .then(resp => {
          console.log(resp)

          userId = resp.data[0].id
          console.log(`userId: ${userId}`)
        })
        .catch(async () => { // fallback if user has been created
          await app.service('accounts').find({...userParams})
            .then((resp: any) => userId = resp.data[0].id)
        })
    })

    it('also created an entry in appearance prefs', async () => {
      const resp: any = await app.service('user-appearance-prefs').find({
        id: userId
      })
      expect(resp.data.length).toBe(1)
      expect(resp.data[0].id).toBeTruthy()
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

    it('correctly checks for user email')
  })
})
