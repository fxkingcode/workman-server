//user 테이블 정보 담기

module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        user_uid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        password: {
            type: DataTypes.STRING, 
            allowNull: true,
        }, 
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
        }, 
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            //unique: true,
        }, 
        phone_number: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        rank: {//직급 1사원 2중간관리자 3최고관리자
            type: DataTypes.INTEGER, 
            allowNull: true,
        }, 
        group: {//소속조 1,2,3,4,5,6,7
            type: DataTypes.INTEGER, 
            allowNull: true,
        }, 
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);