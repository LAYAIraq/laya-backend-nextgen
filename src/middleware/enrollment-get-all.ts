import { Request, Response } from 'express'
import { Application } from '../declarations'

export default (app: Application) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (req: Request, res: Response) => {
    res.send('Hello World!')
  }
}
