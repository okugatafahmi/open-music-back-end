const ClientError = require('../exceptions/ClientError');

const getResponse = (h, statusCode = 500, message = 'Maaf, terjadi kegagalan pada server kami.', data = null) => {
  let response;

  switch (Math.floor(statusCode / 100)) {
    case 2:
      response = h.response({
        status: 'success',
        message,
        data,
      });
      break;

    case 4:
      response = h.response({
        status: 'fail',
        message,
      });
      break;

    default:
      response = h.response({
        status: 'error',
        message,
      });
      break;
  }

  response.code(statusCode);
  return response;
};

const getErrorResponse = (h, error) => {
  if (error instanceof ClientError) {
    const response = getResponse(h, error.statusCode, error.message);
    return response;
  }

  // Server ERROR!
  const response = getResponse(h);
  return response;
};

const mapSongDBToModel = ({
  // eslint-disable-next-line camelcase
  id, title, year, performer, genre, duration, album_id,
}) => ({
  // eslint-disable-next-line camelcase
  id, title, year, performer, genre, duration, albumId: album_id,
});

const mapSongs = ({ id, title, performer }) => ({ id, title, performer });

module.exports = {
  getResponse,
  getErrorResponse,
  mapSongDBToModel,
  mapSongs,
};
