const { db } = require('../lib/db');

async function getAllShowtimes() {
  const showtimes = await db.query('SELECT * FROM showtime WHERE showtime_date > CURRENT_DATE ORDER BY showtime_date');
  return showtimes.rows.map((showtime) => {
    return {
      ...showtime,
      price: Number(showtime.price)
    };
  });
}

async function getShowtime(movie_id) {
  const showtimes = await db.query('SELECT * FROM showtime WHERE showtime_date > CURRENT_DATE ORDER BY showtime_date AND movie_id = $1', [movie_id]);
  return showtimes.rows.map((showtime) => {
    return {
      ...showtime,
      price: Number(showtime.price)
    };
  });
}

module.exports = {
  getAllShowtimes,
  getShowtime
};
