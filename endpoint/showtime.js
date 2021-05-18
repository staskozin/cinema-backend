const { db } = require('../lib/db');
const { getAllSeatsByHallAndDate } = require('./seat');

async function getAllShowtimes() {
  const showtimes = await db.query('SELECT * FROM showtime WHERE showtime_date > CURRENT_DATE ORDER BY showtime_date');
  return showtimes.rows.map((showtime) => {
    return {
      ...showtime,
      price: Number(showtime.price)
    };
  });
}

async function getShowtime(id) {
  const showtime = await db.query('SELECT s.showtime_id, s.showtime_date, s.showtime_date + m.duration AS "showtime_end_date", s.price, s.movie_id, s.hall_id, m.movie_name, m.age_restriction FROM showtime s JOIN movie m ON s.movie_id = m.movie_id WHERE showtime_id = $1', [id]);
  const seats = await getAllSeatsByHallAndDate(showtime.rows[0].hall_id, showtime.rows[0].showtime_date, showtime.rows[0].showtime_end_date);
  return {
    ...showtime.rows[0],
    price: Number(showtime.rows[0].price),
    age_restriction: Number(showtime.rows[0].age_restriction),
    seats
  };
}

async function getShowtimesByMovieId(movie_id) {
  const showtimes = await db.query('SELECT * FROM showtime WHERE showtime_date > CURRENT_DATE AND movie_id = $1 ORDER BY showtime_date', [movie_id]);
  return showtimes.rows.map((showtime) => {
    return {
      ...showtime,
      price: Number(showtime.price)
    };
  });
}

module.exports = {
  getAllShowtimes,
  getShowtime,
  getShowtimesByMovieId
};
