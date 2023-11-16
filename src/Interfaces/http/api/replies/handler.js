const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId: thread_id, commentId: replayed_id } = request.params;
    const { content } = request.payload;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const addedReply = await addReplyUseCase.execute({
      content, owner, replayed_id, thread_id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { threadId: thread_id, commentId: comment_id, replyId: reply_id } = request.params;

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    await deleteReplyUseCase.execute({
      thread_id, comment_id, reply_id, owner,
    });

    return {
      status: 'success',
      message: 'Terhapus',
    };
  }
}

module.exports = RepliesHandler;
