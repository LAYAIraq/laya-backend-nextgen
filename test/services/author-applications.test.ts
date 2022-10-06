import app from '../../src/app'
import {NotFound, Forbidden} from '@feathersjs/errors'
// @ts-ignore
import {createTestUser} from '../helpers'

describe('\'author-applications\' service', () => {
  let userId: number

  beforeAll(async () => {
    await createTestUser({
      username: 'testApplication',
      email: 'test@application',
      password: 'test',
      role: 'student'})
    .then((resp: any) => {
      userId = resp.id
    })
  })

  afterAll(async () => {
    await app.service('accounts').remove(userId)
    await app.service('author-applications').find({
      query: { fullName: 'test full name'}
    })
      .then(async (resp: any) => {
        resp.data.forEach((application: any) => {
          app.service('author-applications').remove(application.id)
        })
      })
  })

  it('registered the service', () => {
    expect(app.service('author-applications')).toBeTruthy()
  })

  it('fails to create an application with no data', async () => {
    await expect(app.service('author-applications').create({}))
      .rejects.toThrow()
  })

  it('fails to create an application with no applicantId', async () => {
    await expect(app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution'
    }))
      .rejects.toThrow()
  })

  it('fails to create an application with no applicationText', async () => {
    await expect(app.service('author-applications').create({
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: userId
    }))
      .rejects.toThrow()
  })

  it('fails to create an application with no areaOfExpertise', async () => {
    await expect(app.service('author-applications').create({
      applicationText: 'test application',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: userId
    }))
      .rejects.toThrow()
  })

  it('fails to create an application with no fullName', async () => {
    await expect(app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      institution: 'test institution',
      applicantId: userId
    }))
      .rejects.toThrow()
  })

  it('fails to create an application with no institution', async () => {
    await expect(app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      applicantId: userId
    }))
      .rejects.toThrow()
  })

  it('fails for applicantId that is not a valid account id', async () => {
    await expect(app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: 1234567890
    }))
      .rejects.toThrow(NotFound)
  })

  it('successfully creates an application with all required input',
    async () => {
    await expect(app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: userId
    })).resolves.toBeTruthy()
  })

  it('fails for applicantId that is not a student', async () => {
    await app.service('accounts').patch(userId, {role: 'editor'})
    await expect(app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: userId
    }))
      .rejects.toThrow(Forbidden)
  })
  // TODO: skip roleVerify check that causes test to fail if full test suite is run
  it.skip('saves changed input in application history on patch', async () => {
    let applicationId: number
    await app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: userId
    })
      .catch((err: any) => {
        throw err
      })
      .then(async (resp: any) => {
        applicationId = resp.id
        await expect(app.service('author-applications').patch(applicationId, {
          applicationText: 'test application 2',
          areaOfExpertise: 'test area of expertise 2',
          fullName: 'test full name 2',
          institution: 'test institution 2'
        })).resolves
          .toHaveProperty('areaOfExpertise', 'test area of expertise 2')
        const history: any = await app.service('author-application-history')
          .find({query: {applicationText: 'test application'}})
        expect(history.total).toBeGreaterThanOrEqual(1)
        await expect(app.service('author-applications').get(applicationId))
          .resolves.toHaveProperty('edited', 1)
       })
  })

  // skipped because foreign keys are not saved in test database
  // tested manually on 09-30/2022
  it.skip('removing an application removes its history', async () => {
    await app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: userId
    })
      .then(async (resp: any) => {
        await app.service('author-applications')
          .patch(resp.id, {applicationText: 'test application 2'})
        await app.service('author-applications')
          .patch(resp.id, {areaOfExpertise: 'asd'})
        await app.service('author-applications')
          .patch(resp.id, {fullName: 'asd'})
        await app.service('author-applications')
          .patch(resp.id, {institution: 'asd'})
        await expect(app.service('author-applications')
          .remove(resp.id)).resolves.toBeTruthy()
        await expect(app.service('author-application-history')
          .find({query: {applicationId: resp.id}}))
          .resolves.toHaveProperty('total', 0)
      })

  })

})
