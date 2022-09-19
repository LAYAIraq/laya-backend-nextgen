import app from '../../src/app'
// @ts-ignore
import request from 'supertest'

const accounts = app.service('accounts')
describe('editors middleware', () => {
  let editorId: number
  let studentId: number

  beforeAll(async () => {
    await accounts.create({
      username: 'myEditor',
      email: 'the@editor',
      password: 'veryverysecret',
      role: 'editor'
    })
      .then((resp: any) => {
        editorId = resp.id
      })

    await accounts.create({
      username: 'myNonEditor',
      email: 'the@normaluser',
      password: 'veryverysecret',
      role: 'student'
    })
      .then((resp: any) => {
        studentId = resp.id
      })
  })

  afterAll(async () => {
    await accounts.remove(editorId)
    await accounts.remove(studentId)
  })

  it('fails for non-authenticated request', async () => {
    await request(app)
      .get('/accounts/editors')
      .expect(401)
  })

  it('fails for non-editor request', async () => {
    const resp = await request(app)
      .post('/authentication')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ strategy: 'local', email: 'the@normaluser', password: 'veryverysecret' })

    const token = resp.body.accessToken
    await request(app)
      .get('/accounts/editors')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
  })

  it('succeeds for editor request', async () => {
    let resp = await request(app)
      .post('/authentication')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ strategy: 'local', email: 'the@editor', password: 'veryverysecret' })

    const token = resp.body.accessToken
    resp = await request(app)
      .get('/accounts/editors')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(resp.body.editors).toBe(1)
  })
})
