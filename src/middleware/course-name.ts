/**
 * @file course-name.ts - middleware to get a course name by its id
 * @author cmc
 * @since v0.0.1
 */
import { Request, Response } from 'express'
import { Application } from '../declarations'
import checkAuthentication from '../misc/check-authentication'

/**
 * @function return course name for given course id
 * @author cmc
 * @param app The feathers application
 */
export default (app: Application) => (req: Request, res: Response) => {
  /**
   * @function get course name for id
   * @author cmc
   */
  const getCourseName = (): void => {
    app.service('courses').get(req.body.courseId)
      .then((course) => {
        res.send({ courseName: course.name })
      })
      .catch((err) => {
        res.status(err.code).send(err)
      })
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed')
  } else if (req.body.courseId === undefined) {
    res.status(400).send('No courseId given')
  } else {
    checkAuthentication(app, req, res, getCourseName)
  }
}
