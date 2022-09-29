import app from '../../src/app'
// @ts-ignore
import {getAuthenticationToken, createTestUser} from '../helpers'
import {NotFound, Forbidden, BadRequest} from '@feathersjs/errors'
// @ts-ignore
import request from 'supertest'

describe('\'courses\' service', () => {
  let authorToken: string
  let authorId: number

  beforeAll(async () => {
    await app.service('accounts').create({
      username: 'author',
      email: 'author@author',
      password: 'author',
      role: 'author'
    })
      .catch((err: any) => {
        console.log(err)
        throw err
      })
      .then(async (resp: any) => {
        authorId = resp.id
        authorToken = await getAuthenticationToken('author@author', 'author')
          .catch((err: any) => {
            console.log(err)
            throw err
          })
      })
  })

  afterAll(async () => {
    await app.service('accounts').remove(authorId)
    await app.service('accounts').find({query: { username: 'user'}})
      .then(async (resp: any) => await app.service('accounts').remove(resp.data[0].id))
    await app.service('courses').find({query: { category: 'TEST'}})
      .then(async (resp: any) => {
        resp.data.forEach((course: any) => {
          app.service('courses').remove(course.courseId)
        })
      })
  })

  it('registered the service', () => {
    expect(app.service('courses')).toBeTruthy()
  })

  it('creates a course for exisiting author', async () => {
    const course = {
      name: 'Test Course',
      category: 'TEST',
      authorId
    }
    await app.service('courses').create(course)
      .then(resp => {
        expect(resp).toHaveProperty('courseId', expect.any(String))
        // expect(resp).toHaveProperty('authorId', 1)
      })
  })

  it('fails to create a course for non-exisiting author', async () => {
    const course = {
      name: 'Test Course',
      category: 'TEST',
      authorId: 999
    }
    await expect(app.service('courses').create(course)).rejects.toThrow(NotFound)
  })

  it('rejects to create a course for non-author', async () => {
    await createTestUser({
      username: 'user',
      email: 'user@user',
      password: 'user',
      role: 'student'
    })
      .then(async (resp: any) => {
        const course = {
          name: 'Test Course',
          category: 'TEST',
          authorId: resp.id
        }
        await expect(app.service('courses').create(course)).rejects.toThrow(Forbidden)
      })
  })

  it('rejects to create a course for non-authenticated user', async () => {
    const course = {
      name: 'Test Course',
      category: 'TEST',
      authorId
    }
    await request(app).post('/courses').send(course).expect(401)
  })

  it('fails to create a course with missing name', async () => {
    const course = {
      category: 'TEST',
      authorId
    }
    await expect(app.service('courses').create(course)).rejects.toThrow(BadRequest)
  })

  it('fails to create a course with missing category', async () => {
    const course = {
      name: 'Test Course',
      authorId
    }
    await expect(app.service('courses').create(course)).rejects.toThrow(BadRequest)
  })

  it('rejects to patch a course for unauthenticated user', async () => {
    const course = {
      name: 'Test Course',
      category: 'TEST',
      authorId
    }
    await app.service('courses').create(course)
      .then(async (resp: any) => {
        const course = {
          name: 'Test Course 2',
          category: 'TEST',
          authorId: 999
        }
        await request(app).patch(`/courses/${resp.courseId}`).send(course).expect(401)
      })
  })

  // skipped b/c foreign keys are not saved
  it.skip('rejects to patch a course for a different user than the author', async () => {
    await createTestUser({
      username: 'user',
      email: 'user@user',
      password: 'user',
      role: 'author'
    })
      .then(async (resp: any) => {
        const course = {
          name: 'Test Course 2',
          category: 'TEST',
          authorId: resp.id
        }
        await request(app).patch(`/courses/${resp.courseId}`).set('Authorization', `Bearer ${authorToken}`).send(course).expect(403)
      })
  })

  // skipped b/c foreign keys are not saved
  it.skip('allows to patch a course for the author', async () => {
    const course = {
      name: 'Test Course',
      category: 'TEST',
      authorId
    }
    await app.service('courses').create(course)
      .then(async (resp: any) => {
        const course = {
          name: 'Test Course 2',
          category: 'TEST',
          authorId
        }
        await request(app).patch(`/courses/${resp.courseId}`).set('Authorization', `Bearer ${authorToken}`).send(course).expect(200)
      })
  })
})
