module.exports = (sequelize, DataTypes) => {
    return sequelize.define('product', {
        id_product: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        price: DataTypes.INTEGER
    },
    {
        timestamps: false
    })
}