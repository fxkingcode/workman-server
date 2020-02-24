module.exports = (sequelize, DataTypes) => {
  return Employee = sequelize.define('Employee', {
    employeeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    timestamps: true, //생성일, 수정일 기록
    paranoid: true, //삭제일기록(복구용)
  })
}
