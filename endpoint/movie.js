const { db } = require('../lib/db');

async function getAllMovies() {
  const movies = await db.query('SELECT * FROM movie')
  return movies.rows;
}

module.exports = {
  getAllMovies
};
