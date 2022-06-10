// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const courseContent = sequelizeClient.define('course_content', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    preceeding: {
      type: DataTypes.JSON
    },
    succeeding: {
      type: DataTypes.JSON
    },
    title: {
      type: DataTypes.JSON
    }

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (courseContent as any).associate = function (models: any): void {
    courseContent.belongsTo(models.courses, {
      foreignKey: 'courseId'
    })
    // See https://sequelize.org/master/manual/assocs.html
  };

  return courseContent;
}
