//auth 테이블 정보 담기
module.exports = (sequelize, DataTypes) => (
    sequelize.define('auth', {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        type: { // 1회원가입용 2회사합류용
            type: DataTypes.INTEGER, 
            allowNull: true,
        }, 
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);