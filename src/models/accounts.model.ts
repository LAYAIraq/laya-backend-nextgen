// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const accounts = sequelizeClient.define('accounts', {
    avatar: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN
    },
    lang: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (accounts as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  }

  return accounts
}
