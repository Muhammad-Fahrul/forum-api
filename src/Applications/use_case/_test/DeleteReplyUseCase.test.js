const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      reply_id: 'reply-123',
      owner: 'user-123',
    };

    const mockedReplyRepository = new ReplyRepository();
    const mockedCommentRepository = new CommentRepository();

    mockedCommentRepository.isThread = jest.fn(() => Promise.resolve());
    mockedReplyRepository.isComment = jest.fn(() => Promise.resolve());
    mockedReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockedReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

    const getReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockedReplyRepository,
      commentRepository: mockedCommentRepository,
    });

    await getReplyUseCase.execute(useCasePayload);

    expect(mockedCommentRepository.isThread).toBeCalledWith(useCasePayload.thread_id);
    expect(mockedReplyRepository.isComment).toBeCalledWith(useCasePayload.comment_id);
    expect(mockedReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload);
    expect(mockedReplyRepository.deleteReply).toBeCalledWith(useCasePayload.reply_id);
  });
});
