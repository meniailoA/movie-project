const {Model, DataTypes} = require('sequelize')
const sequelize = require('../config/database')

class Actor extends Model {
}

Actor.init({
    firstName: {
        type: DataTypes.STRING
    }, lastName: {
        type: DataTypes.STRING
    }
}, { sequelize, modelName: 'Actor', timestamps: false  })


module.exports = Actor;