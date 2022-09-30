// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const editorVotes = sequelizeClient.define('editor_votes', {
    vote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (editorVotes as any).associate = function (models: any): void {
    editorVotes.belongsTo(models.accounts, { foreignKey: 'editorId' })
    editorVotes.belongsTo(models.author_applications, { foreignKey: 'applicationId' })
  }

  return editorVotes
}
