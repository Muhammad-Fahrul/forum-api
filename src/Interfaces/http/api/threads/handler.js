const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailsThreadUseCase = require('../../../../Applications/use_case/GetDetailsThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(
      AddThreadUseCase.name,
    );

    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadById(request) {
    const getDetailsThreadUseCase = this._container.getInstance(GetDetailsThreadUseCase.name);

    const { threadId } = request.params;

    const thread = await getDetailsThreadUseCase.execute({ threadId });

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
