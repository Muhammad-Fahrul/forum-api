const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepositroy = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._commentRepository.isThread(useCasePayload.thread_id);
    await this._replyRepositroy.isComment(useCasePayload.replayed_id);
    return this._replyRepositroy.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
