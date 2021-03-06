class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this.producerService = producerService;
    this.playlistsService = playlistsService;
    this.validator = validator;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    this.validator.validateExportPlaylistsPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.producerService.sendMessage('export:playlists', JSON.stringify(message));

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = ExportsHandler;
