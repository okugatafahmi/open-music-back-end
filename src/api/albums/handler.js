const { getResponse, getErrorResponse } = require('../../utils');

class AlbumsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this.service.addAlbum({ name, year });

      const response = getResponse(h, 201, 'Album berhasil ditambahkan', { albumId });
      return response;
    } catch (error) {
      return getErrorResponse(h, error);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this.service.getAlbumById(id);
      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      return getErrorResponse(h, error);
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { id } = request.params;

      await this.service.editAlbumById(id, { name, year });

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      return getErrorResponse(h, error);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      return getErrorResponse(h, error);
    }
  }
}

module.exports = AlbumsHandler;
