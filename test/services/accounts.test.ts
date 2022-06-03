import app from '../../src/app'

describe('\'accounts\' service', () => {
  it('registered the service', () => {
    const service = app.service('accounts')
    expect(service).toBeTruthy()
  })

  describe('hooks', () => {
    const userParams = {
      username: 'something',
      password: 'supersecret',
      email: 'veryunique'
    }
    beforeAll(() => {
      try {
        app.service('accounts').create({
          ...userParams
        })
      } catch (e: any) {
        // do nothing
      }
    })

    it('also created an entry in appearance prefs', async () => {
      const prefs = await app.service('user-appearance-prefs').find({
        id: 1
      })
      console.log(prefs)
      expect(prefs).toBeTruthy()
    })
  })
})
