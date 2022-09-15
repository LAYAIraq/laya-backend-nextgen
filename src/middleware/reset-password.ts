import { Request, Response } from 'express'
import { Application } from '../declarations'
import randomPassword from '../misc/randomPassword'
import createVerificationToken from '../misc/create-verification-token'

export default (app: Application) => (req: Request, res: Response): void => {
  const accounts = app.service('accounts')
  accounts.get(req.params.id)
    .then((account: any) => {
      if (account.locked === null) {
        accounts.patch(req.params.id, {
          password: randomPassword(12),
          verificationToken: createVerificationToken(16),
          locked: Date.now() + 1000 * 60 * 60 * 24
        })
          .then(() => { // resetting worked
            // TODO: send email
            res.send(true)
          })
          .catch((err: Error) => res.send(err))
      } else {
        res.status(403).send('Account is locked')
      }
    })
    .catch((err: Error) => res.send(err))
}
