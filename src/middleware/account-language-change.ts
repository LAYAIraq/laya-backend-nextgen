/**
 * @file account-language-change.ts - middleware for user change language
 * @author cmc
 * @since v0.0.1
 */
import { Application } from '../declarations'
import { Request, Response } from 'express'
import { Forbidden, MethodNotAllowed, BadRequest } from '@feathersjs/errors'
import checkAuthentication from '../misc/check-authentication'

export default (app: Application) => (req: Request, res: Response): void => {
  const userId = req.params.id
  const lang = req.body.lang

  /**
   * @function change the language for userId if it exists, 404 otherwise
   * @author cmc
   */
  const changeLanguage = (): void => {
    if (typeof (lang) === 'undefined') {
      res.status(400).send(new BadRequest('No language specified'))
    }
    // @ts-expect-error - here we know that the user is authenticated
    const token = req.headers.authorization.split(' ')[1]
    app.service('authentication').verifyAccessToken(token)
      .then((payload) => {
        if (payload.sub === userId) {
          app.service('accounts').patch(userId, { lang })
            .then(() => {
              res.send(true)
            })
            .catch(() => {
              res.send(false)
            })
        } else {
          res.status(403).send(new Forbidden('You can only change your own language'))
        }
      })
      .catch((err: any) => {
        res.status(403).send(new Forbidden(err.message))
      })
  }

  if (req.method === 'POST') {
    checkAuthentication(app, req, res, changeLanguage)
  } else {
    res.status(405).send(new MethodNotAllowed('Method not allowed'))
  }
}
