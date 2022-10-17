/**
 * @file get-authentication-token.ts - function to get an authentication token
 * @author cmc
 * @since v0.0.1
 */

import app from '../../src/app'
// @ts-ignore
import request from 'supertest'

/**
 * @function get an authentication token for the given user
 * @author cmc
 *
 * @param email The email of the user
 * @param password The password of the user
 * @returns Promise resolving to the token
 */
export default async (email: string, password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    request(app)
      .post('/authentication')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        strategy: 'local',
        email,
        password
      })
      .end((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.body.accessToken)
        }
      })
  })
}
