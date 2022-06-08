import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class AuthorApplications extends Service {
  // eslint-ignore-next-line
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
