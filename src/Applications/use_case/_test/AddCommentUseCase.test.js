const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddCommentUseCase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'this is comment',
      commented_id: 'thread-123',
      owner: 'user-123',
    };

    const mockedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockedCommentRepository = new CommentRepository();

    mockedCommentRepository.isThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockedCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockedAddedComment));

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockedCommentRepository,
    });

    const addedComment = await getCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockedCommentRepository.isThread).toBeCalledWith(useCasePayload.commented_id);
    expect(mockedCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      commented_id: useCasePayload.commented_id,
      owner: useCasePayload.owner,
    }));
  });
});
