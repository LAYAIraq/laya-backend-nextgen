// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const contentInputRelate = sequelizeClient.define('content_input_relate', {
    contentId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    task: {
      type: DataTypes.JSON
    },
    taskAudio: {
      type: DataTypes.STRING
    },
    pairs: {
      type: DataTypes.JSON
    },
    relations: {
      type: DataTypes.JSON
    },
    relationsSimple: {
      type: DataTypes.JSON
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (contentInputRelate as any).associate = function (models: any): void {
    contentInputRelate.belongsTo(models.course_content, {
      foreignKey: 'contentId'
    })
    // See https://sequelize.org/master/manual/assocs.html
  }

  return contentInputRelate
}
