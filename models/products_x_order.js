module.exports = (sequelize, DataTypes) => {
    return sequelize.define('products_x_order', {
        prod_x_ord_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        order_id: DataTypes.INTEGER,
        price_each: DataTypes.INTEGER
    },
    {
        timestamps: false
    })
}