// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const contentInputDragDrop = sequelizeClient.define('content_input_drag_drop', {
    categories: {
      type: DataTypes.JSON
    },
    contentId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    items: {
      type: DataTypes.JSON
    },
    task: {
      type: DataTypes.JSON
    },
    taskAudio: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (contentInputDragDrop as any).associate = function (models: any): void {
    contentInputDragDrop.belongsTo(models.course_content, {
      foreignKey: 'contentId'
    })
    // See https://sequelize.org/master/manual/assocs.html
  };

  return contentInputDragDrop;
}
