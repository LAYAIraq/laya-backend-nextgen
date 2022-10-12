import app from '../../src/app'
// @ts-expect-error
import request from 'supertest'
// @ts-expect-error
import { createTestUser, getAuthenticationToken, sendAuthenticatedRequest } from '../helpers'

describe('authorApplicationDecide middleware', () => {
  let editorId: number
  let userId: number
  let editorToken: string
  let userToken: string
  let applicationId: number

  beforeAll(async () => {
    await createTestUser({
      email: 'editor@application-decide.com',
      username: 'decideEditor',
      password: '123456',
      role: 'editor'
    })
      .then(async (user: any) => {
        editorId = user.id
        editorToken = await getAuthenticationToken('editor@application-decide.com', '123456')
      })
    await createTestUser({
      email: 'student@application-decide.com',
      username: 'decideStudent',
      password: '123456',
      role: 'student'
    })
      .then(async (user: any) => {
        userId = user.id
        userToken = await getAuthenticationToken('student@application-decide.com', '123456')
      })
  })

  beforeEach(async () => {
    await app.service('author-applications').create({
      applicantId: userId,
      areaOfExpertise: 'test',
      fullName: 'test',
      institution: 'test',
      applicationText: 'test'
    }).then((application: any) => {
      applicationId = application.id
    })
  })

  afterEach(async () => {
    await app.service('author-applications').remove(applicationId)
  })

  afterAll(async () => {
    await app.service('accounts').remove(editorId)
    await app.service('accounts').remove(userId)
  })

  it('should return 405 if http method is not PATCH', async () => {
    const res = await sendAuthenticatedRequest(app, 'get', `/applications/${applicationId}/decide`, editorToken)
    expect(res.status).toBe(405)
  })

  it('should return 401 if user is not authenticated', async () => {
    await request(app)
      .patch(`/applications/${applicationId}/decide`)
      .send({
        status: 'accepted',
        decidedOn: new Date()
      })
      .expect(401)
  })

  it('should return 403 if user is not an editor', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, userToken, {
      status: 'accepted',
      decidedOn: new Date()
    })
    expect(res.status).toBe(403)
  })

  it('should return 400 if no payload is sent', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, editorToken)
    expect(res.status).toBe(400)
  })

  it('should return 400 if decidedOn is not defined', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, editorToken, {
      status: 'accepted'
    })
    expect(res.status).toBe(400)
  })

  it('should return 400 if status is not defined', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, editorToken, {
      decidedOn: new Date()
    })
    expect(res.status).toBe(400)
  })

  it('should return 400 if status is not accepted, withdrawn or rejected', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, editorToken, {
      decidedOn: new Date(),
      status: 'test'
    })
    expect(res.status).toBe(400)
  })

  it('should return 400 if application is already decided', async () => {
    await app.service('author-applications').patch(applicationId, {
      decidedOn: new Date(),
      status: 'accepted'
    })
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, editorToken, {
      decidedOn: new Date(),
      status: 'accepted'
    })
    expect(res.status).toBe(400)
  })

  it('should return 403 if status is not "withdrawn" and user is not an editor', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, userToken, {
      decidedOn: new Date(),
      status: 'accepted'
    })
    expect(res.status).toBe(403)
  })

  it('should return 403 if status is "withdrawn" and user is not the applicant', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, editorToken, {
      decidedOn: new Date(),
      status: 'withdrawn'
    })
    expect(res.status).toBe(403)
  })

  it('should return 200 if status is "withdrawn" and user is the applicant', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, userToken, {
      decidedOn: new Date(),
      status: 'withdrawn'
    })
    expect(res.status).toBe(200)
  })

  it('should return 404 if application does not exist', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', '/applications/999999/decide', editorToken, {
      decidedOn: new Date(),
      status: 'accepted'
    })
    expect(res.status).toBe(404)
  })

  it('should return 200 if status is "accepted" and user is an editor', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, editorToken, {
      decidedOn: new Date(),
      status: 'accepted'
    })
    expect(res.status).toBe(200)
  })

  it('should return 200 if status is "rejected" and user is an editor', async () => {
    const res = await sendAuthenticatedRequest(app, 'patch', `/applications/${applicationId}/decide`, editorToken, {
      decidedOn: new Date(),
      status: 'rejected'
    })
    expect(res.status).toBe(200)
  })
})
