import app from '../../src/app'
// @ts-expect-error
import request from 'supertest'
// @ts-expect-error
import sendAuthenticatedRequest from '../helpers/send-authenticated-request'
// @ts-expect-error
import getAuthenticationToken from '../helpers/get-authentication-token'
// @ts-expect-error
import createTestUser from '../helpers/create-test-user'

describe('createUser middleware', () => {
  describe('unauthenticated', () => {
    it('fails for unauthenticated request', async () => {
      await request(app)
        .post('/accounts/create')
        .send({ username: 'myUser', email: 'my@user.de', password: 'veryverysecret' })
        .expect(401)
    })
  })

  describe('authenticated but no admin', () => {
    const user = {
      username: 'myUser',
      email: 'my@user.de',
      password: 'veryverysecret'
    }

    afterEach(async () => {
      await app.service('accounts').find({ query: { email: user.email } })
        .then(async (resp: any) => {
          if (resp.data.length > 0) {
            await app.service('accounts').remove(resp.data[0].id)
          }
        })
    })

    it('fails for authenticated request by student', async () => {
      await createTestUser({ ...user, role: 'student' })
      const token = await getAuthenticationToken('my@user.de', 'veryverysecret')
      await sendAuthenticatedRequest(app, 'post', '/accounts/create', token, {
        username: 'myUser2',
        email: 'my@user2.de',
        password: 'veryverysecret'
      })
        .then((resp: any) => {
          expect(resp.status).toBe(403)
        })
    })

    it('fails for authenticated request by teacher', async () => {
      await createTestUser({ ...user, role: 'author' })
      const token = await getAuthenticationToken('my@user.de', 'veryverysecret')
      await sendAuthenticatedRequest(app, 'post', '/accounts/create', token, {
        username: 'myUser2',
        email: 'my@user2.de',
        password: 'veryverysecret'
      })
        .then((resp: any) => {
          expect(resp.status).toBe(403)
        })
    })

    it('fails for authenticated request by editor', async () => {
      await createTestUser({ ...user, role: 'editor' })
      const token = await getAuthenticationToken('my@user.de', 'veryverysecret')
      await sendAuthenticatedRequest(app, 'post', '/accounts/create', token, {
        username: 'myUser2',
        email: 'my@user2.de',
        password: 'veryverysecret'
      })
        .then((resp: any) => {
          expect(resp.status).toBe(403)
        })
    })
  })

  describe('authenticated admin', () => {
    let token: string
    let adminId: number

    beforeAll(async () => {
      await app.service('accounts').create({
        username: 'admin',
        email: 'admin@admin.de',
        password: 'admin',
        role: 'admin'
      })
        .then(async (resp: any) => {
          adminId = resp.id
          token = await getAuthenticationToken('admin@admin.de', 'admin')
        })
    })

    afterAll(async () => {
      await app.service('accounts').remove(adminId)
    })

    afterEach(async () => {
      await app.service('accounts').find({ query: { username: 'create-test' } })
        .then(async (users: any) => {
          if (users.total !== 0) {
            await app.service('accounts').remove(users.data[0].id)
          }
        })
    })

    it('creates a student with no role given', async () => {
      await sendAuthenticatedRequest(app, 'post', '/accounts/create', token, {
        username: 'create-test',
        email: 'create-test@create-test.de',
        password: 'create-test'
      }).then((resp: any) => { expect(resp.status).toBe(200) })
      const res: any = await app.service('accounts').find({ query: { username: 'create-test' } })
      expect(res.total).toBe(1)
      expect(res.data[0].role).toBe('student')
    })

    it('creates an editor ', async () => {
      await sendAuthenticatedRequest(app, 'post', '/accounts/create', token, {
        username: 'create-test-editor',
        email: 'editor@create-test.de',
        password: 'create-test',
        role: 'editor'
      })
      const res: any = await app.service('accounts').find({ query: { username: 'create-test-editor' } })
      expect(res.total).toBe(1)
      expect(res.data[0].role).toBe('editor')
    })

    it('creates an author ', async () => {
      await sendAuthenticatedRequest(app, 'post', '/accounts/create', token, {
        username: 'create-test',
        email: 'create-test@author.de',
        password: 'create-test',
        role: 'author'
      })
      const res: any = await app.service('accounts').find({ query: { username: 'create-test' } })
      expect(res.total).toBe(1)
      expect(res.data[0].role).toBe('author')
    })

    it('creates an admin ', async () => {
      await sendAuthenticatedRequest(app, 'post', '/accounts/create', token, {
        username: 'create-test',
        email: 'create-test@admin.de',
        password: 'create-test',
        role: 'admin'
      })
      const res: any = await app.service('accounts').find({ query: { username: 'create-test' } })
      expect(res.total).toBe(1)
      expect(res.data[0].role).toBe('admin')
    })

    it('fails with wrong role', async () => {
      await sendAuthenticatedRequest(app, 'post', '/accounts/create', token, {
        username: 'create-test',
        email: 'create-test@wrong.de',
        password: 'create-test',
        role: 'wrong'
      }).then((res: any) => { expect(res.status).toBe(406) })
      const res: any = await app.service('accounts').find({ query: { username: 'create-test' } })
      expect(res.total).toBe(0)
    })

    it('fails with wrong request', async () => {
      await request(app)
        .get('/accounts/create')
        .expect(405)
    })
  })
})
