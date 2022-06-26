import { Request, Response } from 'express'
import { Application } from '../declarations'

export default (app: Application) => (req: Request, res: Response): void => {
  const accounts = app.service('accounts')
  const { userId, verificationToken, password } = req.body
  // console.log('Query:')
  // console.log(req.body)
  // console.log('Params: ')
  // console.log(req.params)
  // console.log('Request: ')
  // console.log(req)
  accounts.get(userId)
    .then(user => {
      if (user.verificationToken === verificationToken) {
        accounts.patch(userId, { verificationToken: null, password: password })
          .then(() => res.send({ successful: true }))
          .catch(() => res.send({ successful: false }))
      } else {
        res.json({ message: 'wrong verification', status: 403 })
      }
    })
    .catch((err: Error) => {
      res.json({ status: 404, message: err.message })
    })
}
