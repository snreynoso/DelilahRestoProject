module.exports = (sequelize, DataTypes) => {
    return sequelize.define('order', {
        id_order: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: DataTypes.STRING,
        time: DataTypes.DATE,
        product_list: DataTypes.JSON,
        payment: DataTypes.STRING,
        userName: DataTypes.STRING,
        userAddress: DataTypes.STRING
    },
    {
        timestamps: false
    })
}