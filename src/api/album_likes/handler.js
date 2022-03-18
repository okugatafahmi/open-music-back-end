const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesHandler {
  constructor(albumLikesService, albumsService, usersService) {
    this.albumLikesService = albumLikesService;
    this.albumsService = albumsService;
    this.usersService = usersService;

    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikeCountByAlbumIdHandler = this.getAlbumLikeCountByAlbumIdHandler.bind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this.usersService.verifyUserId(userId);
    await this.albumsService.verifyAlbumId(albumId);

    try {
      await this.albumLikesService.deleteAlbumLike(userId, albumId);

      const response = h.response({
        status: 'success',
        message: 'Kesukaan album berhasil dihapus',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof NotFoundError) {
        const albumLikeId = await this.albumLikesService.addAlbumLike({ userId, albumId });

        const response = h.response({
          status: 'success',
          message: 'Kesukaan album berhasil ditambahkan',
          data: { albumLikeId },
        });
        response.code(201);
        return response;
      }
      throw error;
    }
  }

  async getAlbumLikeCountByAlbumIdHandler(request, h) {
    const { id: albumId } = request.params;

    const { likes, isCache } = await this.albumLikesService.getAlbumLikeCountByAlbumId(albumId);

    const response = h.response({
      status: 'success',
      data: { likes },
    });

    if (isCache) response.header('X-Data-Source', 'cache');

    return response;
  }
}

module.exports = AlbumLikesHandler;
