import { Request, Response } from 'express'
import { Application } from '../declarations'

export default (app: Application) => (req: Request, res: Response) => {
  // const courseId = req.body.courseId
  res.send({ courseName: 'test' })
}
