module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'sessions',
      underscored: true,
      timestamps: true,
    }
  );

  Session.associate = (models) => {
    Session.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };

  return Session;
};
