module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
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
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      locked_until: {
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
