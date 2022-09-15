import app from '../../src/app'

export default (data?: object) => {
  const testUser = {
    username: 'test' + Math.floor(Math.random() * 10000),
    email: 'test' + Math.floor(Math.random() * 10000) + '@test',
    password: 'test'
  }
  return app.service('accounts').create(data
    ? data
    : testUser
  )
}
