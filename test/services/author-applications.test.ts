import app from '../../src/app'
import {NotFound, Forbidden} from '@feathersjs/errors'
// @ts-ignore
import {createTestUser} from '../helpers'

describe('\'author-applications\' service', () => {
  let userId: number

  beforeAll(async () => {
    await createTestUser({
      username: 'test',
      email: 'test@test',
      password: 'test',
      role: 'student'})
    .then((resp: any) => {
      userId = resp.id
    })
  })

  afterAll(async () => {
    await app.service('accounts').remove(userId)
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

  it('successfully creates an application with all required input', async () => {
    await expect(app.service('author-applications').create({
      applicationText: 'test application',
      areaOfExpertise: 'test area of expertise',
      fullName: 'test full name',
      institution: 'test institution',
      applicantId: userId
    }))
      .resolves.toBeTruthy()
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

})
