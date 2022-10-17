/**
 * @file enrollment-get-all.ts middleware for getting all enrollments by course or student
 * @author cmc
 * @since v0.0.1
 */
import { Request, Response } from 'express'
import { Application } from '../declarations'
import checkAuthentication from '../misc/check-authentication'

/**
 * @function enrollmentGetAll middleware for getting all enrollments by course or student
 * @author cmc
 * @param app feathers application
 */
export default (app: Application) => (req: Request, res: Response) => {
  /**
   * @function populate query for getting all enrollments by course or student, send error if empty
   * @author cmc
   */
  const getEnrollments = (): void => {
    const { courseId, studentId } = req.body
    const query: { courseId?: string, studentId?: string } = {}
    if (courseId !== undefined) {
      query.courseId = courseId
    }
    if (studentId !== undefined) {
      query.studentId = studentId
    }
    if (Object.keys(query).length === 0) {
      res.status(400).send('No courseId or studentId given')
    } else {
      app.service('enrollments').find({ query })
        .then((enrollments: any) => {
          res.send(enrollments.data)
        })
        .catch((err) => {
          res.status(500).send(err)
        })
    }
  }

  if (req.method !== 'GET') { // only GET requests are allowed
    res.status(405).send('Method not allowed')
  } else {
    checkAuthentication(app, req, res, getEnrollments)
  }
}
