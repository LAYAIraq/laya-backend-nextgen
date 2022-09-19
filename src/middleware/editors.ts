import { Request, Response } from 'express'
import { Application } from '../declarations'
import { MethodNotAllowed } from '@feathersjs/errors'
import checkAuthentication from '../misc/check-authentication'

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

  if (req.method === 'GET') {
    checkAuthentication(app, req, res, 'editor', countEditors)
  } else {
    res.status(405).send(new MethodNotAllowed('Wrong http method'))
  }
}
