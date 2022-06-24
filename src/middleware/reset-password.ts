import { Request, Response } from 'express'
import { Application } from '../declarations'
import randomPassword from '../misc/randomPassword'
import createVerificationToken from '../misc/create-verification-token'

export default (app: Application) => (req: Request, res: Response): void => {
  const accounts = app.service('accounts')
  console.log('Authorization: ')
  console.log(req.headers.authorization)
  let secCheck = true
  if (typeof (req.headers.authorization) === 'undefined') {
    const { email } = req.body
    // console.log('Query:')
    // console.log(req.body)
    console.log(email)
    // console.log('Params: ')
    // console.log(req.params)
    // console.log('Request: ')
    // console.log(req)
    accounts.get('email', { query: { email: email } })
      .then(id => {
        if (id !== req.params.id) {
          secCheck = false
        }
      })
      .catch(() => {
        secCheck = false
      })
  }
  if (secCheck) {
    accounts.patch(req.params.id, {
      password: randomPassword(12),
      verificationToken: createVerificationToken(16)
    })
      .then(() => { // resetting worked
        // TODO: send email
        res.send(true)
      })
      .catch((err: Error) => res.send(err))
  } else {
    throw new Error('not authorized!')
  }
}
