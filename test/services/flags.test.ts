import app from '../../src/app'
import request from 'supertest'
import { createTestUser } from '../helpers'

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
    await app.service('accounts').find({ query: { email: '@test.de' } })
      .then((res: any) => {
        res.data.forEach(async (user: any) => {
          await app.service('accounts').remove(user.id)
        })
      })
  })

  it('registered the service', () => {
    expect(app.service('flags')).toBeTruthy()
  })

  it('fails for unauthenticated users', async () => {
    await request(app).post('/flags').send({
      referenceId: courseContentId,
      question: 'testQuestion',
      authorId
    })
      .expect(401)
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

  it('creates flag with all neccessary input', async () => {
    await expect(app.service('flags').create(
      { authorId, referenceId: courseContentId, question: 'testtest' }
    )).resolves.toStrictEqual(expect.objectContaining({ // authorId omitted because it is not returned
      referenceId: courseContentId,
      question: 'testtest'
    }))
  })

  it('gets all flagAnswers for a flag', async () => {
    await app.service('flags').create(
      { authorId, referenceId: courseContentId, question: 'testtest' }
    )
    for (let i = 0; i < 5; i++) {
      const user = await createTestUser()
      await app.service('flag-answers').create({
        flagId: courseContentId,
        text: 'testAnswer',
        authorId: user.id
      })
        .then((res: any) => {
          expect(res).toBeTruthy()
          console.log(res)
        })
    }
    const flag = await app.service('flags').get(courseContentId)
    expect(flag.answers).toHaveLength(5)
  })
})
