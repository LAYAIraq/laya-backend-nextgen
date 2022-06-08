import { Application } from '../declarations'
import accounts from './accounts/accounts.service'
import userMediaPrefs from './user-media-prefs/user-media-prefs.service'
import userAppearancePrefs from './user-appearance-prefs/user-appearance-prefs.service'
import authorApplications from './author-applications/author-applications.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(accounts)
  app.configure(userMediaPrefs)
  app.configure(userAppearancePrefs)
  app.configure(authorApplications);
}
