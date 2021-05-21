const { db } = require('../lib/db');

async function getAllSeatsByHallAndDate(hall_id, date_start, date_end) {
  const seats = await db.query("SELECT ssl.seat_id, ssl.seat_status_id, ss.seat_status_name, s.seat_row, s.seat_number, ssl.seat_status_date FROM seat_status_log ssl JOIN seat_status ss ON ssl.seat_status_id = ss.seat_status_id JOIN seat s ON ssl.seat_id = s.seat_id WHERE s.hall_id = $1 GROUP BY ssl.seat_id, ssl.seat_status_id, ssl.seat_status_date, ss.seat_status_name, s.seat_row, s.seat_number, ssl.seat_status_date HAVING ssl.seat_status_date =( SELECT MAX(seat_status_date) FROM seat_status_log WHERE ssl.seat_id = seat_id AND seat_status_date <= $2 AND seat_status_date < $3) ORDER BY s.seat_row, s.seat_number", [hall_id, date_start, date_end]);

  const chunkIndexes = [0];
  currentRow = seats.rows[0].seat_row;
  seats.rows.forEach((s, i) => {
    if (s.seat_row !== currentRow) {
      chunkIndexes.push(i);
      currentRow = s.seat_row;
    }
  });

  const result = [];
  chunkIndexes.forEach((n, i) => {
    result.push(seats.rows.slice(n, chunkIndexes[i + 1]));
  });
  return result;
}

async function getAllSeatsByReservation(reservation_id, hall_id, date_start, date_end) {
  const seats = await db.query('SELECT ssl.seat_id, ssl.seat_status_id, ss.seat_status_name, s.seat_row, s.seat_number, ssl.seat_status_date FROM seat_status_log ssl JOIN seat_status ss ON ssl.seat_status_id = ss.seat_status_id JOIN seat s ON ssl.seat_id = s.seat_id WHERE s.hall_id = $2 AND s.seat_id IN( SELECT seat_id FROM seat_to_reservation WHERE reservation_id = $1) GROUP BY ssl.seat_id, ssl.seat_status_id, ssl.seat_status_date, ss.seat_status_name, s.seat_row, s.seat_number, ssl.seat_status_date HAVING ssl.seat_status_date =( SELECT MAX(seat_status_date) FROM seat_status_log WHERE ssl.seat_id = seat_id AND seat_status_date <= $3 AND seat_status_date < $4 ) ORDER BY s.seat_row, s.seat_number', [reservation_id, hall_id, date_start, date_end]);
  if (seats.rows.length === 0) return null;

  return seats.rows;
}

module.exports = {
  getAllSeatsByHallAndDate,
  getAllSeatsByReservation
};
