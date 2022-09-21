/**
 * @file check-authentication.ts - function to check if a user is authenticated
 * @author cmc
 * @since v0.0.1
 */

import { Request, Response } from 'express'
import { Forbidden, NotAuthenticated } from '@feathersjs/errors'
import { Application } from '../declarations'

/**
 * @function check if the user is authenticated and has the required role
 *
 * @author cmc
 *
 * @param app The feathers application
 * @param req The request
 * @param res The response
 * @param next The next function to call if the user is authenticated and has the required role
 * @param requiredRole The required role, omit for no role check
 */
export default (
  app: Application,
  req: Request,
  res: Response,
  next: () => void,
  requiredRole?: string
): void => {
  if (typeof (req.headers.authorization) !== 'undefined') {
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token)
    app.service('authentication').verifyAccessToken(token)
      .then((payload) => {
        if (typeof (requiredRole) !== 'undefined') { // role check
          app.service('accounts').get(payload.sub)
            .then((user) => {
              user.role === requiredRole
                ? next()
                : res.status(403)
                  .send(new Forbidden(`You are not an ${requiredRole}`))
            })
            .catch(() => {
              throw new NotAuthenticated('Invalid token')
            })
        } else { // no role check
          next()
        }
      })
      .catch(() => {
        throw new NotAuthenticated('Invalid token')
      })
  } else {
    res.status(401)
      .send(new NotAuthenticated('only authenticated users can access this'))
  }
}
