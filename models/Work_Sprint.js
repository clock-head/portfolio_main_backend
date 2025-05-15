module.exports = (sequelize, DataTypes) => {
  const Work_Sprint = sequelize.define(
    'Work_Sprint',
    {
      work_sprint_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sprint_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      sprint_start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      sprint_end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      tableName: 'work_sprints',
      underscored: true,
      timestamps: true,
    }
  );

  Work_Sprint.associate = (models) => {
    // No foreign keys at this time; pure schedule block
  };

  return Work_Sprint;
};
