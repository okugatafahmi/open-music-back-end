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

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    let songs;
    const { title, performer } = request.query;

    if (title) {
      if (performer) {
        songs = await this.service.getSongsByTitleContainsAndPerformerContains(title, performer);
      } else {
        songs = await this.service.getSongsByTitleContains(title);
      }
    } else if (performer) {
      songs = await this.service.getSongsByPerformerContains(performer);
    } else {
      songs = await this.service.getSongs();
    }

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this.service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
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
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
