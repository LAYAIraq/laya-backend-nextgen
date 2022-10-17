// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const notifications = sequelizeClient.define('notifications', {
    noteId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    data: {
      type: DataTypes.JSON
    },
    type: {
      type: DataTypes.STRING
    },
    read: {
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
  (notifications as any).associate = function (models: any): void {
    notifications.belongsTo(models.accounts, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    })
  }

  return notifications
}
