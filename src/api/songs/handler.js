const { getResponse, getErrorResponse } = require('../../utils');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const {
        title,
        year,
        performer,
        genre,
        duration = null,
        albumId = null,
      } = request.payload;

      const songId = await this.service.addSong({
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      });

      const response = getResponse(h, 201, 'Lagu berhasil ditambahkan', { songId });
      return response;
    } catch (error) {
      return getErrorResponse(h, error);
    }
  }

  async getSongsHandler(request) {
    let songs = await this.service.getSongs();
    const { title, performer } = request.query;

    if (title) {
      songs = songs.filter((song) => song.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (performer) {
      songs = songs.filter((song) => (
        song.performer.toLowerCase().includes(performer.toLowerCase())
      ));
    }

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this.service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      return getErrorResponse(h, error);
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const {
        title,
        year,
        performer,
        genre,
        duration = null,
        albumId = null,
      } = request.payload;
      const { id } = request.params;

      await this.service.editSongById(id, {
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      });

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };
    } catch (error) {
      return getErrorResponse(h, error);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      return getErrorResponse(h, error);
    }
  }
}

module.exports = SongsHandler;
