import { Request, Response } from 'express'
import { Application } from '../declarations'
import { NotFound, MethodNotAllowed, BadRequest, GeneralError } from '@feathersjs/errors'
import checkAuthentication from '../misc/check-authentication'
import applicationStatuses from '../misc/application-statuses'

export default (app: Application) => (req: Request, res: Response): void => {
  const changeApplicationStatus = (): void => {
    app.service('author-applications').patch(req.params.id, req.body)
      .then((decidedApplication: any) => {
        res.send({ decidedApplication })
      })
      .catch(() => {
        res.status(500).send(new GeneralError('something went wrong'))
      })
  }
  const handleApplicationDecision = (): void => {
    app.service('author-applications').get(req.params.id)
      .then((application) => {
        if (application.status !== 'pending') {
          res.status(400).send(new BadRequest('Application already decided'))
        } else if (req.body.status === 'withdrawn') { // withdraw application, only possible for applicant
          checkAuthentication(app, req, res, changeApplicationStatus, 'student', application.applicantId)
        } else { // decide application, only possible for editor
          checkAuthentication(app, req, res, changeApplicationStatus, 'editor')
        }
      })
      .catch((err: Error) => { // application not found
        res.status(404).send(new NotFound(err.message))
      })
  }

  if (req.method !== 'PATCH') {
    res.status(405).send(new MethodNotAllowed('Method not allowed'))
  } else if (req.body.status === undefined || req.body.decidedOn === undefined) {
    res.status(400).send(new BadRequest('not all required fields are set'))
  } else if (!applicationStatuses.includes(req.body.status)) {
    res.status(400).send(new BadRequest('invalid decision'))
  } else {
    handleApplicationDecision()
  }
}
