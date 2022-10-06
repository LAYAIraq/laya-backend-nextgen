/**
 * @file account-role-change.ts - middleware to change the role of an account
 * @author cmc
 * @since v0.0.1
 */
import { Request, Response } from 'express'
import { Application } from '../declarations'
import checkAuthentication from '../misc/check-authentication'
import { Forbidden, NotFound, BadRequest } from '@feathersjs/errors'
import roles from '../misc/roles'

/**
 * @function change the role of an account, admin only
 * @author cmc
 * @param app The feathers application
 */
export default (app: Application) => (req: Request, res: Response): void => {
  /**
   * @function change the role of an account after checking request method and authentication
   * @author cmc
   */
  const changeUserRole = (): void => {
    app.service('accounts').get(req.params.id)
      .then((account: any) => {
        if (account.role === 'admin') {
          res.status(403).send(new Forbidden('Cannot change role of admin'))
        } else {
          app.service('accounts').patch(req.params.id, { role: req.body.role })
            .then(() => {
              res.send(true)
            })
            .catch((err: Error) => {
              // console.error(err)
              res.status(400).send(err)
            })
        }
      })
      .catch(() => {
        res.status(404).send(new NotFound('user does not exist'))
      })
  }

  /**
   * @function roleCheck - check if given role is valid
   * @author cmc
   * @returns true if role is valid, false otherwise
   */
  const roleCheck = (): boolean => {
    if (req.body.role === undefined) {
      res.status(400).send(new BadRequest('role not defined'))
      return false
    } else if (!Object.values(roles).includes(req.body.role)) {
      res.status(400).send(new BadRequest('invalid role'))
      return false
    }
    return true
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed')
  } else {
    if (roleCheck()) {
      checkAuthentication(app, req, res, changeUserRole, 'admin')
    }
  }
}
