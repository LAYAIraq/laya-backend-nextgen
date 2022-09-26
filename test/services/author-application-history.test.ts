import app from '../../src/app'

describe('\'authorApplicationHistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('author-application-history')
    expect(service).toBeTruthy()
  })
})
