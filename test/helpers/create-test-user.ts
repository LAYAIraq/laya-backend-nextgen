/**
 * @file create-test-user.ts - function to create a test user
 * @author cmc
 * @since v0.0.1
 */
import app from '../../src/app'

/**
 * @function create a test user with given data or default data
 * @author cmc
 * @param data The data to create the user with
 * @returns Promise resolving to the user
 */
export default (data?: {
  email: string,
  password: string,
  username: string,
  role?: string
}): Promise<any> => {
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
