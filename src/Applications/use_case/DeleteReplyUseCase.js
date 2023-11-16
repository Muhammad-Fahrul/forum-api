class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.isThread(useCasePayload.thread_id);
    await this._replyRepository.isComment(useCasePayload.comment_id);
    await this._replyRepository.verifyReplyOwner(useCasePayload);
    await this._replyRepository.deleteReply(useCasePayload.reply_id);
  }
}

module.exports = DeleteReplyUseCase;
