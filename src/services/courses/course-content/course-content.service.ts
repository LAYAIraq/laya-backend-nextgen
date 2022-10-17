// Initializes the `course-content` service on path `/course-contents`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { CourseContent } from './course-content.class'
import createModel from '../../../models/course-content.model'
import hooks from './course-content.hooks'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'course-contents': CourseContent & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/course-contents', new CourseContent(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('course-contents')

  service.hooks(hooks)
}
