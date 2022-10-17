// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const flagQuestions = sequelizeClient.define('flag_questions', {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  (flagQuestions as any).associate = function (models: any): void {
    flagQuestions.hasMany(models.flag_question_history, {
      foreignKey: 'questionId',
      onDelete: 'CASCADE'
    })
  }

  return flagQuestions
}
