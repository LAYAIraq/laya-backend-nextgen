import app from '../../src/app'

describe('\'userAppearancePrefs\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-appearance-prefs')
    expect(service).toBeTruthy()
  })
})
