import { Request, Response } from 'express'
import { Application } from '../declarations'

export default (app: Application) => (req: Request, res: Response): void => {
  console.log('checking name...')
  if (typeof (req.params) !== 'undefined') {
    console.log(req.params)
    app.service('accounts').find({
      query: { username: req.params.name }
    })
      .then((resp: any) => {
        console.log(resp)
        if (resp.data.length === 1) {
          res.send(true)
        } else {
          res.json({ code: 404, message: 'name Not Found' })
        }
      })
      .catch(() => res.json({ code: 500, message: 'Something went wrong' }))
  } else {
    res.json({ code: 400, message: 'wrong request' })
  }
}
