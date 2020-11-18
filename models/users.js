module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING
    },
    {
        timestamps: false
    })
}