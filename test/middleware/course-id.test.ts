import app from '../../src/app'
//@ts-ignore
import request from 'supertest'
//@ts-ignore
import { createTestUser, getAuthenticationToken, sendAuthenticatedRequest } from '../helpers'

describe('\'course-id\' middleware', () => {
  let courseId: string
  let userId: number
  beforeAll(async () => {
    await createTestUser({
      email: 'test@courseId',
      password: 'test',
      username: 'testCourseId',
      role: 'author'
    })
      .then((user) => {
        userId = user.id
      })
    await app.service('courses').create({
      name: 'Test Course',
      category: 'Test Category',
      authorId: userId
    })
      .then((course) => {
        courseId = course.courseId
      })
  })

  afterAll(async () => {
    await app.service('accounts').remove(userId)
    await app.service('courses').remove(courseId)
  })

  it('should fail for non-GET requests', async () => {
    await request(app)
      .post('/courses/id')
      .expect(405)
  })

  it('should fail for non-authenticated requests', async () => {
    await request(app)
      .get('/courses/id')
      .send({ courseName: 'Test Course' })
      .expect(401)
  })

  it('should fail for requests without a course name', async () => {
    const token = await getAuthenticationToken('test@user', 'test')
    const resp = await sendAuthenticatedRequest(app, 'get', '/courses/id', token)
    expect(resp.status).toBe(400)
  })

  it('should return 404 for non-existent courses', async () => {
    const token = await getAuthenticationToken('test@courseId', 'test')
    const resp = await sendAuthenticatedRequest(app, 'get', '/courses/id', token, {courseName: 'non-existent-course'})
    expect(resp.status).toBe(404)
  })

  it('should return the correct course id', async () => {
    const token = await getAuthenticationToken('test@courseId', 'test')
    const resp = await sendAuthenticatedRequest(app, 'get', '/courses/id', token, {courseName: 'Test Course'})
    expect(resp.status).toBe(200)
    expect(resp.body).toStrictEqual({ courseId })
  })
})
