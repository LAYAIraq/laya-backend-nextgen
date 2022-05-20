import { Application } from '../declarations'
import accounts from './accounts/accounts.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(accounts)
}
