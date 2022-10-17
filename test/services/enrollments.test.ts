import app from '../../src/app'

describe('\'enrollments\' service', () => {
  it('registered the service', () => {
    expect(app.service('enrollments')).toBeTruthy()
  })
})
