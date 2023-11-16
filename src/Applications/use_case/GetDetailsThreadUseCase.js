/* eslint-disable no-param-reassign */
class GetDetailsThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getDetailsThread(useCasePayload.threadId);
    thread.comments = await this._commentRepository.getComments(useCasePayload.threadId);
    const replies = await this._replyRepository.getReplyByComment(useCasePayload.threadId);

    thread.comments = this._getRepliesComments(thread.comments, replies);
    return thread;
  }

  _getRepliesComments(comments, repliesComment) {
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].replies = repliesComment
        .filter((reply) => reply.replayed_id === comments[i].id)
        .map((reply) => {
          const { replayed_id, ...detailReply } = reply;
          return detailReply;
        });
    }
    return comments;
  }
}

module.exports = GetDetailsThreadUseCase;
