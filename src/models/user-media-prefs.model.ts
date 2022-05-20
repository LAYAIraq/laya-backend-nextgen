// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const userMediaPrefs = sequelizeClient.define('user_media_prefs', {
    audio: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    simple: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    text: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    video: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (userMediaPrefs as any).associate = function (models: any): void {
    userMediaPrefs.belongsTo(models.accounts, {
      foreignKey: 'id'
    })
    // See https://sequelize.org/master/manual/assocs.html
  };

  return userMediaPrefs;
}
