import app from '../../src/app'
// @ts-expect-error
import request from 'supertest'
// @ts-expect-error
import { getAuthenticationToken, sendAuthenticatedRequest, createTestUser } from '../helpers'

describe('userRole middleware', () => {
  let userId: number

  beforeAll(async () => {
    await createTestUser()
      .then((resp: any) => {
        userId = resp.id
      })
  })

  afterAll(async () => {
    await app.service('accounts').remove(userId)
  })

  describe('non-authenticated', () => {
    it('should fail for non-authenticated user', async () => {
      await request(app)
        .get(`/accounts/${userId}/role`)
        .expect(401)
    })

    it('should not throw 404 for non-existent user', async () => {
      await request(app)
        .get('/accounts/999999/role')
        .expect(401)
    })

    it('should throw 405 for wrong method', async () => {
      await request(app)
        .post(`/accounts/${userId}/role`)
        .expect(405)
    })
  })

  describe('authenticated', () => {
    let token: string
    let authId: number
    beforeAll(async () => {
      await createTestUser()
        .then(async (resp: any) => {
          authId = resp.id
          token = await getAuthenticationToken(resp.email, 'test')
        })
    })
    afterAll(async () => {
      await app.service('accounts').remove(authId)
    })

    it('should return correct role (student)', async () => {
      await sendAuthenticatedRequest(app, 'get', `/accounts/${userId}/role`, token)
        .then((resp: any) => {
          expect(resp.status).toBe(200)
          expect(resp.body.role).toBe('student')
        })
    })

    it('should return correct role (author)', async () => {
      await app.service('accounts').patch(userId, {
        role: 'author'
      })
      await sendAuthenticatedRequest(app, 'get', `/accounts/${userId}/role`, token)
        .then((resp: any) => {
          expect(resp.status).toBe(200)
          expect(resp.body.role).toBe('author')
        })
    })

    it('should return correct role (editor)', async () => {
      await app.service('accounts').patch(userId, {
        role: 'editor'
      })
      await sendAuthenticatedRequest(app, 'get', `/accounts/${userId}/role`, token)
        .then((resp: any) => {
          expect(resp.status).toBe(200)
          expect(resp.body.role).toBe('editor')
        })
    })

    it('should return correct role (admin)', async () => {
      await app.service('accounts').patch(userId, {
        role: 'admin'
      })
      await sendAuthenticatedRequest(app, 'get', `/accounts/${userId}/role`, token)
        .then((resp: any) => {
          expect(resp.status).toBe(200)
          expect(resp.body.role).toBe('admin')
        })
    })

    it('should return 404 for non-existent user', async () => {
      await sendAuthenticatedRequest(app, 'get', '/accounts/999999/role', token)
        .then((resp: any) => {
          expect(resp.status).toBe(404)
        })
    })

    it('should throw 405 for wrong method', async () => {
      await sendAuthenticatedRequest(app, 'post', `/accounts/${userId}/role`, token)
        .then((resp: any) => {
          expect(resp.status).toBe(405)
        })
    })
  })
})
