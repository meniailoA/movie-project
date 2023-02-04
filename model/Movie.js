const {Model, DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const FormatMovieEnum = require('./enum/format-movie.enum')

class Movie extends Model {
}

Movie.init({
    name: {
        type: DataTypes.STRING
    }, date: {
        type: DataTypes.DATE
    }, format: {
        type: DataTypes.ENUM(FormatMovieEnum.DVD, FormatMovieEnum.BLUE_RAY, FormatMovieEnum.VNS)
    }
}, { sequelize, modelName: 'Movie', timestamps: false  })


module.exports = Movie;