/**
 * @file set-new-password.ts - set new password for user
 * @author cmc
 * @since v0.0.1
 */
import { Request, Response } from 'express'
import { Application } from '../declarations'

/**
 * @function set new password for user with verification token
 * @author cmc
 *
 * @param app The feathers application
 * @param req The request, has to contain user id, password and token in body
 * @param res The response
 */
export default (app: Application) => (req: Request, res: Response): void => {
  const accounts = app.service('accounts')
  const { userId, verificationToken, password } = req.body
  // console.log('Query:')
  // console.log(req.body)
  // console.log('Params: ')
  // console.log(req.params)
  // console.log('Request: ')
  // console.log(req)
  accounts.get(userId)
    .then(user => {
      if (user.verificationToken === verificationToken) {
        accounts.patch(userId, { verificationToken: null, password: password })
          .then(() => res.send({ successful: true }))
          .catch(() => res.send({ successful: false }))
      } else {
        res.json({ message: 'wrong verification', status: 403 })
      }
    })
    .catch((err: Error) => {
      res.json({ status: 404, message: err.message })
    })
}
