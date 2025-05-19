module.exports = (sequelize, DataTypes) => {
  const Job_Booking = sequelize.define(
    'Job_Booking',
    {
      job_booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      locked_in: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'job_bookings',
      underscored: true,
      timestamps: true,
    }
  );

  Job_Booking.associate = (models) => {
    Job_Booking.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };

  return Job_Booking;
};
