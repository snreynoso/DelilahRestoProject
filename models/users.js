module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: 'username'
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: 'email'
        },
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING
    },
        {
            timestamps: false
        }
    )
}