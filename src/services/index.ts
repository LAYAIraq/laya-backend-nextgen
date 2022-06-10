import { Application } from '../declarations'
import accounts from './accounts/accounts.service'
import userMediaPrefs from './user-media-prefs/user-media-prefs.service'
import userAppearancePrefs from './user-appearance-prefs/user-appearance-prefs.service'
import authorApplications from './author-applications/author-applications.service';
import applicationHistory from './application-history/application-history.service';
import courses from './courses/courses.service';
import courseContent from './course-content/course-content.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(accounts)
  app.configure(userMediaPrefs)
  app.configure(userAppearancePrefs)
  app.configure(authorApplications);
  app.configure(applicationHistory);
  app.configure(courses);
  app.configure(courseContent);
}
