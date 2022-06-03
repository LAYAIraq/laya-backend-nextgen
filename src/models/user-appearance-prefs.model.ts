// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const userAppearancePrefs = sequelizeClient.define('user_appearance_prefs', {
    fontSize: {
      type: DataTypes.INTEGER,
      defaultValue: 18
    },
    fontType: {
      type: DataTypes.STRING,
      defaultValue: 'standard'
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (userAppearancePrefs as any).associate = function (models: any): void {
    userAppearancePrefs.belongsTo(models.accounts, {
      foreignKey: 'id'
    })
    // See https://sequelize.org/master/manual/assocs.html
  }

  return userAppearancePrefs
}
