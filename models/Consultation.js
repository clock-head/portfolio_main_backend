module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define(
    'Consultation',
    {
      consultation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      selected_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      selected_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'attended', 'cancelled'),
        defaultValue: 'pending',
      },
      resolution_status: {
        type: DataTypes.ENUM('resolved', 'open'),
        defaultValue: 'open',
      },
      has_rescheduled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'consultations',
      underscored: true,
      timestamps: true,
    }
  );

  Consultation.associate = (models) => {
    Consultation.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'SET NULL',
    });
  };

  return Consultation;
};
