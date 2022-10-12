import app from '../../src/app'
// @ts-expect-error
import request from 'supertest'
// @ts-expect-error
import { createTestUser, getAuthenticationToken, sendAuthenticatedRequest } from '../helpers'

describe('accountLanguageChange middleware', () => {
  let uid: number
  let token: string

  beforeAll(async () => {
    await createTestUser()
      .then(async (resp: any) => {
        uid = resp.id
        token = await getAuthenticationToken(resp.email, 'test')
      })
  })
  afterAll(async () => {
    await app.service('accounts').remove(uid)
  })

  describe('non-authenticated', () => {
    it('should fail for non-authenticated user', async () => {
      await request(app)
        .post(`/accounts/${uid}/change-language`)
        .expect(401)
    })

    it('should not throw 404 for non-existent user', async () => {
      await request(app)
        .post('/accounts/999999/change-language')
        .expect(401)
    })

    it('should throw 405 for wrong method', async () => {
      await request(app)
        .get(`/accounts/${uid}/change-language`)
        .expect(405)
    })
  })

  describe('authenticated', () => {
    it('should change language', async () => {
      await expect(app.service('accounts').get(uid)).resolves.toHaveProperty('lang', 'en')
      await sendAuthenticatedRequest(app, 'post', `/accounts/${uid}/change-language`, token, { lang: 'de' })
        .then((resp: any) => {
          expect(resp.body).toBe(true)
        })
      await expect(app.service('accounts').get(uid)).resolves.toHaveProperty('lang', 'de')
    })

    it('should not change language for other user', async () => {
      await sendAuthenticatedRequest(app, 'post', `/accounts/${uid + 1}/change-language`, token, { lang: 'de' })
        .then((resp: any) => {
          expect(resp.status).toBe(403)
        })
    })

    it('should fail for missing language', async () => {
      await sendAuthenticatedRequest(app, 'post', `/accounts/${uid}/change-language`, token, {})
        .then((resp: any) => {
          expect(resp.status).toBe(400)
        })
    })

    it('should fail for invalid body', async () => {
      // @ts-expect-error - invalid body
      await sendAuthenticatedRequest(app, 'post', `/accounts/${uid}/change-language`, token, 'invalid')
        .then((resp: any) => {
          expect(resp.status).toBe(500)
        })
    })

    it('should fail for missing body', async () => {
      await sendAuthenticatedRequest(app, 'post', `/accounts/${uid}/change-language`, token)
        .then((resp: any) => {
          expect(resp.status).toBe(400)
        })
    })
  })
})
