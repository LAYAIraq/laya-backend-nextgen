import { Request, Response } from 'express'
import { Application } from '../declarations'
import { NotFound, BadRequest } from '@feathersjs/errors'

export default (app: Application) => (req: Request, res: Response): void => {
  if (typeof (req.params) !== 'undefined' && req.method === 'GET') {
    console.log(req.params)
    app.service('accounts').find({
      query: {
        username: req.params.name,
        $limit: 0
      }
    })
      .then((resp: any) => {
        if (resp.total === 1) {
          res.send(true)
        } else {
          res.status(404).send(new NotFound('name Not Found'))
        }
      })
      .catch(() => res.status(500).send(new BadRequest('error checking name')))
  } else {
    res.status(400).send(new BadRequest('wrong request'))
  }
}
