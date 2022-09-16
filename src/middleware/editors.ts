import { Request, Response } from 'express'
import { Application } from '../declarations'
import { NotAuthenticated, Forbidden } from '@feathersjs/errors'

export default (app: Application) => (req: Request, res: Response): void => {
  const countEditors = (): void => {
    app.service('accounts').find({
      query: {
        $limit: 0,
        role: 'editor'
      }
    })
      .then((resp: any) => {
        res.send({ editors: resp.total })
      })
      .catch((err: Error) => {
        console.error(err)
        res.status(400).send(err)
      })
  }
  // console.log(req.body)
  // console.log(req.params)
  // console.log(req.query)
  // console.log(req.headers)

  if (typeof (req.headers.authorization) !== 'undefined') {
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token)
    app.service('authentication').verifyAccessToken(token)
      .then((payload) => {
        // console.log(payload)
        app.service('accounts').get(payload.sub)
          .then((user) => {
            user.role === 'editor'
              ? countEditors()
              : res.status(403).send(new Forbidden('You are not an editor'))
          })
          .catch(() => {
            throw new NotAuthenticated('Invalid token')
          })
      })
      .catch(() => {
        throw new NotAuthenticated('Invalid token')
      })
  } else {
    res.status(401).send(new NotAuthenticated('only authenticated users can access this'))
  }
}
