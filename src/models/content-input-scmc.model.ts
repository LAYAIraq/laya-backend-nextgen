// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const contentInputScmc = sequelizeClient.define('content_input_scmc', {
    maxTries: {
      type: DataTypes.INTEGER
    },
    contentId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    multiple: {
      type: DataTypes.BOOLEAN
    },
    options: {
      type: DataTypes.JSON
    },
    solutions: {
      type: DataTypes.JSON
    },
    task: {
      type: DataTypes.JSON
    },
    taskAudio: {
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
  (contentInputScmc as any).associate = function (models: any): void {
    contentInputScmc.belongsTo(models.course_content, {
      foreignKey: 'contentId'
    })
    // See https://sequelize.org/master/manual/assocs.html
  }

  return contentInputScmc
}
