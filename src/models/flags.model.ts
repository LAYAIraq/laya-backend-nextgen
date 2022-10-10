// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const flags = sequelizeClient.define('flags', {
    answered: {
      type: DataTypes.BOOLEAN
    },
    anonymous: {
      type: DataTypes.BOOLEAN
    },
    referenceId: {
      type: DataTypes.UUIDV4,
      primaryKey: true
    },
    question: {
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

  (flags as any).associate = function (models: any): void {
    // flags.hasOne(models.flag_questions, {
    //   foreignKey: 'id',
    //   onDelete: 'CASCADE'
    // })
    flags.hasMany(models.flag_answers, {
      foreignKey: 'flagId',
      onDelete: 'CASCADE'
    })
  }

  return flags
}
