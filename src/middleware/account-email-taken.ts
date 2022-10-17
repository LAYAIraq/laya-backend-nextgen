/**
 * @file account-email-taken.ts - check if email is already taken
 * @author cmc
 * @since v0.0.1
 */
import { Request, Response } from 'express'
import { Application } from '../declarations'
import { NotFound, BadRequest, GeneralError } from '@feathersjs/errors'

/**
 * @function check if email is already taken
 * @author cmc
 *
 * @param app The feathers application
 * @param req The request, has to contain email in params
 * @param res The response
 */
export default (app: Application) => (req: Request, res: Response): void => {
  if (typeof (req.params) !== 'undefined' && req.method === 'GET') {
    // console.log(req.params)
    app.service('accounts').find({
      query: {
        email: req.params.email,
        $limit: 0
      }
    })
      .then((resp: any) => {
        if (resp.total === 1) {
          res.send(true)
        } else {
          res.status(404).send(new NotFound('email not found'))
        }
      })
      .catch(() => res.status(500).send(new GeneralError('error checking email')))
  } else {
    res.status(400).send(new BadRequest('no email provided'))
  }
}
