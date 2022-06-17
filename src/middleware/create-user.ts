import { Request, Response, NextFunction } from 'express'
import { Application } from '../declarations'
import randomPassword from '../misc/randomPassword'

export default (app: Application) => (req: Request, res: Response, next: NextFunction): void => {
  const pwd = randomPassword(12)
  console.log(pwd)
  console.log('creating user with random password....')
  console.log(req.body)
  app.service('accounts').create({
    username: req.body.username,
    password: pwd,
    email: req.body.email
  })
    .then(res => {
      console.log(res)
      const { password, ...resp } = res

      res.send(JSON.stringify(JSON.parse(resp)))
    })
    .catch(err => res.send(err))
  // next()
}
