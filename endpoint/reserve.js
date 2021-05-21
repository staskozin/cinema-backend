const { db } = require('../lib/db');
const format = require('pg-format');

async function reserve(showtime_id, seats, phone) {
  if (phone === '') return { reservation_id: null };

  let sh = await db.query('SELECT s.showtime_id, s.showtime_date, s.showtime_date + m.duration AS "showtime_end_date" FROM showtime s JOIN movie m ON s.movie_id = m.movie_id WHERE showtime_id = $1', [showtime_id]);
  if (sh.rows.length === 0) return { reservation_id: null };

  let s = await db.query('SELECT seat_id FROM seat');
  s = s.rows.map(e => e.seat_id);
  for (let seat of seats) {
    if (!s.includes(seat))
      return { reservation_id: null };
  }

  const reservation_id = (await db.query('INSERT INTO reservation (showtime_id, phone) VALUES ($1, $2) RETURNING reservation_id', [showtime_id, phone])).rows[0].reservation_id;

  await db.query(format('INSERT INTO seat_to_reservation (reservation_id, seat_id) VALUES %L', seats.map(e => [reservation_id, e])));

  sh = sh.rows[0];
  const seat_status_log = [];
  seats.forEach(e => {
    seat_status_log.push([e, 2, sh.showtime_date], [e, 1, sh.showtime_end_date])
  });

  await db.query(format('INSERT INTO seat_status_log (seat_id, seat_status_id, seat_status_date) VALUES %L', seat_status_log));

  return { reservation_id: reservation_id };
}

module.exports = {
  reserve
};
