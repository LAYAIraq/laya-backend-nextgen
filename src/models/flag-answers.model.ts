// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const flagAnswers = sequelizeClient.define('flag_answers', {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (flagAnswers as any).associate = function (models: any): void {
    flagAnswers.belongsTo(models.flags, {
      foreignKey: {
        name: 'flagId',
        allowNull: false
      }
    })
    flagAnswers.belongsTo(models.accounts, {
      foreignKey: {
        name: 'authorId',
        allowNull: false
      }
    })
  }

  return flagAnswers
}
