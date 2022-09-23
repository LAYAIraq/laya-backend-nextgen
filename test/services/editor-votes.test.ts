import app from '../../src/app'
// @ts-ignore
import {createTestUser} from '../helpers'
import {NotFound} from '@feathersjs/errors'

describe('\'editor-votes\' service', () => {
  let editorId: number
  let studentId: number
  let applicationId: number

  beforeAll(async () => {
    await createTestUser({
      username: 'editor',
      email: 'editor@editor',
      password: 'editor',
      role: 'editor'})
    .then((resp: any) => {
      editorId = resp.id
    })
    await createTestUser({
      username: 'student',
      email: 'student@student',
      password: 'student',
      role: 'student'})
    .then((resp: any) => {
      studentId = resp.id
    })
  })

  afterAll(async () => {
    await app.service('accounts').remove(editorId)
    await app.service('accounts').remove(studentId)
  })

  beforeEach(async () => {
    await app.service('author-applications').create({
      applicantId: studentId,
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution'
    })
    .then((resp: any) => {
      applicationId = resp.id
    })
    .catch((err: any) => {
      console.log(err.message)
    })
  })

  afterEach(async () => {
    await app.service('editor-votes').find({query: {applicationId, editorId}})
      .then((resp: any) => {
        resp.data.forEach(async (vote: any) => {
          await app.service('editor-votes').remove(vote.id)
        })
      })
      .catch((err: any) => {
        console.warn(err.message)
        console.log(err)
      })
    await app.service('author-applications').remove(applicationId)
    .catch((err: any) => {
      console.warn(err.message)
      console.log(err)
    })
    await app.service('accounts').find({query: { username: 'non-editor'} })
      .then(async (resp: any) => {
        await app.service('accounts').remove(resp.data[0].id)
      })
      .catch(() => console.log('no non-editor account'))

  })

  it('registered the service', () => {
    expect(app.service('editor-votes')).toBeTruthy()
  })

  it('creates a vote for editor', async () => {
    console.log('editorId', editorId)
    console.log('studentId', studentId)
    console.log('applicationId', applicationId)
    const vote = await app.service('editor-votes').create({
      vote: true,
      editorId: editorId,
      applicationId: applicationId
    })
    console.log('vote', vote)
    expect(vote).toHaveProperty('vote', true)

    // await expect(app.service('editor-votes').find({query: {editorId, applicationId}})).resolves.toHaveProperty('data'), expect(Array).toHaveLength(1)
    const votes: any = await app.service('editor-votes').find({query: {editorId, applicationId}})
    expect(votes.data).toHaveLength(1)
    // await app.service('author-applications').remove(applicationId)
  })

  it('updating vote creates row in editor-vote-history table', async () => {
    await expect(app.service('editor-votes').create({
      vote: true,
      editorId,
      applicationId
    })).resolves.toBeTruthy()
    await expect(app.service('editor-votes').find({query: {editorId, applicationId}})).resolves.toHaveProperty('data', expect(Array).toHaveLength(1))
    await app.service('editor-votes').find({query: {editorId, applicationId}})
      .then(async(res: any) => {
        await expect(app.service('editor-votes').patch(res.data[0].id, {vote: false})).resolves.toHaveProperty('vote', 0)
        const editHistory: any = await app.service('editor-vote-history').find({query: {voteId: res.data[0].id}})
        expect(editHistory.total).toBe(1)
        expect(editHistory.data[0].vote).toBe(1)
      })
  })

  it('deleting vote deletes corresponding rows in editor-vote-history table', async () => {
    await app.service('editor-votes').create({
      vote: true,
      editorId,
      applicationId
    })
      .then(async (res: any) => {
        await expect(app.service('editor-votes').patch(res.id, {vote: false})).resolves.toHaveProperty('vote', 0)
        await expect(app.service('editor-votes').patch(res.id, {vote: true})).resolves.toHaveProperty('vote', 1)
        // await expect(app.service('editor-votes').patch(res.id, {vote: null})).resolves.toHaveProperty('vote', null)
        const editHistory: any = await app.service('editor-vote-history').find({query: { voteId: res.id } })
        console.log(editHistory)
        expect(editHistory.data).toHaveLength(2)
        await app.service('editor-votes').remove(res.id)
          .then(async () => {
            const emptyHistory: any = await app.service('editor-vote-history').find({query: {voteId: res.id}})
            expect(emptyHistory.total).toBe(0)
          })
          .catch((err: any) => {
            console.log(err.message)
            throw err
          })
      })
      .catch((err: Error) => {
        console.log(err.message)
        throw err
      })
  })

  it('adding vote for non-editor fails', async () => {
    await app.service('accounts').create({
      username: 'non-editor',
      email: 'non-editor@non-editor',
      password: 'non-editor',
      role: 'student'
    }).then(async (resp: any) => {
      await expect(app.service('editor-votes').create({
        vote: true,
        editorId: resp.id,
        applicationId
      })).rejects.toThrow('You do not have permission to perform this action')

        // .finally(async () => {
        //   await app.service('accounts').remove(resp.id)
        // })
    })
  })

  it('adding vote for non-existent application fails', async () => {
    await expect(app.service('editor-votes').create({
      vote: true,
      editorId,
      applicationId: 9999
    })).rejects.toThrow(expect.any(Error))
  })

  it('adding vote for non-existent editor fails', async () => {
    await expect(app.service('editor-votes').create({
      vote: true,
      editorId: 9999,
      applicationId
    })).rejects.toThrow(expect.any(NotFound))
  })

  it('adding vote for already voted application fails', async () => {
    await app.service('editor-votes').create({
      vote: true,
      editorId,
      applicationId
    })
    await expect(app.service('editor-votes').create({
      vote: true,
      editorId,
      applicationId
    })).rejects.toThrow(expect.any(Error))
  })
})
