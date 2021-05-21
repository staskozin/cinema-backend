const { db } = require('../lib/db');
const { getAllSeatsByReservation } = require('./seat');

async function getAllReservations() {
  const reservations = await db.query('SELECT r.reservation_id, r.phone, s.showtime_id, s.showtime_date, s.showtime_date + m.duration AS "showtime_end_date", s.price, s.movie_id, s.hall_id, COUNT(str.seat_id) AS "seat_count", m.movie_name, m.age_restriction FROM showtime s JOIN movie m ON s.movie_id = m.movie_id JOIN reservation r ON s.showtime_id = r.showtime_id JOIN seat_to_reservation str ON r.reservation_id = str.reservation_id WHERE s.showtime_id = r.showtime_id GROUP BY r.reservation_id, r.phone, s.showtime_id, s.showtime_date, showtime_end_date, s.price, s.movie_id, s.hall_id, m.movie_name, m.age_restriction');

  return reservations.rows.map((reservation) => {
    return {
      ...reservation,
      price: Number(reservation.price),
      age_restriction: Number(reservation.age_restriction),
      seat_count: Number(reservation.seat_count)
    };
  });
}

async function getReservation(id) {
  const reservation = await db.query('SELECT r.reservation_id, r.phone, s.showtime_id, s.showtime_date, s.showtime_date + m.duration AS "showtime_end_date", s.price, s.movie_id, s.hall_id, m.movie_name, m.age_restriction FROM showtime s JOIN movie m ON s.movie_id = m.movie_id JOIN reservation r ON s.showtime_id = r.showtime_id WHERE s.showtime_id = r.showtime_id AND r.reservation_id = $1', [id]);
  if (reservation.rows.length === 0) return null;

  const seats = await getAllSeatsByReservation(reservation.rows[0].reservation_id, reservation.rows[0].hall_id, reservation.rows[0].showtime_date, reservation.rows[0].showtime_end_date);

  return {
    ...reservation.rows[0],
    price: Number(reservation.rows[0].price),
    age_restriction: Number(reservation.rows[0].age_restriction),
    seats: seats
  }
}

module.exports = {
  getAllReservations,
  getReservation
};
