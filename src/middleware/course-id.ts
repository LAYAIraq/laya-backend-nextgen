import { Request, Response } from 'express'
import { Application } from '../declarations'
import checkAuthentication from '../misc/check-authentication'

export default (app: Application) => (req: Request, res: Response) => {
  /**
   * @function get the course id for the given course name
   * @author cmc
   */
  const getCourseName = (): void => {
    const courseName = req.body.courseName
    app.service('courses').find({ query: { name: courseName } })
      .then((course: any) => {
        if (course.total === 0) {
          res.status(404)
            .send({ error: 'course not found' })
        } else {
          res.send({ courseId: course.data[0].courseId })
        }
      })
      .catch((err: Error) => {
        res.status(500).send(err.message)
      })
  }
  if (req.method !== 'GET') { // only GET requests are allowed
    res.status(405)
      .send('Method not allowed')
  } else if (req.body.courseName === undefined) { // courseId is required
    res.status(400)
      .send('No course name given')
  } else {
    checkAuthentication(app, req, res, getCourseName) // check if the user is authenticated
  }
}
