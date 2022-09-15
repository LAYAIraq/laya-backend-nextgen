import app from '../../src/app'
import request from 'supertest'

describe('createUser middleware', () => {

  afterEach(async () => {
    await app.service('accounts').find({ query: { username: 'create-test' } })
      .then(async (users: any) => {
        if (users.total !== 0) {
          await app.service('accounts').remove(users.data[0].id)
        }
      })
  })

  it('creates a student with no role given', async () => {
    await request(app)
      .post('/accounts/create')
      .send({
        username: 'create-test',
        email: 'create-test'
      })
    const res: any = await app.service('accounts').find({query: {username: 'create-test'}})
    expect(res.total).toBe(1)
    expect(res.data[0].username).toBe('create-test')
  })

  it('creates an editor ', async () => {
    await request(app)
      .post('/accounts/create')
      .send({
        username: 'create-test',
        email: 'create-test',
        role: 'editor'
      })
    const res: any = await app.service('accounts').find({query: {username: 'create-test'}})
    expect(res.total).toBe(1)
    expect(res.data[0].role).toBe('editor')
  })

  it('creates an author ', async () => {
    await request(app)
      .post('/accounts/create')
      .send({
        username: 'create-test',
        email: 'create-test',
        role: 'author'
      })
    const res: any = await app.service('accounts').find({query: {username: 'create-test'}})
    expect(res.total).toBe(1)
    expect(res.data[0].role).toBe('author')
  })

  it('creates an admin ', async () => {
    await request(app)
      .post('/accounts/create')
      .send({
        username: 'create-test',
        email: 'test',
        role: 'admin'
      })
    const res: any = await app.service('accounts').find({query: {username: 'create-test'}})
    expect(res.total).toBe(1)
    expect(res.data[0].role).toBe('admin')
  })

  it('fails with wrong role', async () => {
    await request(app)
      .post('/accounts/create')
      .send({
        username: 'create-test',
        email: 'create-test',
        role: 'wrong'
      }).expect(403)
    const res: any = await app.service('accounts').find({query: {username: 'create-test'}})
    expect(res.total).toBe(0)
  })

  it('fails with wrong request', async () => {
    await request(app)
      .get('/accounts/create')
      .expect(400)
  })
})
