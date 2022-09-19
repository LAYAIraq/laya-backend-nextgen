import { Request, Response } from 'express'
import { Application } from '../declarations'
import randomPassword from '../misc/random-password'
import roles from '../misc/roles'

export default (app: Application) => (req: Request, res: Response): void => {
  const pwd = randomPassword(12)
  if (typeof (req.body.role) !== 'undefined' &&
    !(Object.values(roles).some(role => role === req.body.role))
  ) { // check if role is invalid
    res.status(403).send({ message: 'wrong role', status: 403 })
  } else if (req.method === 'POST') {
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
  } else {
    res.status(400).send({ message: 'wrong request', status: 400 })
  }
}
