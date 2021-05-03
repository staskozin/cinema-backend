const restify = require('restify');
const { getAllMovies } = require('./endpoint/movie');

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

server.listen(3001, '127.0.0.1');
