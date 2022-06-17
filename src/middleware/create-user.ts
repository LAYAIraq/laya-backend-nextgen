import { Request, Response } from 'express'
import { Application } from '../declarations'
import randomPassword from '../misc/randomPassword'

export default (app: Application) => (req: Request, res: Response): void => {
  const pwd = randomPassword(12)
  // console.log(req)
  // console.log(req.headers.authorization)
  app.service('accounts').create({
    username: req.body.username,
    password: pwd,
    email: req.body.email,
    role: req.body.role
  })
    .then((resp: any) => {
      const { password, updatedAt, createdAt, ...user } = resp
      res.send(user)
    })
    .catch((err: Error) => res.send(err))
  // next()
}
