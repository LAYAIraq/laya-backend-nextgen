// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const flags = sequelizeClient.define('flags', {
    referenceId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    question: {
      type: DataTypes.JSON
    },
    answered: {
      type: DataTypes.BOOLEAN
    },
    anonymous: {
      type: DataTypes.BOOLEAN
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (flags as any).associate = function (models: any): void {
    flags.belongsTo(models.courses, {
      foreignKey: {
        name: 'courseId',
        allowNull: false
      }
    })
    flags.belongsTo(models.accounts, {
      foreignKey: {
        name: 'authorId',
        allowNull: false
      }
    })
    flags.belongsTo(models.enrollments, {
      foreignKey: 'enrollmentId'
    })
    // See https://sequelize.org/master/manual/assocs.html
  }

  return flags
}
