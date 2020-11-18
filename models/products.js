module.exports = (sequelize, DataTypes) => {
    return sequelize.define('product', {
        id_product: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        price: DataTypes.INTEGER
    },
    {
        timestamps: false
    })
}