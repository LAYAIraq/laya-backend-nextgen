import { Application } from '../declarations'
import accounts from './accounts/accounts.service'
import authorApplicationHistory from './author-applications/author-application-history/author-application-history.service'
import authorApplications from './author-applications/author-applications.service'
import contentInputDialog from './courses/content-input-dialog/content-input-dialog.service'
import contentInputDragDrop from './courses/content-input-drag-drop/content-input-drag-drop.service'
import contentInputPlyr from './courses/content-input-plyr/content-input-plyr.service'
import contentInputRelate from './courses/content-input-relate/content-input-relate.service'
import contentInputScmc from './courses/content-input-scmc/content-input-scmc.service'
import contentInputWysiwyg from './courses/content-input-wysiwyg/content-input-wysiwyg.service'
import courseContent from './courses/course-content/course-content.service'
import courses from './courses/courses.service'
import editorVoteHistory from './editor-votes/editor-vote-history/editor-vote-history.service'
import editorVotes from './editor-votes/editor-votes.service'
import enrollments from './enrollments/enrollments.service'
import flagAnswerHistory from './flags/flag-answers/flag-answer-history/flag-answer-history.service'
import flagAnswers from './flags/flag-answers/flag-answers.service'
import flagQuestionHistory from './flags/flag-questions/flag-question-history/flag-question-history.service'
import flagQuestions from './flags/flag-questions/flag-questions.service'
import flags from './flags/flags.service'
import notifications from './notifications/notifications.service'
import userAppearancePrefs from './accounts/user-appearance-prefs/user-appearance-prefs.service'
import userMediaPrefs from './accounts/user-media-prefs/user-media-prefs.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(accounts)
  app.configure(authorApplicationHistory)
  app.configure(authorApplications)
  app.configure(contentInputDialog)
  app.configure(contentInputDragDrop)
  app.configure(contentInputPlyr)
  app.configure(contentInputRelate)
  app.configure(contentInputScmc)
  app.configure(contentInputWysiwyg)
  app.configure(courseContent)
  app.configure(courses)
  app.configure(editorVoteHistory)
  app.configure(editorVotes)
  app.configure(enrollments)
  app.configure(flagAnswerHistory)
  app.configure(flagAnswers)
  app.configure(flagQuestionHistory)
  app.configure(flagQuestions)
  app.configure(flags)
  app.configure(notifications)
  app.configure(userAppearancePrefs)
  app.configure(userMediaPrefs)
}
