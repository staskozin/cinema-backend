const { db } = require('../lib/db');

async function getAllMovies() {
  const movies = await db.query('SELECT * FROM movie');
  return movies.rows.map((movie) => {
    return {
      ...movie,
      age_restriction: Number(movie.age_restriction)
    };
  });
}

async function getMovie(id) {
  const movie = await db.query('SELECT * FROM movie WHERE movie_id = $1', [id]);
  if (movie.rows.length === 0) return null;
  return {
    ...movie.rows[0],
    age_restriction: Number(movie.rows[0].age_restriction)
  }
}

module.exports = {
  getAllMovies,
  getMovie
};
