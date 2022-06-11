// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const contentInputWysiwyg = sequelizeClient.define('content_input_wysiwyg', {
    contents: {
      type: DataTypes.JSON
    },
    contentId: {
      type: DataTypes.UUID,
      primaryKey: true
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (contentInputWysiwyg as any).associate = function (models: any): void {
    contentInputWysiwyg.belongsTo(models.course_content, {
      foreignKey: 'contentId'
    })
    // See https://sequelize.org/master/manual/assocs.html
  };

  return contentInputWysiwyg;
}
