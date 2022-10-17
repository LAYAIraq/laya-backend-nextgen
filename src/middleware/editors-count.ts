/**
 * @file editors-count.ts - middleware to return the number of editors
 * @author cmc
 * @since v0.0.1
 */
import { Request, Response } from 'express'
import { Application } from '../declarations'
import { MethodNotAllowed } from '@feathersjs/errors'
import checkAuthentication from '../misc/check-authentication'

/**
 * @function return the number of editors, editors only
 * @author cmc
 *
 * @param app The feathers application
 * @param req The request
 * @param res The response
 */
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
    checkAuthentication(app, req, res, countEditors, 'editor')
  } else {
    res.status(405).send(new MethodNotAllowed('Wrong http method'))
  }
}
