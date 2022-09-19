/**
 * @file send-authenticated-request.ts - function to send an authenticated request
 * @author cmc
 * @since v0.0.1
 */
import { Application } from '../../src/declarations'
// @ts-ignore
import request from 'supertest'

/**
 * @function send an authenticated request to the given path with the given method and data
 * @author cmc
 *
 * @param app The feathers application
 * @param method The method to use
 * @param uri The uri to send the request to
 * @param token The token to authenticate with
 * @param data The data to send
 * @returns Promise resolving to the response
 */
export default (app: Application, method: string, uri: string, token: string, data?: object): Promise<any> => {
  // @ts-ignore
  return request(app)
    [method](uri)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send(data)
}
