/**
 * @file create-user.ts - create a new user, admin only
 * @author cmc
 * @since v0.0.1
 */
import { Request, Response } from 'express'
import { Application } from '../declarations'
import { NotAcceptable, MethodNotAllowed } from '@feathersjs/errors'
import checkAuthentication from '../misc/check-authentication'
import randomPassword from '../misc/random-password'
import roles from '../misc/roles'

/**
 * @function create a new user after checking request method and authentication
 * @author cmc
 * @param app The feathers application
 * @param req The request
 * @param res The response
 */
export default (app: Application) => (req: Request, res: Response): void => {
  /**
   * @function create a new user with random password
   * @author cmc
   */
  const createUser = (): void => {
    const pwd = randomPassword(12)
    if (typeof (req.body.role) !== 'undefined' &&
      !(Object.values(roles).some(role => role === req.body.role))
    ) { // role is defined and not valid
      res.status(406).send(new NotAcceptable('Invalid role'))
    } else { // role is valid if defined
      app.service('accounts').create({
        username: req.body.username,
        password: pwd,
        email: req.body.email,
        role: req.body.role // can be undefined, then setRole hook will set it
      })
        .then((resp: any) => {
          const { password, updatedAt, createdAt, verificationToken, ...user } = resp
          res.send(user)
        })
        .catch((err: Error) => res.send(err))
    }
  }

  // check if request method is POST
  if (req.method === 'POST') {
    checkAuthentication(app, req, res, 'admin', createUser)
  } else {
    res.status(405).send(new MethodNotAllowed('wrong request'))
  }
}
