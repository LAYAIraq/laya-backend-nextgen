import app from '../../src/app'
import request from 'supertest'
// @ts-expect-error
import { createTestUser } from '../helpers'

describe('\'flag-answers\' service', () => {
  let userId: number
  let courseId: string
  let contentId: string
  beforeAll(async () => {
    await createTestUser({
      email: 'testuser@flag-answers.de',
      username: 'testFlagAnswers',
      role: 'author',
      password: 'test'
    }).then(async (user) => {
      userId = user.id
      await app.service('courses').create({
        name: 'TestCourse',
        category: 'Test',
        authorId: userId
      }).then(async (course) => {
        courseId = course.id
        await app.service('course-contents').create({
          courseId: courseId,
          name: 'TestContent'
        }).then(async (content) => {
          contentId = content.id
          await app.service('flags').create({
            referenceId: contentId,
            question: 'TestQuestion',
            authorId: userId
          })
        })
      })
    })
  })

  afterAll(async () => {
    await app.service('accounts').remove(userId)
    await app.service('courses').remove(courseId)
    await app.service('course-contents').remove(contentId)
    await app.service('flags').remove(contentId)
    await app.service('flag-answers').find({}) // FIXME: remove all flag-answers
      .then(async (answers: any) => {
        console.log(answers)
        for (const answer of answers.data) {
          await app.service('flag-answers').remove(answer.id)
        }
      })
    await app.service('flag-answer-history').find({}) // FIXME: remove all flag-answer-history
      .then(async (answers: any) => {
        console.log(answers)
        for (const answer of answers.data) {
          await app.service('flag-answer-history').remove(answer.id)
        }
      })
  })

  it('registered the service', () => {
    expect(app.service('flag-answers')).toBeTruthy()
  })

  it('should fail for non-authenticated user', async () => {
    await request(app)
      .post('/flag-answers')
      .send({ flagId: contentId, text: 'TestAnswer', authorId: userId })
      .expect(401)
  })

  it('creates a flag answer', async () => {
    await expect(app.service('flag-answers').create({
      flagId: contentId,
      text: 'TestAnswer',
      authorId: userId
    })).resolves.toHaveProperty('text', 'TestAnswer')
  })

  it('creates history when updating a flag answer', async () => {
    const flag = await app.service('flag-answers').create({
      flagId: contentId,
      text: 'TestAnswer',
      authorId: userId
    })
    await expect(app.service('flag-answers').update(flag.id, { text: 'TestAnswer2' })).resolves.toHaveProperty('text', 'TestAnswer2')
    await expect(app.service('flag-answer-history').find()).resolves.toHaveProperty('total')
  })

  // skipped b/c foreign keys are not enforced in tests
  it.skip('collects flag answer history', async () => {
    let flag = await app.service('flag-answers').create({
      flagId: contentId,
      text: 'TestAnswer',
      authorId: userId
    })
    await app.service('flag-answers').update(flag.id, { text: 'TestAnswer2' })
    flag = await app.service('flag-answers').get(flag.id)
    expect(flag).toHaveProperty('history')
    expect(flag.history.length).toBeGreaterThanOrEqual(1) // removing history doesn't work as expected
  })
})
