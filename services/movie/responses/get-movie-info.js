module.exports.schema = (movie, actors) => {
    return {
        Title: movie.name,
        ["Release Year"]: movie.date,
        Format: movie.format,
        Stars: actors
    }
}