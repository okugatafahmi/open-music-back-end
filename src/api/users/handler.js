class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this.validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;

      const userId = await this.service.addUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = UsersHandler;