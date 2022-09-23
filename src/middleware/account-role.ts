/**
 * @file account-role.ts - middleware for user role
 * @author cmc
 * @since v0.0.1
 */
import { Application } from '../declarations'
import { Request, Response } from 'express'
import { NotFound, MethodNotAllowed } from '@feathersjs/errors'
import checkAuthentication from '../misc/check-authentication'

export default (app: Application) => (req: Request, res: Response): void => {
  const userId = req.params.id

  /**
   * @function return the role for userId if it exists, 404 otherwise
   * @author cmc
   */
  const getRole = (): void => {
    app.service('accounts').get(userId)
      .then((resp: any) => {
        res.send({ role: resp.role })
      })
      .catch((err: any) => {
        res.status(404).send(new NotFound(err.message))
      })
  }

  if (req.method === 'GET') {
    checkAuthentication(app, req, res, getRole)
  } else {
    res.status(405).send(new MethodNotAllowed('Method not allowed'))
  }
}
