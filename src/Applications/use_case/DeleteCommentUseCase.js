class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.verifyCommentOwner(useCasePayload);
    await this._commentRepository.deleteComment(useCasePayload.id);
  }
}
module.exports = DeleteCommentUseCase;
