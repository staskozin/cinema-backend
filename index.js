const restify = require('restify');
const { getAllMovies, getMovie } = require('./endpoint/movie');
const { getAllShowtimes, getShowtime, getShowtimesByMovieId } = require('./endpoint/showtime');

const wrap = function (fn) {
  return function (req, res, next) {
    return fn(req, res, next).catch(function (err) {
      return next(err);
    });
  };
};

const server = restify.createServer();

server.get('/movie', wrap(async (req, res) => {
  const movies = await getAllMovies();
  res.header('content-type', 'json');
  res.send(movies);
}));

server.get('/movie/:id', wrap(async (req, res) => {
  const movie = await getMovie(req.params.id);
  res.header('content-type', 'json');
  if (movie === null) {
    res.status(404);
    res.send({ message: 'Фильм не найден' });
  } else {
    res.send(movie);
  }
}));

server.get('/showtime', wrap(async (req, res) => {
  const showtimes = await getAllShowtimes();
  res.header('content-type', 'json');
  res.send(showtimes);
}));

server.get('/showtime/:id', wrap(async (req, res) => {
  const showtime = await getShowtime(req.params.id);
  res.header('content-type', 'json');
  if (showtime === null) {
    res.status(404);
    res.send({ message: 'Сеанс не найдены' });
  } else {
    res.send(showtime);
  }
}));

server.get('/showtime/movie/:movie_id', wrap(async (req, res) => {
  const showtime = await getShowtimesByMovieId(req.params.movie_id);
  res.header('content-type', 'json');
  if (showtime.length === 0) {
    res.status(404);
    res.send({ message: 'Сеансы не найдены' });
  } else {
    res.send(showtime);
  }
}));

server.listen(3006, '127.0.0.1');
