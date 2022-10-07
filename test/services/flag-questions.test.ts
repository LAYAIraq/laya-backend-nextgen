import app from '../../src/app'

describe('\'flagQuestions\' service', () => {
  it('registered the service', () => {
    expect(app.service('flag-questions')).toBeTruthy()
  })
})
