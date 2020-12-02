module.exports = (sequelize, DataTypes) => {
    return sequelize.define('order', {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: DataTypes.STRING,
        time: DataTypes.STRING,
        payment: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        address: DataTypes.STRING
    },
        {
            timestamps: false
        }
    )

}