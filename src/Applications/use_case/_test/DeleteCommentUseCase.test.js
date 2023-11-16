const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
    };

    const mockedCommentRepository = new CommentRepository();

    mockedCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockedCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockedCommentRepository,
    });

    await getCommentUseCase.execute(useCasePayload);

    expect(mockedCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload);
    expect(mockedCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.id);
  });
});
