const {Model, DataTypes} = require('sequelize')
const sequelize = require('../config/database')

class User extends Model {
}

User.init({
    email: {
        type: DataTypes.STRING
    }, password: {
        type: DataTypes.STRING
    }
}, {
    sequelize, modelName: 'User', timestamps: false 
})

module.exports = User;