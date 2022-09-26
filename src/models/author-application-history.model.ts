// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const authorApplicationHistory = sequelizeClient.define('author_application_history', {
    applicationText: {
      type: DataTypes.STRING
    },
    areaOfExpertise: {
      type: DataTypes.STRING
    },
    fullName: {
      type: DataTypes.STRING
    },
    institution: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (authorApplicationHistory as any).associate = function (models: any): void {
    authorApplicationHistory.belongsTo(models.author_applications, { foreignKey: 'applicationId' })
  }

  return authorApplicationHistory
}
