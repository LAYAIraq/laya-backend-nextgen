import { Application } from '../declarations'
import accounts from './accounts/accounts.service'
import userMediaPrefs from './user-media-prefs/user-media-prefs.service'
import userAppearancePrefs from './user-appearance-prefs/user-appearance-prefs.service'
import authorApplications from './author-applications/author-applications.service'
import applicationHistory from './application-history/application-history.service'
import courses from './courses/courses.service'
import courseContent from './course-content/course-content.service'
import contentInputDialog from './content-input-dialog/content-input-dialog.service'
import contentInputPlyr from './content-input-plyr/content-input-plyr.service'
import contentInputWysiwyg from './content-input-wysiwyg/content-input-wysiwyg.service'
import contentInputScmc from './content-input-scmc/content-input-scmc.service'
import contentInputDragDrop from './content-input-drag-drop/content-input-drag-drop.service'
import contentInputRelate from './content-input-relate/content-input-relate.service'
import flags from './flags/flags.service'
import enrollments from './enrollments/enrollments.service'
import flagAnswers from './flag-answers/flag-answers.service'
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
}
