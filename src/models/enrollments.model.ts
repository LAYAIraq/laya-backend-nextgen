// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const enrollments = sequelizeClient.define('enrollments', {
    feedback: {
      type: DataTypes.JSON
    },
    progress: {
      type: DataTypes.STRING
    },
    finished: {
      type: DataTypes.BOOLEAN
    },
    returned: {
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
  (enrollments as any).associate = function (models: any): void {
    enrollments.belongsTo(models.accounts, {
      foreignKey: {
        name: 'studentId',
        allowNull: false
      }
    })
    enrollments.belongsTo(models.courses, {
      foreignKey: {
        name: 'courseId',
        allowNull: false
      }
    })
    // See https://sequelize.org/master/manual/assocs.html
  }

  return enrollments
}
