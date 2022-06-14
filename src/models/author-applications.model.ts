// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const authorApplications = sequelizeClient.define('author_applications', {
    accepted: {
      type: DataTypes.BOOLEAN
    },
    applicationText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    areaOfExpertise: {
      type: DataTypes.STRING,
      allowNull: false
    },
    decidedOn: {
      type: DataTypes.DATE
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
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
  (authorApplications as any).associate = function (models: any): void {
    authorApplications.belongsTo(models.accounts, {
      foreignKey: 'applicantId'
    })
    authorApplications.hasMany(models.application_history)
  }

  return authorApplications
}
