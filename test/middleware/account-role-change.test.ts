import app from '../../src/app'
// @ts-expect-error
import request from 'supertest'
// @ts-expect-error
import { getAuthenticationToken, sendAuthenticatedRequest, createTestUser } from '../helpers'

describe('accountChangeRole middleware', () => {
  let userId: number
  let userEmail: string
  let adminId: number
  let token: string
  beforeAll(async () => {
    await createTestUser()
      .then((resp: any) => {
        userId = resp.id
        userEmail = resp.email
      })
    await app.service('accounts').create({
      email: 'admin@role-change.de',
      password: '123456',
      username: 'adminUser',
      role: 'admin'
    })
      .then(async (resp: any) => {
        adminId = resp.id
        token = await getAuthenticationToken('admin@role-change.de', '123456')
      })
  })

  afterAll(async () => {
    await app.service('accounts').remove(userId)
    await app.service('accounts').remove(adminId)
  })

  it('should fail for non-authenticated user', async () => {
    await request(app)
      .post(`/accounts/${userId}/change-role`)
      .send({ role: 'author' })
      .expect(401)
  })

  it('should fail for wrong request method', async () => {
    await request(app).patch(`/accounts/${userId}/change-role`)
      .expect(405)
  })

  it('should fail for non-admin user', async () => {
    const token = await getAuthenticationToken(userEmail, 'test')
    const resp = await sendAuthenticatedRequest(app,
      'post',
        `/accounts/${userId}/change-role`,
        token,
        { role: 'author' }
    )
    expect(resp.status).toBe(403)
  })

  it('should fail for non-existent user', async () => {
    const resp = await sendAuthenticatedRequest(
      app,
      'post',
      '/accounts/999999/change-role',
      token,
      { role: 'author' }
    )
    expect(resp.status).toBe(404)
    expect(resp.body.message).toBe('user does not exist')
  })

  it('should fail for non-existent role', async () => {
    const resp = await sendAuthenticatedRequest(
      app,
      'post',
      `/accounts/${userId}/change-role`,
      token,
      { role: 'non-existent' }
    )
    expect(resp.status).toBe(400)
    expect(resp.body.message).toBe('invalid role')
  })

  it('should fail for incomplete request', async () => {
    const resp = await sendAuthenticatedRequest(
      app,
      'post',
        `/accounts/${userId}/change-role`,
        token
    )
    expect(resp.status).toBe(400)
  })

  it('should succeed for admin user and existent role', async () => {
    const resp = await sendAuthenticatedRequest(
      app,
      'post',
      `/accounts/${userId}/change-role`,
      token,
      { role: 'author' }
    )
    expect(resp.status).toBe(200)
    expect(resp.body).toBe(true)
    expect((await app.service('accounts').get(userId)).role).toBe('author')
  })

  it('changing admin role should fail', async () => {
    const resp = await sendAuthenticatedRequest(
      app,
      'post',
      `/accounts/${adminId}/change-role`,
      token,
      { role: 'author' }
    )
    expect(resp.status).toBe(403)
    expect(resp.body.message).toBe('Cannot change role of admin')
  })
})
