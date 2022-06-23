import { Request, Response } from 'express'
import { Application } from '../declarations'
import { NotAcceptable } from '@feathersjs/errors'

export default (app: Application) => (req: Request, res: Response): void => {
  // console.log(req.body)
  if (typeof (req.body) !== 'undefined') {
    // console.log(req.body.uid)
    // console.log(req.body.token)
    app.service('accounts').find({
      query: { id: req.body.uid }
    })
      .then((resp: any) => {
        if (resp.data.length !== 0 &&
          typeof (resp.data[0]) !== 'undefined') {
          app.service('accounts').patch(resp.data[0].id, {
            verificationToken: null,
            emailVerified: true
          })
            .then(() => res.send())
            .catch((err: Error) => res.send(err))
        } else {
          throw new NotAcceptable('some weird error!')
        }
      })
      .catch((err: Error) => res.send(err))
  }
}
