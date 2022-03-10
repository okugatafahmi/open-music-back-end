class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, songsService, activitiessService, validator) {
    this.playlistsService = playlistsService;
    this.playlistSongsService = playlistSongsService;
    this.songsService = songsService;
    this.activitiesService = activitiessService;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsByPlaylistIdHandler = this.getPlaylistSongsByPlaylistIdHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    this.getPlaylistSongActivites = this.getPlaylistSongActivites.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this.validator.validatePostPlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this.playlistsService.addPlaylist({ name, owner: credentialId });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: { playlistId },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this.playlistsService.verifyPlaylistOwner(id, credentialId);
      await this.playlistsService.deletePlaylistById(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this.validator.validatePostPlaylistSongPayload(request.payload);
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this.playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this.songsService.verifySongId(songId);
      const id = await this.playlistSongsService.addPlaylistSong({ playlistId, songId });
      await this.activitiesService.addActivity({
        playlistId,
        songId,
        userId: credentialId,
        action: 'add',
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu playlist berhasil ditambahkan',
        data: { id },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPlaylistSongsByPlaylistIdHandler(request) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this.playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this.playlistsService.getPlaylistById(playlistId);
      const playlistSongs = await this.playlistSongsService
        .getPlaylistSongsByPlaylistId(playlistId);
      playlist.songs = playlistSongs;

      return {
        status: 'success',
        data: {
          playlist,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deletePlaylistSongHandler(request) {
    try {
      this.validator.validateDeletePlaylistSongPayload(request.payload);
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this.playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this.playlistSongsService.verifyPlaylistSong(playlistId, songId);
      await this.playlistSongsService.deletePlaylistSong(playlistId, songId);
      await this.activitiesService.addActivity({
        playlistId,
        songId,
        userId: credentialId,
        action: 'delete',
      });

      return {
        status: 'success',
        message: 'Lagu playlist berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async getPlaylistSongActivites(request) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this.playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const activities = await this.activitiesService.getActivitiesByPlaylistId(playlistId);

      return {
        status: 'success',
        data: {
          playlistId,
          activities,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PlaylistsHandler;
