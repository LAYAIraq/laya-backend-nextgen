import app from '../../src/app'

describe('\'flags\' service', () => {
  let authorId: string
  let courseId: string
  let courseContentId: string

  beforeAll(async () => {
    await app.service('accounts').create({
      email: 'test@flag.de',
      password: 'test',
      username: 'testUserFlag',
      role: 'author'
    })
      .then((res: any) => {
        authorId = res.id
      })
    await app.service('courses').create({
      authorId,
      name: 'testCourseFlag',
      category: 'test'
    })
      .then((res: any) => {
        courseId = res.courseId
      })
    await app.service('course-contents').create({
      courseId,
      name: 'testContentFlag'
    })
      .catch((err: Error) => {
        console.log(err)
        throw new Error(err.message)
      })
      .then((res: any) => {
        courseContentId = res.id
      })

    expect(authorId).toBeDefined()
    expect(app.service('accounts').get(authorId)).toBeTruthy()
    expect(courseId).toBeTruthy()
    expect(app.service('courses').get(courseId)).toBeTruthy()
    expect(courseContentId).toBeTruthy()
    expect(app.service('course-contents').get(courseContentId)).toBeTruthy()
  })
  afterAll(async () => {
    await app.service('accounts').remove(authorId)
    await app.service('courses').remove(courseId)
    await app.service('course-contents').remove(courseContentId)
  })

  it('registered the service', () => {
    expect(app.service('flags')).toBeTruthy()
  })

  it('fails to create flag without referenceId', async () => {
    await expect(app.service('flags').create({ question: 'testtest', authorId })).rejects.toThrow()
  })

  it('fails to create flag without question', async () => {
    await expect(app.service('flags').create({ referenceId: courseContentId, authorId })).rejects.toThrow()
  })

  it('fails to create flag without authorId', async () => {
    await expect(app.service('flags').create({ referenceId: courseContentId, question: 'testtest' })).rejects.toThrow()
  })

  it('creates flag', async () => {
    await expect(app.service('flags').create({ authorId, referenceId: courseContentId, question: 'testtest' }))
      .resolves.toHaveProperty('referenceId', courseContentId)
  })
})
