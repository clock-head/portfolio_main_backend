module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Session, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    User.hasOne(models.Consultation, {
      foreignKey: 'user_id',
      onDelete: 'SET NULL',
    });

    User.hasMany(models.Job_Booking, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
