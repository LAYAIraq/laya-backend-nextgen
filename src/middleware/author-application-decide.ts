import { Request, Response } from 'express'
import { Application } from '../declarations'

export default (app: Application) => (req: Request, res: Response): void => {
  res.send('Hello World!')
}
