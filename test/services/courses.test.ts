import app from '../../src/app'

describe('\'courses\' service', () => {
  it('registered the service', () => {
    expect(app.service('courses')).toBeTruthy()
  })

  it('creates a course', async () => {
    const course = {
      name: 'Test Course',
      category: 'TEST',
      authorId: 1
    }
    await app.service('courses').create(course)
      .catch(err => {
        console.log(err)
        console.warn(err.message)
      })
      .then(resp => {
        expect(resp).toHaveProperty('courseId')
        expect(resp).toHaveProperty('authorId', 1)
      })

  })
})
