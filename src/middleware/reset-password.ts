import { Request, Response } from 'express'
import { Application } from '../declarations'
import randomPassword from '../misc/randomPassword'
import createVerificationToken from '../misc/create-verification-token'

export default (app: Application) => (req: Request, res: Response): void => {
  const pwd = randomPassword(12)
  // console.log(req.params)
  // console.log(req.headers.authorization)
  app.service('accounts').patch(req.params.id, {
    password: pwd,
    verificationToken: createVerificationToken(16)
  })
    .then(() => { // resetting worked
      res.send(true)
    })
    .catch((err: Error) => res.send(err))
}
