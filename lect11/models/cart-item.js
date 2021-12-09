const Sequelize = require('sequelize');

const sequelize = require('../util/database');


//? each cart item is essentially a combination of product and the ID of the cart in which 
//? this product is lies and the quantity of this product

//? The ID of the cart to which it is related doesnt have to be added by us hcz we again create 
//? and ASSOCIATION and let sequelize manage it
const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = CartItem;
