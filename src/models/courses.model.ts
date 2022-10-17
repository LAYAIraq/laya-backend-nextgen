// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const courses = sequelizeClient.define('courses', {
    courseId: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    abstract: {
      type: DataTypes.STRING
    },
    storageId: {
      type: DataTypes.STRING
    },
    root: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (courses as any).associate = function (models: any): void {
    // Define associations here
    courses.belongsTo(models.accounts, {
      foreignKey: {
        name: 'authorId'
        // allowNull: false
      }
    })

    courses.hasMany(models.course_content, {
      foreignKey: 'courseId'
    })

    // See https://sequelize.org/master/manual/assocs.html
  }

  return courses
}
