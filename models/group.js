module.exports = (sequelize, DataTypes) => {
  return Group = sequelize.define('Group', {
    groupId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    marker: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true, //생성일, 수정일 기록
    paranoid: true, //삭제일기록(복구용)
  })
}
