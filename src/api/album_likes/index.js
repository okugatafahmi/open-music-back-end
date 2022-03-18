const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'album_likes',
  version: '1.0.0',
  register: async (server, { albumLikesService, albumsService, usersService }) => {
    const albumsHandler = new AlbumLikesHandler(albumLikesService, albumsService, usersService);
    server.route(routes(albumsHandler));
  },
};
