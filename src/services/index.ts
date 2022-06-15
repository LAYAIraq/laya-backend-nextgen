import { Application } from '../declarations'
import accounts from './accounts/accounts.service'
import userMediaPrefs from './accounts/user-media-prefs/user-media-prefs.service'
import userAppearancePrefs from './accounts/user-appearance-prefs/user-appearance-prefs.service'
import authorApplications from './author-applications/author-applications.service'
import applicationHistory from './author-applications/application-history/application-history.service'
import courses from './courses/courses.service'
import courseContent from './courses/course-content/course-content.service'
import contentInputDialog from './courses/content-input-dialog/content-input-dialog.service'
import contentInputPlyr from './courses/content-input-plyr/content-input-plyr.service'
import contentInputWysiwyg from './courses/content-input-wysiwyg/content-input-wysiwyg.service'
import contentInputScmc from './courses/content-input-scmc/content-input-scmc.service'
import contentInputDragDrop from './courses/content-input-drag-drop/content-input-drag-drop.service'
import contentInputRelate from './courses/content-input-relate/content-input-relate.service'
import flags from './flags/flags.service'
import enrollments from './enrollments/enrollments.service'
import flagAnswers from './flags/flag-answers/flag-answers.service'
import notifications from './notifications/notifications.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(accounts)
  app.configure(userMediaPrefs)
  app.configure(userAppearancePrefs)
  app.configure(authorApplications)
  app.configure(applicationHistory)
  app.configure(courses)
  app.configure(courseContent)
  app.configure(contentInputDialog)
  app.configure(contentInputPlyr)
  app.configure(contentInputWysiwyg)
  app.configure(contentInputScmc)
  app.configure(contentInputDragDrop)
  app.configure(contentInputRelate)
  app.configure(flags)
  app.configure(enrollments)
  app.configure(flagAnswers)
  app.configure(notifications)
}
