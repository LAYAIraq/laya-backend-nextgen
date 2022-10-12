import app from '../../src/app'
// @ts-expect-error
import { createTestUser } from '../helpers'
import { NotFound } from '@feathersjs/errors'
// import request from 'supertest'

describe('\'editor-votes\' service', () => {
  let editorId: number
  let studentId: number
  let applicationId: number
  let voteId: number

  beforeAll(async () => {
    await createTestUser({
      username: 'editor',
      email: 'editor@editor.de',
      password: 'editor',
      role: 'editor'
    })
      .then((resp: any) => {
        editorId = resp.id
      })
    await createTestUser({
      username: 'student',
      email: 'student@student.de',
      password: 'student',
      role: 'student'
    })
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
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: studentId
    })
      .then((resp: any) => {
      // console.log(resp)
        applicationId = resp.id
      })
      .catch((err: any) => {
        console.log(err.message)
      })
  })

  afterEach(async () => {
    if (voteId !== undefined) {
      await app.service('editor-votes').remove(voteId)
        .catch(() => 'no vote to remove')
    }
    await app.service('author-applications').remove(applicationId)
      .catch((err: any) => {
        console.warn(err.message)
        console.log(err)
      })
    await app.service('accounts').find({ query: { username: 'non-editor' } })
      .then(async (resp: any) => {
        await app.service('accounts').remove(resp.data[0].id)
      })
      .catch(() => 'no non-editor account')
  })

  it('registered the service', () => {
    expect(app.service('editor-votes')).toBeTruthy()
  })

  it('creates a vote for editor', async () => {
    const vote = await app.service('editor-votes').create({
      vote: true,
      editorId,
      applicationId
    })
      .catch((err: any) => {
        console.log(err.message)
        console.log(err)
        throw err
      })
    voteId = vote.id
    expect(vote).toHaveProperty('vote', true)
    const votes: any = await app.service('editor-votes').find({ query: { id: voteId } })
    expect(votes.data).toHaveLength(1)
  })

  it('updating vote creates row in editor-vote-history table', async () => {
    await app.service('editor-votes').create({
      vote: true,
      editorId,
      applicationId
    })
      .then(async (resp: any) => {
        await app.service('editor-votes').patch(resp.id, { vote: false })
          .catch((err: any) => {
            console.log(err.message)
            console.log(err)
            throw err
          })
          .then(async () => {
            const history: any = await app.service('editor-vote-history').find()
            expect(history.total).toBeGreaterThanOrEqual(1)
          })
      })
  })

  // skipped b/c no foreign keys, manually tested on 09-30/22
  it.skip('deleting vote deletes corresponding rows in editor-vote-history table', async () => {

  })

  it('adding vote for non-editor fails', async () => {
    await expect(app.service('editor-votes').create({
      vote: true,
      editorId: studentId,
      applicationId
    })).rejects.toThrow('You do not have permission to perform this action')

    // .finally(async () => {
    //   await app.service('accounts').remove(resp.id)
    // })
  })

  // skipped because foreign keys are not saved in test db
  // tested manually 09-30/2022
  it.skip('adding vote for non-existent application fails', async () => {
    await expect(app.service('editor-votes').create({
      vote: true,
      editorId,
      applicationId: 9999
    })).rejects.toThrow('Application not found')
  })

  it('adding vote for non-existent editor fails', async () => {
    await expect(app.service('editor-votes').create({
      vote: true,
      editorId: 9999,
      applicationId
    })).rejects.toThrow(expect.any(NotFound))
  })

  // skipped b/c no foreign keys, manually tested on 09-30/22
  it.skip('adding vote for already voted application fails', async () => {
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
