module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING
    },
    {
        timestamps: false
    })
}