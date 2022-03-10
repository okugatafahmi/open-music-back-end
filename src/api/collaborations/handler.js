class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this.collaborationsService = collaborationsService;
    this.playlistsService = playlistsService;
    this.usersService = usersService;
    this.validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this.validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this.usersService.verifyUserId(userId);
      await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      const collaborationId = await this.collaborationsService.addCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async deleteCollaborationHandler(request) {
    try {
      this.validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this.collaborationsService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = CollaborationsHandler;
