import app from '../../src/app'
//@ts-ignore
import request from 'supertest'
//@ts-ignore
import { getAuthenticationToken, sendAuthenticatedRequest } from '../helpers'

describe('\'course-name\' middleware', () => {
  let userId: number
  let courseId: string

  beforeAll(async () => {
    await app.service('accounts').create({
      username: 'test',
      email: 'test@mail',
      password: 'test',
      role: 'author'
    })
      .then((account: any) => {
        userId = account.id
      })
    await app.service('courses').create({
      name: 'test',
      category: 'test',
      authorId: userId
    })
      .then((course: any) => {
        courseId = course.id
      })
  })

  afterAll(async () => {
    await app.service('accounts').remove(userId)
    await app.service('courses').remove(courseId)
  })

  it('should fail for wrong request', async () => {
    await request(app).get('/courses/name').expect(405)
  })

  it('should return 401 if not authenticated', async () => {
    await request(app)
      .get('/courses/name')
      .send({ courseId })
      .expect(401)
  })

  it('should return 400 if no courseId is given', async () => {
    const token = await getAuthenticationToken('test@mail', 'test')
    const response = await sendAuthenticatedRequest(app, 'get','/courses/name',  token,  {})
    expect(response.status).toBe(400)
  })

  it('should return 404 if no course with given id exists', async () => {
    const token = await getAuthenticationToken('test@mail', 'test')
    const response = await sendAuthenticatedRequest(app, 'get','/courses/name',  token,  { courseId: '123' })
    expect(response.status).toBe(404)
  })

  it('should return course name if courseId is given', async () => {
    const token = await getAuthenticationToken('test@mail', 'test')
    const response = await sendAuthenticatedRequest(app, 'get', '/courses/name', token, { courseId })
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ courseName: 'test' })
  })

})
