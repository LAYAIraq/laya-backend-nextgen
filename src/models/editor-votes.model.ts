// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const editorVotes = sequelizeClient.define('editor_votes', {
    edited: {
      type: DataTypes.BOOLEAN
    },
    vote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    editorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'accounts',
        key: 'id'
      }
    },
    applicationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'author_applications',
        key: 'id'
      }
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      },
      beforeCreate (instance: any): HookReturn {
        console.log(instance)
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (editorVotes as any).associate = function (models: any): void {
    // editorVotes.hasOne(models.accounts)
    // editorVotes.hasOne(models.author_applications)
  }

  return editorVotes
}
